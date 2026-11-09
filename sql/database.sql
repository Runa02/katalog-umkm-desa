CREATE TABLE IF NOT EXISTS produk_umkm (
    id SERIAL PRIMARY KEY,
    nama_produk VARCHAR(150) NOT NULL,
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Makanan Olahan', 'Minuman', 'Kerajinan')),
    deskripsi TEXT,
    harga NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
    stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
    nama_penjual VARCHAR(100) NOT NULL,
    no_whatsapp VARCHAR(20),
    gambar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produk_umkm (nama_produk, kategori, deskripsi, harga, stok, nama_penjual, no_whatsapp, gambar_url)
VALUES
('Keripik Singkong Balado', 'Makanan Olahan', 'Keripik singkong pedas khas desa', 15000, 40, 'Bu Siti', '081234567890', NULL),
('Wedang Jahe Instan', 'Minuman', 'Minuman jahe bubuk kemasan', 12000, 25, 'Pak Budi', '081298765432', NULL),
('Tas Anyaman Bambu', 'Kerajinan', 'Tas anyaman bambu buatan tangan', 75000, 10, 'Bu Rina', '081277788899', NULL);
