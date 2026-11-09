# Katalog Produk UMKM Desa — Backend Database dan REST API

## Studi kasus
Sistem katalog digital untuk membantu pelaku UMKM desa menampilkan makanan olahan, minuman, dan kerajinan. Informasi berupa nama produk, kategori, deskripsi, harga, stok, penjual, kontak WhatsApp, dan gambar dapat dikelola melalui API. Kebutuhan fitur: lihat semua produk, lihat detail produk, cari berdasarkan nama, tambah produk, ubah produk, dan hapus produk.

## Teknologi
Node.js 18+, Express.js, PostgreSQL, `pg`, dotenv, Postman.

## Langkah menjalankan (Windows)
1. Install Node.js dan PostgreSQL; pastikan PostgreSQL berjalan.
2. Di pgAdmin, buat database dengan nama **katalog_umkm_desa** (atau perintah `CREATE DATABASE katalog_umkm_desa;` pada database postgres).
3. Buka Query Tool untuk database **katalog_umkm_desa** lalu jalankan isi file `sql/database.sql` (atau gunakan `psql -U postgres -d katalog_umkm_desa -f sql/database.sql`). File ini membuat **satu** tabel `produk_umkm` dan memasukkan **tiga** contoh produk. Jangan jalankan INSERT berulang jika tidak ingin duplikat.
4. Salin `.env.example` menjadi `.env`, lalu isi `DB_PASSWORD` sesuai password PostgreSQL kamu. Jangan upload `.env` ke GitHub.
5. Buka terminal di folder project dan jalankan:
   ```bash
   npm install
   npm run dev
   ```
   Atau `npm start` untuk menjalankan tanpa watch mode.
6. Coba buka `http://localhost:3000/api/produk` di browser. Data contoh produk seharusnya muncul.
7. Import `postman/Katalog-UMKM-Desa.postman_collection.json` ke Postman. Collection sudah punya `base_url=http://localhost:3000`.
8. Jalankan Postman **urut** 01 POST, 02 GET Semua, 03 GET ID, 04 GET Cari Nama, 05 PUT, 06 DELETE. Request POST otomatis menyimpan ID produk baru pada variabel `produk_id`, sehingga request ID/PUT/DELETE mengarah ke produk yang benar. Screenshot masing-masing hasil respons di Postman untuk laporan tugas.

## Daftar endpoint
| No | Method | URL | Keterangan |
|----|--------|-----|------------|
| 1 | GET | `/api/produk` | Semua produk |
| 2 | GET | `/api/produk/:id` | Satu produk menurut ID |
| 3 | GET | `/api/produk/cari/:nama` | Pencarian nama, tidak peka huruf besar/kecil |
| 4 | POST | `/api/produk` | Tambah produk baru |
| 5 | PUT | `/api/produk/:id` | Ganti seluruh data produk |
| 6 | DELETE | `/api/produk/:id` | Hapus produk |

Contoh body POST/PUT:
```json
{
  "nama_produk": "Keripik Pisang Cokelat",
  "kategori": "Makanan Olahan",
  "deskripsi": "Camilan pisang produksi UMKM desa",
  "harga": 18000,
  "stok": 30,
  "nama_penjual": "Bu Aminah",
  "no_whatsapp": "081234560000",
  "gambar_url": null
}
```
Kategori yang diizinkan: `Makanan Olahan`, `Minuman`, `Kerajinan`. Harga dan stok tidak boleh negatif. Harga JSON dikirim sebagai angka; respons PostgreSQL untuk `NUMERIC` dapat berupa string.

## dbdiagram.io
1. Buka https://dbdiagram.io dan buat diagram baru.
2. Pilih **Import** → **PostgreSQL** dan tempel **bagian CREATE TABLE** dari `sql/database.sql` (jangan tempel INSERT jika tidak didukung importer).
3. Simpan dan buat link berbagi publik; tempel di formulir pengumpulan.

## Bukti testing dan pengumpulan
- Lengkapi dokumen tugas dengan deskripsi kasus, link dbdiagram publik, link repository GitHub publik atau ZIP publik, anggota tim, dan **6 screenshot hasil Postman**.
- Buat repo GitHub publik dan push source ini, atau bagikan ZIP publik sesuai instruksi pengajar.
- `.gitignore` sudah memuat `node_modules` dan `.env`.
- Jangan cantumkan password PostgreSQL pada repository atau tangkapan layar.
- Server ini berjalan lokal; belum di-deploy. Screenshot hasil berhasil hanya dapat dibuat setelah PostgreSQL aktif dan request Postman benar-benar dijalankan di komputer kamu.
