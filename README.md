# UTS Pemrograman Web - RimbaLestari Outdoor
Website penjualan barang outdoor preloved dan rental alat pendakian.

- **Nama**: Shahrul Alfa Rizky
- **NIM**: 25091397017
- **Kelompok**: A11
- **Dosen Pengampu**: Ari Kurniawan, S.Kom., M.T.

---

## 🛠️ Teknologi
- **Frontend Core**: HTML5, CSS3, JavaScript (ES6+), jQuery 3.7.1
- **Styling**: Tailwind CSS via CDN (Custom Color Palette & Typography Plus Jakarta Sans) + Material Symbols Icons
- **Arsitektur**: Single Page Application (SPA) berbasis Ajax (`$.load()`) tanpa reload halaman dan tanpa framework JS
- **Data & Penyimpanan**: 14 data produk dummy di `js/produk.js`, status autentikasi di `sessionStorage`, serta profil dan keranjang belanja dinamis di `localStorage` (tanpa database server)

---

## 📁 Struktur File
| File / Direktori | Keterangan |
|---|---|
| `index.html` | Layout utama: Header, navigasi menu, badge keranjang belanja dinamis, area konten (`#konten`), dan footer. |
| `pages/beranda.html` | Beranda (Dashboard): Banner hero *circular economy*, produk unggulan, 4 pilar jaminan alat outdoor, dan profil singkat RimbaLestari. |
| `pages/katalog.html` | **Item 2.b**. Katalog produk interaktif: filter tipe transaksi (preloved/rental), kategori gear, grade fisik, slider batas harga, filter kota, pengurutan, paginasi, dan pill filter aktif. Klik kartu produk mengarahkan ke halaman detail. |
| `pages/detail.html` | **Halaman Detail Produk**: Menampilkan detail spesifikasi gear, foto produk, grade fisik, jaminan rekber, rating ulasan, kontrol kuantitas unit, serta 2 opsi aksi: **"Tambahkan ke Keranjang"** dan **"Beli Sekarang / Sewa Sekarang"**. |
| `pages/keranjang.html` | **Item 2.c**. Keranjang belanja dinamis multi-transaksi: *empty state* jika belum ada barang, daftar item preloved & rental dinamis, kalender sewa anti-bentrok, sinkronisasi otomatis data profil, proteksi asuransi, diskon voucher, dan checkout. |
| `pages/riwayat.html` | Riwayat transaksi: Filter tab status pemesanan, pencarian transaksi, modal ulasan & rating bintang, serta modal pengajuan pengembalian alat rental. |
| `pages/profil.html` | Manajemen akun: Biodata pengguna, alamat pengiriman, status verifikasi identitas (KYC), ganti kata sandi, dan sinkronisasi otomatis ke formulir checkout. |
| `pages/masuk.html` | Autentikasi: Form Masuk (Login) dan Registrasi dengan validasi input, show/hide password, upload KTP/KTM, dan tombol 1-klik Akun Demo. |
| `js/app.js` | Routing Ajax via `$.load()`, state management keranjang (`CART_ITEMS`), kalkulasi total belanja & sewa, logika halaman detail produk, filter katalog, validasi form, dan global event listeners. |
| `js/produk.js` | 14 data produk dummy perlengkapan outdoor (preloved dan rental) lengkap dengan spesifikasi, grade, harga, dan gambar. |
| `css/style.css` | Penyesuaian gaya CSS tambahan. |
| `img/` | Aset gambar produk lokal. |

---

## 🚀 Fitur Utama

1. **Navigasi Single Page Application (SPA) berbasis Ajax**:
   - Seluruh perpindahan halaman (beranda, katalog, detail produk, keranjang, riwayat, profil, masuk) dimuat mulus ke elemen `#konten` menggunakan `$.load()` tanpa memuat ulang (*reload*) browser.

2. **Katalog Produk Interaktif (Item 2.b)**:
   - Filter multikriteria: Tipe transaksi (*Beli Preloved* / *Rental Alat*), 6 kategori perlengkapan, grade kondisi fisik (*Grade A, B, C*), slider rentang harga, dan wilayah kota vendor.
   - Pencarian realtime pada input header navbar, pengurutan produk (termurah, termahal, terpopuler, rating tertinggi), dan paginasi interaktif.
   - **Alur baru**: Mengklik kartu produk atau tombol di katalog **tidak langsung mengarahkan ke keranjang**, melainkan membuka **Halaman Detail Produk** terlebih dahulu.

