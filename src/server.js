require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const columns = 'id, nama_produk, kategori, deskripsi, harga, stok, nama_penjual, no_whatsapp, gambar_url, created_at, updated_at';
const categories = ['Makanan Olahan', 'Minuman', 'Kerajinan'];

function validateProduct(body) {
  const required = ['nama_produk', 'kategori', 'harga', 'stok', 'nama_penjual'];
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      return `${key} wajib diisi`;
    }
  }
  if (typeof body.nama_produk !== 'string' || body.nama_produk.trim().length > 150) return 'nama_produk tidak valid (maksimal 150 karakter)';
  if (!categories.includes(body.kategori)) return 'kategori harus Makanan Olahan, Minuman, atau Kerajinan';
  if (typeof body.nama_penjual !== 'string' || !body.nama_penjual.trim() || body.nama_penjual.length > 100) return 'nama_penjual tidak valid';
  if (typeof body.harga !== 'number' || !Number.isFinite(body.harga) || body.harga < 0) return 'harga harus angka >= 0';
  if (!Number.isSafeInteger(body.stok) || body.stok < 0 || body.stok > 2147483647) return 'stok harus bilangan bulat >= 0';
  if (body.deskripsi != null && typeof body.deskripsi !== 'string') return 'deskripsi harus teks';
  if (body.no_whatsapp != null && (typeof body.no_whatsapp !== 'string' || body.no_whatsapp.length > 20)) return 'no_whatsapp tidak valid';
  if (body.gambar_url != null && typeof body.gambar_url !== 'string') return 'gambar_url harus teks';
  return null;
}

function parseId(raw) {
  const id = Number(raw);
  return /^\d+$/.test(raw) && Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

function handleError(res, err) {
  console.error(err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server/database' });
}

app.get('/', (req, res) => {
  res.json({ message: 'REST API Katalog Produk UMKM Desa', endpoints: '/api/produk' });
});

app.get('/api/produk', async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${columns} FROM produk_umkm ORDER BY id ASC`);
    res.json({ message: 'Daftar produk UMKM', data: result.rows });
  } catch (err) { handleError(res, err); }
});

app.get('/api/produk/cari/:nama', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${columns} FROM produk_umkm WHERE nama_produk ILIKE $1 ORDER BY id ASC`,
      [`%${req.params.nama}%`]
    );
    res.json({ message: 'Hasil pencarian produk', data: result.rows });
  } catch (err) { handleError(res, err); }
});

app.get('/api/produk/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'ID harus bilangan bulat positif' });
  try {
    const result = await pool.query(`SELECT ${columns} FROM produk_umkm WHERE id = $1`, [id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Detail produk UMKM', data: result.rows[0] });
  } catch (err) { handleError(res, err); }
});

app.post('/api/produk', async (req, res) => {
  const error = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error });
  const { nama_produk, kategori, deskripsi = null, harga, stok, nama_penjual, no_whatsapp = null, gambar_url = null } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO produk_umkm (nama_produk, kategori, deskripsi, harga, stok, nama_penjual, no_whatsapp, gambar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${columns}`,
      [nama_produk.trim(), kategori, deskripsi, harga, stok, nama_penjual.trim(), no_whatsapp, gambar_url]
    );
    res.status(201).json({ message: 'Produk berhasil ditambahkan', data: result.rows[0] });
  } catch (err) { handleError(res, err); }
});

app.put('/api/produk/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'ID harus bilangan bulat positif' });
  const error = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error });
  const { nama_produk, kategori, deskripsi = null, harga, stok, nama_penjual, no_whatsapp = null, gambar_url = null } = req.body;
  try {
    const result = await pool.query(
      `UPDATE produk_umkm SET nama_produk = $1, kategori = $2, deskripsi = $3, harga = $4,
       stok = $5, nama_penjual = $6, no_whatsapp = $7, gambar_url = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING ${columns}`,
      [nama_produk.trim(), kategori, deskripsi, harga, stok, nama_penjual.trim(), no_whatsapp, gambar_url, id]
    );
    if (!result.rowCount) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil diperbarui', data: result.rows[0] });
  } catch (err) { handleError(res, err); }
});

app.delete('/api/produk/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'ID harus bilangan bulat positif' });
  try {
    const result = await pool.query('DELETE FROM produk_umkm WHERE id = $1 RETURNING id, nama_produk', [id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus', data: result.rows[0] });
  } catch (err) { handleError(res, err); }
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
