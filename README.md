# UTS Pemrograman Web - RimbaLestari Outdoor
Website penjualan barang outdoor preloved dan rental alat pendakian.

- Nama: Shahrul Alfa Rizky
- NIM: 25091397017
- Kelompok: A11 (sesuaikan dengan kode kelompok di nama folder repository)
- Dosen: Ari Kurniawan, S.Kom., M.T.

## Teknologi
HTML, CSS, JavaScript, jQuery 3.7.1. Tampilan memakai desain UI dari wireframe proposal (hasil Stitch) dengan utilitas Tailwind CSS via CDN. Tanpa framework JS dan tanpa PHP. Data memakai **data dummy** di `js/produk.js` (tanpa database).

## Struktur file
| File | Keterangan |
|---|---|
| `index.html` | Item 2.a. Layout utama: header, menu, footer, area konten. Responsive (grid Tailwind). |
| `pages/beranda.html` | Beranda: hero, produk pilihan, keunggulan, tentang kami |
| `pages/katalog.html` | Item 2.b. Katalog produk interaktif: filter, pencarian, urutan, paginasi |
| `pages/keranjang.html` | Item 2.c. Keranjang, kalender sewa, dan form data penerima/pembayaran dengan validasi |
| `pages/riwayat.html`, `pages/profil.html`, `pages/masuk.html` | Halaman pendukung (riwayat transaksi, profil, masuk/registrasi) |
| `js/app.js` | Navigasi Ajax, logika semua halaman, validasi |
| `js/produk.js` | 12 produk dummy (preloved dan rental) |
| `js/data.js` | URL gambar produk dari desain |
| `css/style.css` | Gaya tambahan |

## Fitur
1. **Ajax**: semua menu memuat halaman ke `#konten` dengan `$.load()` tanpa reload.
2. **Katalog (2.b)**: filter tipe (preloved/rental), kategori, grade, rentang harga, kota, pencarian di header, urutan, paginasi, pill filter aktif yang bisa dihapus, tombol tas/beli/sewa.
3. **Keranjang + form (2.c)**: pilih barang, ubah jumlah, hapus, kode promo (`RIMBAHIJAU`, `RIMBABARU`), asuransi, tanggal sewa dengan mini kalender dan total yang dihitung ulang otomatis.
4. **Validasi form sebelum submit**: nama tanpa angka, WhatsApp `08xxxxxxxxxx`, alamat minimal 10 karakter, kode pos 5 digit, metode bayar, tanggal mulai tidak sebelum hari ini, tanggal kembali setelah tanggal mulai, **cek bentrok jadwal** (tenda sudah dipesan 20-23 Nov 2026), unggah KTP/KTM (JPG/PNG, maks 2 MB), persetujuan syarat.
5. **Riwayat**: tab status, pencarian, filter tipe, modal ulasan (rating + komentar tervalidasi), modal pengembalian.
6. **Masuk/Daftar** dan **Profil**: validasi email/WhatsApp, kata sandi (huruf + angka, min 8), KTP saat daftar. Akun demo: `rian@email.com` / `Rimba1234`.

## Cara menjalankan
Jalankan lewat server lokal (XAMPP di `htdocs`, atau ekstensi Live Server di VS Code). Membuka `index.html` langsung dari folder (file://) membuat halaman Ajax gagal dimuat. Perlu internet untuk Tailwind CDN, font, ikon, dan gambar.

## Catatan
- Tidak ada database: produk, jadwal sewa, dan akun hanya data dummy di JavaScript. Data hilang saat halaman direfresh.
- Pesanan yang lolos validasi hanya menampilkan konfirmasi (simulasi), belum dikirim ke server.
- Pembagian 2.a, 2.b, 2.c harus berbeda dengan anggota kelompok lain. Sesuaikan bila ada yang mirip.