3. **Halaman Detail Produk & Dua Opsi Transaksi**:
   - Menampilkan detail informasi alat lengkap: foto gear besar, badge tipe dan grade keaslian, rating bintang & jumlah ulasan, lokasi kota vendor, jaminan inspeksi fisik 12 titik, rekber escrow, dan deskripsi kondisi alat.
   - Pemilih kuantitas unit (`-` / `+`) yang dibatasi sesuai stok unit tersedia.
   - **Opsi "Tambahkan ke Keranjang"**: Memasukkan produk ke keranjang belanja, memperbarui jumlah badge keranjang di navbar header secara realtime, dan menampilkan notifikasi sukses tanpa meninggalkan halaman.
   - **Opsi "Beli Sekarang / Sewa Sekarang"**: Memasukkan produk ke keranjang dan langsung mengarahkan pengguna ke halaman keranjang belanja untuk proses checkout.
   - Tombol navigasi **"Kembali ke Katalog"** untuk mempermudah kembali memilih produk lain.

4. **Keranjang Belanja Dinamis & Manajemen State (Item 2.c)**:
   - **Status Keranjang Kosong (*Empty State*)**: Jika pengguna belum menambahkan barang, halaman keranjang tampil bersih dengan pesan *"Keranjang Belanja Anda Kosong"* beserta tombol jalan pintas menuju katalog.
   - **Status Keranjang Berisi**: Produk yang ditambahkan dari halaman detail ditampilkan secara dinamis di keranjang, terbagi rapi antara **Barang Preloved (Beli Putus)** dan **Alat Rental (Sewa Berjangka)**.
   - Badge angka pada ikon keranjang di header navbar mencerminkan kuantitas riil barang di keranjang belanja (otomatis tersembunyi/0 saat kosong).
   - Pengguna dapat mencentang/memilih item (checkbox per-item & pilih semua), menambah/mengurangi jumlah kuantitas, atau menghapus barang dari keranjang. Jika semua barang dihapus, keranjang otomatis kembali ke status kosong.

5. **Kalkulator Sewa & Kalender Interaktif**:
   - Pemilihan periode tanggal sewa (tanggal mulai ambil & tanggal kembali) dengan visualisasi kalender mini strip.
   - Perhitungan otomatis: durasi sewa harian, subtotal sewa, deposit jaminan *refundable* Rp 200.000, asuransi proteksi minor RimbaShield (+Rp 15.000), estimasi ongkos kirim, dan potongan kode voucher promo (`RIMBAHIJAU`, `RIMBABARU`).
   - Fitur deteksi bentrok jadwal sewa (jadwal dummy sewa terisi 20-23 Nov 2026).

6. **Formulir Checkout & Sinkronisasi Profil Otomatis**:
   - Data penerima dan pembayaran pada keranjang otomatis terisi sesuai dengan data di halaman **Profil Pengguna**.
   - Dilengkapi tombol *"Sinkronkan Ulang Profil"* dan jalan pintas *"Ubah Profil"*.
   - Validasi ketat sebelum checkout: nama penerima tanpa angka, nomor WhatsApp format 10-13 digit, alamat pengiriman minimal 10 karakter, kode pos 5 digit angka, metode pembayaran, persetujuan syarat sewa, dan upload KTP/KTM (jika belum KYC).
   - Konfirmasi pembuatan pesanan dengan ID Pesanan unik (contoh: `RBA-1234-JKT`) dan modal sukses menuju tab pembayaran di halaman riwayat.

7. **Pemesanan & Riwayat Transaksi**:
   - Filter tab status pesanan: *Semua Transaksi, Menunggu Pembayaran, Sedang Disewa, Dalam Pengiriman, Selesai, Dibatalkan*.
   - Modal ulasan interaktif dengan pilihan rating 1-5 bintang dan input ulasan minimal 10 karakter.
   - Modal pengajuan pengembalian alat rental (pilihan tanggal dan kondisi alat).
   - Simulasi bayar sekarang, pembatalan pesanan, dan sewa ulang.

8. **Autentikasi & Akun Demo**:
   - Pengamanan akses halaman: Pengguna wajib masuk (login) terlebih dahulu sebelum dapat mengakses dashboard atau melakukan transaksi.
   - Validasi masuk dan daftar akun baru.
   - Tombol 1-klik Masuk Akun Demo: `rian@email.com` / `Rimba1234`.


