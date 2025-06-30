// --- KONFIGURASI ---
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwlw1tWueCdhxAFLRIZhpUWJxNuTPIoq9jZWCdeoMdvCInmEkWSzdGhwNUYZs64xCOh/exec";

        // --- ELEMEN HTML ---
        const tableBody = document.getElementById('data-table-body');
        const totalDataEl = document.getElementById('total-data');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const resetButton = document.getElementById('reset-button');
        const loadingIndicator = document.getElementById('loading-indicator');

        /**
         * Fungsi untuk mengambil data dari Google Apps Script
         * @param {string} query - Kata kunci pencarian (opsional)
         */
        async function fetchData(query = '') {
            showLoading(true);
            let url = WEB_APP_URL;
            if (query) {
                // Menambahkan parameter pencarian ke URL
                url += `?search=${encodeURIComponent(query)}`;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                renderTable(result.data);
                renderOverview(result.data);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
                alert("Terjadi kesalahan saat memuat data. Silakan cek console untuk detail.");
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Gagal memuat data.</td></tr>`;
            } finally {
                showLoading(false);
            }
        }

        /**
         * Fungsi untuk menampilkan data ke dalam tabel
         * @param {Array} data - Array objek data presensi
         */
        function renderTable(data) {
            tableBody.innerHTML = ''; // Kosongkan tabel sebelum diisi
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Data tidak ditemukan.</td></tr>`;
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                // Pastikan nama properti (timestamp, nim, nama) sesuai dengan header di spreadsheet (dalam huruf kecil)
                row.innerHTML = `
                    <td>${item.timestamp ? new Date(item.timestamp).toLocaleString('id-ID') : 'N/A'}</td>
                    <td>${item.nim || 'N/A'}</td>
                    <td>${item.nama || 'N/A'}</td>
                    <td>${item['mata kuliah'] || 'N/A'}</td>
                    <td>${item.kelas || 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        /**
         * Fungsi untuk memperbarui ringkasan data
         * @param {Array} data - Array objek data presensi
         */
        function renderOverview(data) {
            totalDataEl.textContent = data.length;
        }

        /**
         * Menampilkan atau menyembunyikan indikator loading
         * @param {boolean} isLoading 
         */
        function showLoading(isLoading) {
            loadingIndicator.classList.toggle('d-none', !isLoading);
        }

        // --- EVENT LISTENERS ---
        
        // Panggil fetchData saat halaman pertama kali dimuat
        document.addEventListener('DOMContentLoaded', () => fetchData());

        // Event untuk tombol cari
        searchButton.addEventListener('click', () => {
            fetchData(searchInput.value);
        });

        // Event untuk tombol reset
        resetButton.addEventListener('click', () => {
            searchInput.value = '';
            fetchData();
        });

        // Event untuk mencari saat menekan tombol Enter di input
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                fetchData(searchInput.value);
            }
        });
