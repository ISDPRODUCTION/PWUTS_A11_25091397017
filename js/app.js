/* RimbaLestari Outdoor - UTS Pemrograman Web. HTML + CSS + jQuery, data dummy (tanpa database). */
var CUR = 'masuk', cart = 3, PER = 6;
var S0 = {q:'', tipe:{preloved:true, rental:true}, kat:'', kota:'Semua', max:3500000, grade:{A:true,B:true,C:false}, sort:'relevant', page:1};
var S = $.extend(true, {}, S0);
var USERS = [{id:'rian@email.com', pw:'Rimba1234'}, {id:'081234567890', pw:'Rimba1234'}];
var BOOKED = [['2026-11-20','2026-11-23']];     // jadwal tenda yang sudah dipesan (dummy)
var PROMO = {RIMBAHIJAU:50000, RIMBABARU:75000};
var promoDisc = 50000;

/* ---------- Status Otentikasi & Data Profil Pengguna ---------- */
var isLoggedIn = sessionStorage.getItem('rimba_logged_in') === 'true';

var PROFIL = {
  nama: 'Rian Ardiansyah',
  username: 'rianoutdoor',
  email: 'rian.ardiansyah@email.com',
  telp: '081288997721',
  alamat: 'Jl. Panderman No. 14, RT 03/RW 07, Babakan, Kecamatan Bogor Tengah',
  kota: 'Bogor',
  pos: '16128',
  metode: 'Virtual Account BCA',
  kycVerified: true
};
try {
  var sp = localStorage.getItem('rimba_profile');
  if (sp) PROFIL = $.extend(PROFIL, JSON.parse(sp));
} catch(e){}

function renderAuthHeader(){
  if (isLoggedIn){
    $('#headerUserAvatar').removeClass('hidden');
    $('#headerUserIcon').addClass('hidden');
    $('#headerUserName').text('Rian Outdoor').removeClass('text-primary').addClass('text-on-surface');
    $('#headerLogoutBtn').removeClass('hidden');
    $('#cartBadge').text(cart).removeClass('hidden');
  } else {
    $('#headerUserAvatar').addClass('hidden');
    $('#headerUserIcon').removeClass('hidden');
    $('#headerUserName').text('Masuk').removeClass('text-on-surface').addClass('text-primary');
    $('#headerLogoutBtn').addClass('hidden');
    $('#cartBadge').addClass('hidden');
  }
}

function logout(){
  isLoggedIn = false;
  sessionStorage.removeItem('rimba_logged_in');
  renderAuthHeader();
  toast('Anda telah keluar dari akun.');
  muat('masuk');
}

/* ---------- util ---------- */
function rp(n){ return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function pd(s){ var a = s.split('-'); return new Date(+a[0], a[1]-1, +a[2]); }
function ymd(d){ return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+d.getDate()).slice(-2); }
function addDays(d,n){ var x = new Date(d); x.setDate(x.getDate()+n); return x; }
function selisih(a,b){ return Math.round((pd(b) - pd(a)) / 86400000); }
function fmtTgl(s){ return pd(s).toLocaleDateString('id-ID', {weekday:'short', day:'numeric', month:'short', year:'numeric'}); }
function hariIni(){ return ymd(new Date()); }
function toast(msg){
  var t = $('<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface text-inverse-on-surface rounded-lg px-5 py-3 shadow-lg font-label-lg text-label-lg"></div>').text(msg).appendTo('body');
  setTimeout(function(){ t.fadeOut(300, function(){ t.remove(); }); }, 2400);
}
function modal(html){
  var o = $('<div class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"><div class="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md p-space-lg flex flex-col gap-space-md max-h-[90vh] overflow-y-auto">' + html + '</div></div>').appendTo('body');
  o.on('click', '[data-close]', function(){ o.remove(); });
  return o;
}
function err(id, msg){
  $('[data-err="' + id + '"]').text(msg || '');
  $('#' + id).toggleClass('is-invalid', !!msg);
  return !msg;
}
document.addEventListener('error', function(e){ if (e.target.tagName === 'IMG'){ e.target.style.visibility = 'hidden'; } }, true);

/* ---------- navigasi Ajax ---------- */
var PATH = {katalog:'katalog-produk', riwayat:'pemesanan-dan-riwayat'};
function setActive(){
  var $nav = $('header nav').first(), act = ($nav.data('active-classes') || '').split(' ');
  var path = '';
  if (CUR === 'katalog'){ path = (S.tipe.rental && !S.tipe.preloved) ? 'rental-alat' : ((S.tipe.preloved && !S.tipe.rental) ? 'jual-preloved' : 'katalog-produk'); }
  else if (CUR === 'riwayat') path = 'pemesanan-dan-riwayat';
  else if (CUR === 'masuk') path = 'masuk';
  $nav.find('a').each(function(){
    var on = $(this).attr('data-path') === path;
    $(this).removeClass(act.join(' ')).toggleClass('text-on-surface-variant', !on);
    if (on) $(this).addClass(act.join(' '));
  });
}
function muat(page, opt){
  opt = opt || {};
  // Poin 1: Sebelum ke dashboard (beranda) atau halaman utama lainnya, harus login terlebih dahulu
  if (!isLoggedIn && page !== 'masuk'){
    toast('Silakan masuk terlebih dahulu untuk mengakses ' + (page === 'beranda' ? 'dashboard' : page) + '.');
    page = 'masuk';
  }
  if (page === 'katalog'){
    if (opt.reset){ S = $.extend(true, {}, S0); }
    if (opt.mode){ S.tipe = {preloved: opt.mode !== 'rental', rental: opt.mode !== 'preloved'}; }
    if (opt.kat !== undefined) S.kat = opt.kat;
    if (opt.q !== undefined) S.q = opt.q;
    S.page = 1;
  }
  CUR = page; setActive();
  $('#konten').html('<main class="w-full pt-28 min-h-[60vh]"><p class="p-margin-desktop">Memuat halaman...</p></main>');
  $('#konten').load('pages/' + page + '.html', function(res, status){
    if (status === 'error'){
      $('#konten').html('<main class="w-full pt-28 min-h-[60vh] p-margin-desktop"><div class="bg-error-container text-on-error-container rounded-xl p-space-lg"><b>Halaman gagal dimuat.</b><br>Jalankan lewat server lokal (XAMPP atau Live Server), jangan buka index.html langsung dari folder.</div></main>');
      return;
    }
    if (INIT[page]) INIT[page](opt);
    setActive(); window.scrollTo(0, 0);
  });
}

/* ---------- kartu produk ---------- */
function kartu(p){
  var r = p.tipe === 'rental';
  var b1 = r ? 'SIAP RENTAL' : 'PRELOVED', b1c = r ? 'bg-inverse-surface text-white' : 'bg-primary-fixed text-on-primary-fixed';
  var b2 = r ? ('TERSEDIA ' + p.unit + ' UNIT') : ('GRADE ' + p.grade + ' (' + p.persen + '%)');
  var harga = r
    ? '<div class="flex items-end justify-between"><div><span class="text-body-sm text-on-surface-variant">Tarif Harian</span><div><span class="font-headline-md text-headline-md font-bold">' + rp(p.harga) + '</span> <span class="text-body-sm text-on-surface-variant">/hari</span></div></div><span class="bg-surface-container rounded px-2 py-1 text-label-md">Min. ' + p.minHari + ' Hari</span></div>'
    : '<div class="flex items-end justify-between"><div><span class="text-body-sm text-on-surface-variant line-through">' + rp(p.coret) + '</span><div class="font-headline-md text-headline-md font-bold">' + rp(p.harga) + '</div></div><span class="bg-primary-fixed text-on-primary-fixed rounded px-2 py-1 text-label-md font-bold">Hemat ' + Math.round((1 - p.harga/p.coret) * 100) + '%</span></div>';
  var tombol = r
    ? '<button data-ca="rent" data-id="' + p.id + '" class="w-full bg-inverse-surface text-white rounded-lg py-2.5 font-label-lg text-label-lg font-bold flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">event</span>Sewa Sekarang</button>'
    : '<div class="grid grid-cols-2 gap-2"><button data-ca="cart" data-id="' + p.id + '" class="bg-surface-container text-on-surface rounded-lg py-2.5 font-label-lg text-label-lg flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>+ Tas</button><button data-ca="buy" data-id="' + p.id + '" class="bg-primary text-on-primary rounded-lg py-2.5 font-label-lg text-label-lg font-bold">Beli Langsung</button></div>';
  return '<article class="product-item bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">' +
    '<div class="relative h-48 bg-secondary-container"><img src="' + (p.img || '') + '" alt="' + p.nama + '" class="w-full h-full object-cover">' +
    '<div class="absolute top-2 left-2 flex flex-col items-start gap-1"><span class="' + b1c + ' rounded px-2 py-0.5 text-label-technical font-label-technical">' + b1 + '</span><span class="bg-black/60 text-white rounded px-2 py-0.5 text-label-technical font-label-technical">' + b2 + '</span></div>' +
    '<button data-ca="fav" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">favorite</span></button>' +
    '<div class="absolute bottom-0 inset-x-0 bg-black/50 text-white px-3 py-1.5 flex justify-between text-label-md font-label-md"><span>' + p.kota + '</span><span>★ ' + p.rating.toFixed(1) + ' (' + p.ulasan + ')</span></div></div>' +
    '<div class="p-4 flex flex-col gap-2 flex-1"><h3 class="font-title-md text-title-md font-bold">' + p.nama + '</h3><p class="text-body-sm text-on-surface-variant">' + p.desc + '</p><div class="mt-auto pt-2 flex flex-col gap-3">' + harga + tombol + '</div></div></article>';
}
$(document).on('click', '[data-ca]', function(){
  var a = $(this).data('ca'), p = PRODUK.filter(function(x){ return x.id == $(this).data('id'); }.bind(this))[0];
  if (a === 'fav'){ var s = $(this).find('span'); s.css('color', s.css('color') === 'rgb(186, 26, 26)' ? '' : '#ba1a1a'); return; }
  cart++; $('#cartBadge').text(cart);
  if (a === 'cart') toast(p.nama + ' masuk ke tas');
  else { toast(p.nama + ' ditambahkan, lanjut ke keranjang'); muat('keranjang'); }
});
$(document).on('click', '[data-go]', function(){ muat($(this).data('go'), {mode: $(this).data('mode'), reset: true}); });

/* ---------- Halaman Katalog (item 2.b) ---------- */
function daftar(){
  var q = S.q.toLowerCase();
  var r = PRODUK.filter(function(p){
    if (!S.tipe[p.tipe]) return false;
    if (S.kat && p.kat !== S.kat) return false;
    if (S.kota !== 'Semua' && p.wil !== S.kota) return false;
    if (p.harga > S.max) return false;
    if (p.tipe === 'preloved' && !S.grade[p.grade]) return false;
    if (q && (p.nama + ' ' + p.desc + ' ' + KAT[p.kat]).toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
  var by = {'price-asc':function(a,b){return a.harga-b.harga;}, 'price-desc':function(a,b){return b.harga-a.harga;}, 'rating':function(a,b){return b.rating-a.rating;}, 'popular':function(a,b){return b.sewa-a.sewa;}}[S.sort];
  if (by) r.sort(by);
  return r;
}
function renderKatalog(){
  var r = daftar(), total = r.length, pages = Math.max(1, Math.ceil(total / PER));
  if (S.page > pages) S.page = pages;
  var a = (S.page - 1) * PER, hal = r.slice(a, a + PER);
  $('#gridProduk').html(hal.length ? hal.map(kartu).join('') : '<div class="col-span-full bg-surface-container-lowest rounded-xl p-space-xl text-center"><span class="material-symbols-outlined text-[40px] text-outline">search_off</span><p class="font-title-md text-title-md">Tidak ada alat yang cocok.</p><p class="text-on-surface-variant">Ubah kata kunci atau hapus sebagian filter.</p></div>');
  $('#jmlAlat').text(total + ' Alat Tersedia');
  $('#rngA').text(total ? (a + 1) + ' - ' + (a + hal.length) : '0'); $('#rngB').text(total);
  var pg = '<button data-pg="' + (S.page - 1) + '" ' + (S.page === 1 ? 'disabled' : '') + ' class="w-10 h-10 rounded-md text-on-surface-variant disabled:opacity-30"><span class="material-symbols-outlined">chevron_left</span></button>';
  for (var i = 1; i <= pages; i++) pg += '<button data-pg="' + i + '" class="w-10 h-10 rounded-md font-bold ' + (i === S.page ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container') + '">' + i + '</button>';
  pg += '<button data-pg="' + (S.page + 1) + '" ' + (S.page === pages ? 'disabled' : '') + ' class="w-10 h-10 rounded-md text-on-surface-variant disabled:opacity-30"><span class="material-symbols-outlined">chevron_right</span></button>';
  $('#paging').html(pg);
  // pill filter aktif
  var pills = [], both = S.tipe.preloved && S.tipe.rental;
  pills.push(['tipe', both ? 'Beli Preloved + Rental' : (S.tipe.preloved ? 'Beli Preloved' : (S.tipe.rental ? 'Rental / Sewa' : 'Tidak ada tipe'))]);
  var g = ['A','B','C'].filter(function(x){ return S.grade[x]; }).join(' & ');
  pills.push(['grade', 'Grade ' + (g || '-')]);
  if (S.max < 3500000) pills.push(['max', '≤ ' + rp(S.max)]);
  if (S.kat) pills.push(['kat', KAT[S.kat]]);
  if (S.kota !== 'Semua') pills.push(['kota', S.kota]);
  if (S.q) pills.push(['q', '"' + S.q + '"']);
  $('#pillFilter').html('<span class="text-label-md font-label-md text-on-surface-variant">FILTER AKTIF:</span>' + pills.map(function(x){
    return '<span class="inline-flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full px-3 py-1 text-label-md font-semibold">' + x[1] + '<button data-pill="' + x[0] + '" aria-label="Hapus filter"><span class="material-symbols-outlined text-[14px]">close</span></button></span>';
  }).join('') + '<button onclick="resetAllFilters()" class="ml-auto text-primary font-bold text-label-md">Hapus Semua Filter</button>');
}
var MODE_ACT = 'bg-primary-fixed text-on-primary-fixed font-bold shadow-sm', MODE_OFF = 'text-surface-container-lowest hover:text-primary-fixed';
function syncUI(){
  var base = 'flex-1 sm:flex-none px-4 py-2 rounded-md font-label-md text-label-md transition-all ';
  var m = (S.tipe.preloved && S.tipe.rental) ? 'all' : (S.tipe.preloved ? 'preloved' : (S.tipe.rental ? 'rental' : 'none'));
  ['all','preloved','rental'].forEach(function(k){ $('#btn-mode-' + k).attr('class', base + (k === m ? MODE_ACT : MODE_OFF)); });
  $('#filter-preloved').prop('checked', S.tipe.preloved); $('#filter-rental').prop('checked', S.tipe.rental);
  var gc = $('#konten input[type=checkbox]').not('#filter-preloved,#filter-rental');
  ['A','B','C'].forEach(function(k, i){ gc.eq(i).prop('checked', S.grade[k]); });
  $('#konten input[type=range]').val(S.max); $('#price-label').text('Maks. ' + rp(S.max).replace('Rp ', 'Rp ')); $('#price-max-display').text(rp(S.max));
  $('#konten select').val(S.sort);
  var kb = $('#konten button.kat-btn'), kc = $('#konten button.kota-btn');
  kb.each(function(){ $(this).attr('class', 'kat-btn ' + ($(this).data('k') === S.kat ? KB_ACT : KB_OFF)); });
  kc.each(function(){ $(this).attr('class', 'kota-btn ' + ($(this).data('k') === S.kota ? KC_ACT : KC_OFF)); });
  $('header input[type=text]').first().val(S.q);
}
var KB_ACT, KB_OFF, KC_ACT, KC_OFF;
function setModeFilter(mode){ S.tipe = {preloved: mode !== 'rental', rental: mode !== 'preloved'}; S.page = 1; setActive(); syncUI(); renderKatalog(); }
function updatePrice(v){ S.max = +v; S.page = 1; syncUI(); renderKatalog(); }
function resetAllFilters(){ S = $.extend(true, {}, S0); setActive(); syncUI(); renderKatalog(); }
var KATKEY = {'Semua Kategori':'', 'Tenda & Shelter':'tenda', 'Tas Carrier & Daypack':'tas', 'Sepatu & Sandal Gunung':'sepatu', 'Jaket & Apparel Gunung':'jaket', 'Alat Masak & Kompor':'masak', 'Sleeping Bag & Matras':'sleeping'};
var KOTAS = ['Semua','Jabodetabek','Bandung','Malang','Yogyakarta'];
var INIT = {};
INIT.katalog = function(){
  var $k = $('#konten button').filter(function(){ var t = $.trim($(this).children('span').first().text()); return t in KATKEY; });
  $k.each(function(){ $(this).addClass('kat-btn').data('k', KATKEY[$.trim($(this).children('span').first().text())]); });
  KB_ACT = $k.eq(0).attr('class').replace('kat-btn', ''); KB_OFF = $k.eq(1).attr('class').replace('kat-btn', '');
  var $c = $('#konten button').filter(function(){ return KOTAS.indexOf($.trim($(this).text())) > -1; });
  $c.each(function(){ $(this).addClass('kota-btn').data('k', $.trim($(this).text())); });
  KC_ACT = $c.eq(0).attr('class').replace('kota-btn', ''); KC_OFF = $c.eq(1).attr('class').replace('kota-btn', '');
  $('#konten').off('.kat').on('click.kat', '.kat-btn', function(){ S.kat = $(this).data('k'); S.page = 1; syncUI(); renderKatalog(); })
    .on('click.kat', '.kota-btn', function(){ S.kota = $(this).data('k'); S.page = 1; syncUI(); renderKatalog(); })
    .on('click.kat', '[data-pg]', function(){ if (this.disabled) return; S.page = +$(this).data('pg'); renderKatalog(); window.scrollTo(0, 280); })
    .on('click.kat', '[data-pill]', function(){
      var k = $(this).data('pill');
      if (k === 'tipe') S.tipe = {preloved:true, rental:true}; if (k === 'grade') S.grade = {A:true,B:true,C:false};
      if (k === 'max') S.max = 3500000; if (k === 'kat') S.kat = ''; if (k === 'kota') S.kota = 'Semua'; if (k === 'q') S.q = '';
      S.page = 1; setActive(); syncUI(); renderKatalog();
    });
  $('#filter-preloved, #filter-rental').on('change', function(){ S.tipe = {preloved: $('#filter-preloved').is(':checked'), rental: $('#filter-rental').is(':checked')}; S.page = 1; setActive(); syncUI(); renderKatalog(); });
  $('#konten input[type=checkbox]').not('#filter-preloved,#filter-rental').on('change', function(){
    var i = $('#konten input[type=checkbox]').not('#filter-preloved,#filter-rental').index(this); S.grade[['A','B','C'][i]] = this.checked; S.page = 1; syncUI(); renderKatalog();
  });
  $('#konten select').on('change', function(){ S.sort = this.value; S.page = 1; renderKatalog(); });
  syncUI(); renderKatalog();
};
INIT.beranda = function(){ $('#featured').html([1,2,3,6].map(function(i){ return kartu(PRODUK[i-1]); }).join('')); };

/* ---------- Halaman Keranjang & Form Sewa (item 2.c) ---------- */
function stripRender(m, k){
  var C = window.STRIPCLS, H = ['MIN','SEN','SEL','RAB','KAM','JUM','SAB'], s0 = m ? pd(m) : new Date(), html = '';
  for (var i = -2; i < 5; i++){
    var d = addDays(s0, i), key = ymd(d), t = 'normal';
    if (m && k && k >= m){ if (key === m) t = 'start'; else if (key === k) t = 'end'; else if (key > m && key < k) t = 'mid'; }
    html += '<div class="' + C[t][0] + '"><span class="' + C[t][1] + '">' + H[d.getDay()] + '</span><span class="' + C[t][2] + '">' + d.getDate() + '</span></div>';
  }
  $('#strip').html(html);
}
function bentrokTgl(m, k){ var h = null; $.each(BOOKED, function(i, b){ if (m <= b[1] && b[0] <= k){ h = b; return false; } }); return h; }
function hitung(){
  var pre = 0, n = 0;
  $('input[data-harga]').filter(function(){ return $(this).data('item') < 3 && this.checked; }).each(function(){ var i = $(this).data('item'); pre += $(this).data('harga') * (+$('[data-qty=' + i + ']').text() || 1); n++; });
  var rOn = $('input[data-item=3]').is(':checked'), m = $('#mulai').val(), k = $('#kembali').val();
  var d = (m && k && k > m) ? selisih(m, k) : 0, sewa = rOn ? d * 45000 : 0, dep = rOn ? 200000 : 0;
  var asu = (rOn && $('#insuranceToggle').is(':checked')) ? 15000 : 0, any = n > 0 || rOn, ong = any ? 45000 : 0, disc = any ? promoDisc : 0;
  var total = Math.max(0, pre + sewa + dep + asu + ong - disc);
  $('#lblPre').text('Total Harga Preloved (' + n + ' Item)'); $('#sumPre').text(rp(pre));
  $('#lblSewa').text('Total Sewa Alat (1 Tenda / ' + d + ' Hari)'); $('#sumSewa').text(rp(sewa)); $('#subSewa').text(rp(d * 45000));
  $('#subLbl').text('Subtotal Biaya Sewa (Rp 45.000 × ' + d + ' Hari):'); $('#durLbl').text('Durasi: ' + d + ' Hari');
  $('#lblMulai').text(m ? fmtTgl(m) : '-'); $('#lblKembali').text(k ? fmtTgl(k) : '-');
  $('#konten span').filter(function(){ return $.trim($(this).text()) === 'Deposit Refundable Rental'; }).parent().next('span').text(rp(dep));
  $('#sumDisc').text('-' + rp(disc)); $('#insuranceRow').css('opacity', asu ? 1 : .35);
  $('#grandTotalDisplay').text(rp(total));
  stripRender(m, (k && k > m) ? k : '');
  return {n:n, rOn:rOn, total:total};
}
function cekForm(){
  var ok = true, v = function(id){ return $.trim($('#' + id).val()); }, rOn = $('input[data-item=3]').is(':checked');
  ok = err('nama', !v('nama') ? 'Nama penerima wajib diisi.' : (v('nama').length < 3 ? 'Nama minimal 3 karakter.' : (/\d/.test(v('nama')) ? 'Nama tidak boleh berisi angka.' : ''))) && ok;
  ok = err('telp', !v('telp') ? 'Nomor WhatsApp wajib diisi.' : (!/^(08|\+628)\d{8,11}$/.test(v('telp')) ? 'Gunakan format 08xxxxxxxxxx (10-13 digit).' : '')) && ok;
  ok = err('alamat', !v('alamat') ? 'Alamat wajib diisi.' : (v('alamat').length < 10 ? 'Alamat minimal 10 karakter.' : '')) && ok;
  ok = err('kota', v('kota') ? '' : 'Pilih kota tujuan.') && ok;
  ok = err('pos', !v('pos') ? 'Kode pos wajib diisi.' : (!/^\d{5}$/.test(v('pos')) ? 'Kode pos harus 5 digit angka.' : '')) && ok;
  ok = err('metode', v('metode') ? '' : 'Pilih metode pembayaran.') && ok;
  if (rOn){
    var m = v('mulai'), k = v('kembali'), msgM = '', msgK = '';
    if (!m) msgM = 'Tanggal mulai wajib diisi.'; else if (m < hariIni()) msgM = 'Tanggal mulai tidak boleh sebelum hari ini.';
    if (!k) msgK = 'Tanggal kembali wajib diisi.'; else if (m && k <= m) msgK = 'Tanggal kembali harus setelah tanggal mulai.';
    else if (m && !msgM){ var b = bentrokTgl(m, k); if (b) msgK = 'Bentrok dengan sewa lain (' + b[0] + ' s/d ' + b[1] + '). Pilih tanggal lain.'; }
    ok = err('mulai', msgM) && ok; ok = err('kembali', msgK) && ok;
    var f = $('#ktp')[0] ? $('#ktp')[0].files[0] : null, mk = '';
    if (!f && !PROFIL.kycVerified) mk = 'Unggah foto KTP/KTM untuk verifikasi sewa.';
    else if (f && ['image/jpeg','image/png'].indexOf(f.type) < 0) mk = 'File harus JPG atau PNG.';
    else if (f && f.size > 2097152) mk = 'Ukuran file maksimal 2 MB.';
    ok = err('ktp', mk) && ok;
  } else { err('mulai',''); err('kembali',''); err('ktp',''); }
  var s = $('#setuju').is(':checked'); $('[data-err=setuju]').text(s ? '' : 'Centang persetujuan untuk melanjutkan.'); ok = s && ok;
  return ok;
}
INIT.keranjang = function(){
  var now = new Date();
  $('#mulai').attr('min', hariIni()).val('2026-11-12'); $('#kembali').attr('min', hariIni()).val('2026-11-15');
  
  // Poin 2: Data Penerima & Pembayaran otomatis terisi sama seperti di profil
  function isiFormDariProfil(){
    $('#nama').val(PROFIL.nama);
    $('#telp').val(PROFIL.telp);
    $('#alamat').val(PROFIL.alamat);
    $('#kota').val(PROFIL.kota);
    $('#pos').val(PROFIL.pos);
    $('#metode').val(PROFIL.metode);
    if (PROFIL.kycVerified){
      $('#ktpProfileBadge').removeClass('hidden');
    }
  }
  isiFormDariProfil();
  hitung();

  $('#btnSyncProfil').on('click', function(e){
    e.preventDefault();
    isiFormDariProfil();
    toast('Data formulir berhasil disinkronkan kembali dari profil');
    hitung();
  });
  $('#btnEditProfilKeranjang').on('click', function(e){
    e.preventDefault();
    muat('profil');
  });

  $('#mulai, #kembali').on('change', function(){ hitung(); });
  var touched = {};
  $('#formCheckout input, #formCheckout select').on('blur change', function(){
    if (this.id === 'setuju') return; touched[this.id] = true; cekForm();
    $('[data-err]').each(function(){ var id = $(this).attr('data-err'); if (!touched[id] && id !== 'setuju'){ $(this).text(''); $('#' + id).removeClass('is-invalid'); } });
  });
  $('#konten').off('.krj').on('change.krj', 'input[data-item], #insuranceToggle', hitung)
    .on('click.krj', '[data-act]', function(){
      var a = $(this).data('act'), i = $(this).data('item');
      if (a === 'del'){ $('[data-card=' + i + ']').remove(); hitung(); toast('Barang dihapus dari keranjang'); }
      else { var q = $('[data-qty=' + i + ']'), v = (+q.text() || 1) + (a === 'plus' ? 1 : -1); q.text(Math.max(1, Math.min(9, v))); hitung(); }
    });
  $('#selectAllCheckbox').on('change', function(){ $('input[data-item]').prop('checked', this.checked); hitung(); });
  $('#deleteSelectedBtn').on('click', function(){ $('input[data-item]:checked').each(function(){ $('[data-card=' + $(this).data('item') + ']').remove(); }); hitung(); });
  $('#applyPromoBtn').on('click', function(){
    var val = $.trim($('#promoInput').val()).toUpperCase(), f = $('#promoFeedback'), base = 'flex items-center gap-1.5 font-label-md text-label-md font-semibold pt-1 ';
    if (!val){ promoDisc = 0; f.attr('class', base + 'text-error').text('Silakan masukkan kode voucher'); }
    else if (PROMO[val]){ promoDisc = PROMO[val]; f.attr('class', base + 'text-primary').text('Kupon ' + val + ' aktif (-' + rp(promoDisc) + ')'); }
    else { promoDisc = 0; f.attr('class', base + 'text-error').text('Kode promo tidak valid'); }
    hitung();
  });
  $('#checkoutActionBtn').on('click', function(){
    var st = hitung();
    if (!st.n && !st.rOn){ toast('Pilih minimal satu barang untuk checkout'); return; }
    if (!cekForm()){ toast('Masih ada isian yang salah, periksa pesan merah'); $('#formCheckout')[0].scrollIntoView({behavior:'smooth', block:'center'}); return; }
    var id = 'RBA-' + Math.floor(1000 + Math.random() * 9000) + '-' + $('#kota').val().slice(0, 3).toUpperCase();
    var o = modal('<div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[32px]">check_circle</span><h3 class="font-headline-sm text-headline-sm">Pesanan berhasil dibuat</h3></div>' +
      '<p class="text-on-surface-variant">ID pesanan <b>' + id + '</b><br>Penerima: ' + $.trim($('#nama').val()) + ' (' + $('#kota').val() + ')<br>Metode: ' + $('#metode').val() + '<br>Total tagihan: <b>' + rp(st.total) + '</b><br>Status: Menunggu Pembayaran</p>' +
      '<div class="flex gap-2"><button data-close class="flex-1 bg-surface-container rounded-lg py-2 font-bold">Tutup</button><button data-close data-r class="flex-1 bg-primary text-on-primary rounded-lg py-2 font-bold">Lihat Riwayat</button></div>');
    o.on('click', '[data-r]', function(){ muat('riwayat', {tab:'bayar'}); });
  });
};

/* ---------- Riwayat transaksi (Poin 3) ---------- */
var TABS = {'Semua Transaksi':'all', 'Menunggu Pembayaran':'bayar', 'Sedang Disewa':'aktif', 'Dalam Pengiriman':'kirim', 'Selesai':'selesai', 'Dibatalkan':'batal'};
INIT.riwayat = function(opt){
  opt = opt || {};
  var $t = $('#konten button').filter(function(){ var t = $(this).text().replace(/\s+/g, ' '); return !$(this).closest('[data-card]').length && Object.keys(TABS).some(function(k){ return t.indexOf(k) > -1; }); });
  var act = $t.filter(function(){ return $(this).text().indexOf('Sedang Disewa') > -1; }).attr('class') || 'flex items-center gap-2 px-space-md py-2 rounded-lg bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold shadow-sm';
  var off = $t.filter(function(){ return $(this).text().indexOf('Menunggu') > -1; }).attr('class') || 'flex items-center gap-2 px-space-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors font-label-lg text-label-lg';
  $t.each(function(){ var tx = $(this).text().replace(/\s+/g, ' '), k = 'all'; $.each(TABS, function(n, v){ if (tx.indexOf(n) > -1) k = v; }); $(this).data('tab', k); });
  var st = {tab: opt.tab || 'all'};
  $('[data-card]').last().after('<div id="kosongRiwayat" class="hidden bg-surface-container-lowest rounded-xl p-space-xl text-center"><span class="material-symbols-outlined text-[40px] text-outline">inventory_2</span><p class="font-title-md text-title-md">Belum ada transaksi di sini.</p></div>');
  function tampil(){
    var q = $.trim($('#konten input[type=text]').val()).toLowerCase(), tp = $('#konten select').val(), n = 0;
    $('[data-card]').each(function(){
      var ok = (st.tab === 'all' || $(this).data('status') === st.tab) && (tp === 'all' || $(this).data('tipe') === tp) && (!q || $(this).text().toLowerCase().indexOf(q) > -1);
      $(this).toggle(ok); if (ok) n++;
    });
    $('#kosongRiwayat').toggleClass('hidden', n > 0);
    $t.each(function(){ $(this).attr('class', $(this).data('tab') === st.tab ? act : off); });
  }
  $t.on('click', function(){ st.tab = $(this).data('tab'); tampil(); });
  $('#konten input[type=text]').on('input', tampil); $('#konten select').on('change', tampil);
  $('#konten button[title="Reset Filter"]').on('click', function(){ st.tab = 'all'; $('#konten input[type=text]').val(''); $('#konten select').val('all'); tampil(); });
  tampil();
  $('#konten').off('.rw').on('click.rw', 'button', function(){
    var t = $.trim($(this).text()), btn = $(this);
    if (t.indexOf('Beri Ulasan') > -1) ulasan(btn);
    else if (t.indexOf('Bayar Sekarang') > -1){ btn.closest('[data-card]').attr('data-status', 'aktif'); toast('Pembayaran (simulasi) berhasil. Status berubah jadi aktif.'); tampil(); }
    else if (t.indexOf('Batalkan Pesanan') > -1){ if (confirm('Batalkan pesanan ini?')){ btn.closest('[data-card]').attr('data-status', 'batal').hide(); toast('Pesanan dibatalkan'); tampil(); } }
    else if (t.indexOf('Ajukan Pengembalian') > -1) pengembalian();
    else if (t.indexOf('Sewa Lagi') > -1){ muat('katalog', {mode:'rental', reset:true}); }
    else if (t.indexOf('Chat Vendor') > -1 || t.indexOf('Perpanjang') > -1 || t.indexOf('Tarik Saldo') > -1 || t.indexOf('Riwayat Deposit') > -1 || t.indexOf('Pusat Resolusi') > -1) toast('Fitur ini hanya simulasi pada versi UTS');
  });
};
function ulasan(btn){
  var rating = 0;
  var o = modal('<h3 class="font-headline-sm text-headline-sm">Beri ulasan &amp; rating</h3><div id="stars" class="flex gap-1 text-[32px] cursor-pointer select-none">' + [1,2,3,4,5].map(function(i){ return '<span data-s="' + i + '" class="text-outline-variant">★</span>'; }).join('') + '</div><span class="field-err" data-err="rating"></span>' +
    '<textarea id="komentar" rows="3" placeholder="Ceritakan kondisi barang dan pengalamanmu (min. 10 karakter)" class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2"></textarea><span class="field-err" data-err="komentar"></span>' +
    '<div class="flex gap-2"><button data-close class="flex-1 bg-surface-container rounded-lg py-2 font-bold">Batal</button><button id="kirimUlasan" class="flex-1 bg-primary text-on-primary rounded-lg py-2 font-bold">Kirim</button></div>');
  o.on('click', '[data-s]', function(){ rating = +$(this).data('s'); o.find('[data-s]').each(function(){ $(this).toggleClass('text-outline-variant', $(this).data('s') > rating).toggleClass('text-[#f5a623]', $(this).data('s') <= rating); }); err('rating', ''); });
  o.on('click', '#kirimUlasan', function(){
    var ok = err('rating', rating ? '' : 'Pilih rating 1-5 bintang.'), k = $.trim($('#komentar').val());
    ok = err('komentar', k.length < 10 ? 'Komentar minimal 10 karakter.' : '') && ok;
    if (!ok) return;
    o.remove(); toast('Ulasan terkirim: ' + rating + ' bintang'); btn.prop('disabled', true).text('Ulasan terkirim');
  });
}
function pengembalian(){
  var o = modal('<h3 class="font-headline-sm text-headline-sm">Ajukan pengembalian</h3><label class="font-label-lg">Tanggal pengembalian</label><input id="tglBalik" type="date" min="' + hariIni() + '" class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2"><span class="field-err" data-err="tglBalik"></span>' +
    '<label class="font-label-lg">Kondisi alat</label><select id="kondisiBalik" class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2"><option value="">-- pilih --</option><option>Baik</option><option>Rusak ringan</option><option>Rusak berat</option></select><span class="field-err" data-err="kondisiBalik"></span>' +
    '<div class="flex gap-2"><button data-close class="flex-1 bg-surface-container rounded-lg py-2 font-bold">Batal</button><button id="kirimBalik" class="flex-1 bg-primary text-on-primary rounded-lg py-2 font-bold">Ajukan</button></div>');
  o.on('click', '#kirimBalik', function(){
    var ok = err('tglBalik', $('#tglBalik').val() ? '' : 'Pilih tanggal pengembalian.');
    ok = err('kondisiBalik', $('#kondisiBalik').val() ? '' : 'Pilih kondisi alat.') && ok;
    if (!ok) return; o.remove(); toast('Pengajuan pengembalian terkirim');
  });
}

/* ---------- Profil (Poin 2 & Poin 3) ---------- */
INIT.profil = function(){
  // Tampilkan data PROFIL ke input form
  if (PROFIL.nama) $('#fullName').val(PROFIL.nama);
  if (PROFIL.username) $('#username').val(PROFIL.username);
  if (PROFIL.email) $('#userEmail').val(PROFIL.email);
  if (PROFIL.telp) $('#userPhone').val('0812-8899-7721');
  if ($('#txtAlamatDisplay').length){
    $('#txtAlamatDisplay').text(PROFIL.alamat + ', Kota ' + PROFIL.kota + ', Jawa Barat ' + PROFIL.pos);
  }

  var $f = $('#konten form').removeAttr('onsubmit'), ids = ['fullName','username','userEmail','userPhone','birthDate','gender'];
  ids.forEach(function(id){ if (!$('[data-err="' + id + '"]').length) $('#' + id).parent().after('<span class="field-err" data-err="' + id + '"></span>'); });
  function cek(){
    var v = function(i){ return $.trim($('#' + i).val()); }, ok = true;
    ok = err('fullName', !v('fullName') ? 'Nama lengkap wajib diisi.' : (v('fullName').length < 3 ? 'Nama minimal 3 karakter.' : (/\d/.test(v('fullName')) ? 'Nama tidak boleh berisi angka.' : ''))) && ok;
    ok = err('username', !/^[A-Za-z0-9_.]{4,20}$/.test(v('username')) ? 'Username 4-20 karakter: huruf, angka, titik, atau garis bawah.' : '') && ok;
    ok = err('userEmail', !v('userEmail') ? 'Email wajib diisi.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('userEmail')) ? 'Format email tidak valid.' : '')) && ok;
    ok = err('userPhone', !/^(08|\+628)[\d-]{8,15}$/.test(v('userPhone')) ? 'Gunakan format 08xxxxxxxxxx (10-13 digit).' : '') && ok;
    var b = v('birthDate'), mb = '';
    if (!b) mb = 'Tanggal lahir wajib diisi.'; else if (b > hariIni()) mb = 'Tanggal lahir tidak boleh di masa depan.'; else if (b > ymd(addDays(new Date(), -17 * 365))) mb = 'Usia minimal 17 tahun.';
    ok = err('birthDate', mb) && ok;
    ok = err('gender', v('gender') ? '' : 'Pilih jenis kelamin.') && ok;
    return ok;
  }
  $f.on('submit', function(e){
    e.preventDefault();
    if (cek()){
      PROFIL.nama = $.trim($('#fullName').val());
      PROFIL.username = $.trim($('#username').val());
      PROFIL.email = $.trim($('#userEmail').val());
      PROFIL.telp = $.trim($('#userPhone').val()).replace(/[^0-9+]/g, '');
      try { localStorage.setItem('rimba_profile', JSON.stringify(PROFIL)); } catch(e){}
      toast('Perubahan profil berhasil disimpan dan otomatis terhubung ke keranjang');
    } else {
      toast('Periksa isian yang berwarna merah');
    }
  });
  $f.on('blur', 'input, select', cek);

  // Navigasi menu sidebar pada halaman profil
  $('#konten').off('.profmenu').on('click.profmenu', '[data-prof-target]', function(e){
    e.preventDefault();
    var t = $(this).data('prof-target');
    if (t === 'biodata'){
      var el = document.getElementById('secBiodata');
      if (el) el.scrollIntoView({behavior:'smooth'});
    } else if (t === 'riwayat'){
      muat('riwayat');
    } else if (t === 'alamat'){
      var el = document.getElementById('secAlamat');
      if (el) el.scrollIntoView({behavior:'smooth'});
    } else if (t === 'rekening'){
      var el = document.getElementById('secRekening');
      if (el) el.scrollIntoView({behavior:'smooth'});
    } else if (t === 'kyc'){
      modal('<div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[32px]">verified_user</span><h3 class="font-headline-sm text-headline-sm">Verifikasi Identitas &amp; KYC</h3></div>' +
        '<div class="bg-secondary-container/40 p-3 rounded-lg text-body-md"><p><b>Status: Terverifikasi (KYC Lolos)</b></p><p class="text-on-surface-variant text-body-sm mt-1">Nama KTP: ' + PROFIL.nama + '<br>No. KTP: 327104********02<br>Status: Lolos verifikasi biometrik &amp; rekening bank</p></div>' +
        '<p class="text-body-sm text-on-surface-variant">Akun Anda memiliki akses penuh ke seluruh rental ekspedisi dan transaksi marketplace tanpa penahanan deposit berlebih.</p>' +
        '<button data-close class="w-full bg-primary text-on-primary py-2 rounded-lg font-bold">Tutup</button>');
    } else if (t === 'preloved'){
      muat('katalog', {mode:'preloved', reset:true});
    } else if (t === 'keamanan'){
      var o = modal('<div class="flex items-center gap-2 text-primary"><span class="material-symbols-outlined text-[32px]">lock_reset</span><h3 class="font-headline-sm text-headline-sm">Keamanan &amp; Kata Sandi</h3></div>' +
        '<div class="flex flex-col gap-2"><label class="font-label-md">Kata Sandi Lama</label><input type="password" id="oldPw" class="border rounded-lg p-2 bg-surface"><label class="font-label-md">Kata Sandi Baru</label><input type="password" id="newPw" class="border rounded-lg p-2 bg-surface"></div>' +
        '<div class="flex gap-2 mt-2"><button data-close class="flex-1 bg-surface-container py-2 rounded-lg font-bold">Batal</button><button id="btnSavePw" class="flex-1 bg-primary text-on-primary py-2 rounded-lg font-bold">Ubah Sandi</button></div>');
      o.on('click', '#btnSavePw', function(){ toast('Kata sandi berhasil diperbarui (simulasi)'); o.remove(); });
    }
  });

  // Modal ubah alamat pengiriman pada profil
  $('#btnEditAlamatProfil').on('click', function(e){
    e.preventDefault();
    var o = modal('<h3 class="font-headline-sm text-headline-sm">Ubah Alamat Pengiriman</h3>' +
      '<div class="flex flex-col gap-3">' +
      '<div><label class="font-label-md font-semibold">Alamat Lengkap</label><textarea id="mAlamat" rows="3" class="w-full border rounded-lg p-2 bg-surface">' + PROFIL.alamat + '</textarea></div>' +
      '<div><label class="font-label-md font-semibold">Kota</label><select id="mKota" class="w-full border rounded-lg p-2 bg-surface"><option value="Bogor">Bogor</option><option value="Jakarta">Jakarta</option><option value="Bandung">Bandung</option><option value="Surabaya">Surabaya</option><option value="Malang">Malang</option><option value="Yogyakarta">Yogyakarta</option></select></div>' +
      '<div><label class="font-label-md font-semibold">Kode Pos</label><input id="mPos" type="text" maxlength="5" value="' + PROFIL.pos + '" class="w-full border rounded-lg p-2 bg-surface"></div>' +
      '</div>' +
      '<div class="flex gap-2 mt-3"><button data-close class="flex-1 bg-surface-container py-2 rounded-lg font-bold">Batal</button><button id="btnSaveAlamat" class="flex-1 bg-primary text-on-primary py-2 rounded-lg font-bold">Simpan</button></div>');
    $('#mKota').val(PROFIL.kota);
    o.on('click', '#btnSaveAlamat', function(){
      var al = $.trim($('#mAlamat').val()), kt = $('#mKota').val(), ps = $.trim($('#mPos').val());
      if (al.length < 10){ toast('Alamat minimal 10 karakter'); return; }
      if (!/^\d{5}$/.test(ps)){ toast('Kode pos harus 5 digit angka'); return; }
      PROFIL.alamat = al; PROFIL.kota = kt; PROFIL.pos = ps;
      try { localStorage.setItem('rimba_profile', JSON.stringify(PROFIL)); } catch(e){}
      $('#txtAlamatDisplay').text(al + ', Kota ' + kt + ', Jawa Barat ' + ps);
      o.remove();
      toast('Alamat berhasil diperbarui dan disinkronkan ke keranjang');
    });
  });

  // Tombol aksi pengembalian cepat pada profil
  $('#btnPengembalianProfil').on('click', function(e){
    e.preventDefault();
    pengembalian();
  });

  // Tombol keluar pada sidebar profil
  $('#btnSidebarLogout').on('click', function(e){
    e.preventDefault();
    logout();
  });
};

/* ---------- Masuk / Registrasi (Poin 1) ---------- */
var currentMode = 'login';
var TAB_ON = 'flex-1 py-2 rounded-md font-label-lg text-label-lg transition-all text-center bg-surface-container-lowest text-on-surface shadow-sm font-semibold';
var TAB_OFF = 'flex-1 py-2 rounded-md font-label-lg text-label-lg transition-all text-center text-on-surface-variant hover:text-on-surface';
var BTN_LINK = 'text-primary font-semibold hover:underline inline-flex items-center gap-1 font-label-md text-label-md';
function switchAuthMode(mode){
  currentMode = mode; var reg = mode === 'register';
  $('#tab-daftar').attr('class', reg ? TAB_ON : TAB_OFF); $('#tab-masuk').attr('class', reg ? TAB_OFF : TAB_ON);
  $('#auth-title').text(reg ? 'Mulai Petualangan Bersama RimbaLestari' : 'Selamat Datang Kembali, Penjelajah!');
  $('#auth-subtitle').text(reg ? 'Daftar sekarang dan klaim deposit gratis pada sewa pertamamu.' : 'Gunakan kredensial terdaftar untuk melanjutkan sewa atau transaksi gear.');
  $('#submit-text').text(reg ? 'Daftarkan Akun Penjelajah' : 'Masuk ke RimbaLestari');
  $('#field-fullname').toggleClass('hidden', !reg).toggleClass('flex', reg);
  $('#field-ktp').toggleClass('hidden', !reg).toggleClass('flex', reg);
  $('#forgot-link').toggleClass('invisible', reg); $('#voucher-notice').toggleClass('hidden', !reg);
  $('#toggle-prompt').html(reg ? 'Sudah memiliki akun? <button type="button" onclick="switchAuthMode(\'login\')" class="' + BTN_LINK + '">Masuk ke Akun</button>' : 'Belum punya akun? <button type="button" onclick="switchAuthMode(\'register\')" class="' + BTN_LINK + '">Daftar Sekarang</button>');
  $('[data-err]').text(''); $('.is-invalid').removeClass('is-invalid');
}
function togglePasswordVisibility(){
  var p = $('#password'), show = p.attr('type') === 'password'; p.attr('type', show ? 'text' : 'password'); $('#pwd-icon').text(show ? 'visibility_off' : 'visibility');
}
INIT.masuk = function(){
  switchAuthMode('login');
  $('#formAuth').on('submit', function(e){
    e.preventDefault();
    var reg = currentMode === 'register', id = $.trim($('#identifier').val()), pw = $('#password').val(), ok = true;
    if (reg){ var n = $.trim($('#nama_lengkap').val()); $('#nama_lengkap').parent().after($('#nama_lengkap').parent().next('.field-err').length ? '' : '<span class="field-err" data-err="nama_lengkap"></span>');
      ok = err('nama_lengkap', !n ? 'Nama lengkap wajib diisi.' : (n.length < 3 ? 'Nama minimal 3 karakter.' : (/\d/.test(n) ? 'Nama tidak boleh berisi angka.' : ''))) && ok; }
    if ($('[data-err=identifier]').length === 0) $('#identifier').parent().after('<span class="field-err" data-err="identifier"></span>');
    if ($('[data-err=password]').length === 0) $('#password').parent().after('<span class="field-err" data-err="password"></span>');
    var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id), okWa = /^(08|\+628)\d{8,11}$/.test(id);
    ok = err('identifier', !id ? 'Email atau nomor WhatsApp wajib diisi.' : (okEmail || okWa ? '' : 'Isi email yang valid atau nomor WhatsApp 08xxxxxxxxxx.')) && ok;
    ok = err('password', !pw ? 'Kata sandi wajib diisi.' : (pw.length < 8 ? 'Kata sandi minimal 8 karakter.' : (!/[A-Za-z]/.test(pw) || !/\d/.test(pw) ? 'Kombinasikan huruf dan angka.' : ''))) && ok;
    if (reg){ var f = $('#ktp')[0].files[0], mk = '';
      if (!f) mk = 'Unggah foto KTP/KTM.'; else if (['image/jpeg','image/png'].indexOf(f.type) < 0) mk = 'File harus JPG atau PNG.'; else if (f.size > 2097152) mk = 'Ukuran file maksimal 2 MB.';
      ok = err('ktp', mk) && ok; }
    if (!ok) return;
    if (reg){
      if (USERS.some(function(u){ return u.id === id; })){ err('identifier', 'Akun sudah terdaftar. Silakan masuk.'); return; }
      USERS.push({id:id, pw:pw}); toast('Pendaftaran berhasil. Verifikasi KTP/KTM diproses (dummy).'); switchAuthMode('login'); $('#password').val('');
    } else {
      if (!USERS.some(function(u){ return u.id === id && u.pw === pw; })){ err('password', 'Akun atau kata sandi salah. Akun demo: rian@email.com / Rimba1234'); return; }
      isLoggedIn = true;
      sessionStorage.setItem('rimba_logged_in', 'true');
      renderAuthHeader();
      toast('Selamat datang kembali, Rian Ardiansyah!');
      muat('beranda'); // Setelah login berhasil, langsung masuk ke dashboard (beranda)
    }
  });

  // Tombol 1-klik demo login
  $('#btnDemoLogin').on('click', function(e){
    e.preventDefault();
    $('#identifier').val('rian@email.com');
    $('#password').val('Rimba1234');
    $('#formAuth').trigger('submit');
  });

  $('#identifier, #password, #nama_lengkap').on('input', function(){ err(this.id, ''); });
  $('#forgot-link').on('click', function(e){ e.preventDefault(); toast('Tautan reset dikirim (simulasi)'); });
  $('<p class="text-body-sm text-on-surface-variant text-center">Akun demo: rian@email.com / Rimba1234</p>').insertAfter('#btnDemoLogin');
};

/* ---------- Inisialisasi Header & Global Listeners ---------- */
$(function(){
  var $h = $('header');

  // Global delegasi untuk semua elemen [data-path] di seluruh halaman (header, profil, beranda, keranjang, riwayat)
  $(document).on('click', '[data-path], a[data-path]', function(e){
    e.preventDefault();
    var p = $(this).attr('data-path') || $(this).data('path');
    var t = $.trim($(this).text());
    var tab = $(this).data('tab');
    var kat = {'Tenda Dome':'tenda','Carrier & Ransel':'tas','Sepatu Gunung':'sepatu','Alat Masak Camping':'masak','Jaket Waterproof':'jaket','Matras & Sleeping Bag':'sleeping'}[t];
    if (p === 'katalog-produk') muat('katalog', {reset:true, kat: kat || ''});
    else if (p === 'rental-alat') muat('katalog', {reset:true, mode:'rental'});
    else if (p === 'jual-preloved') muat('katalog', {reset:true, mode:'preloved'});
    else if (p === 'pemesanan-dan-riwayat') muat('riwayat', {tab: tab});
    else if (p === 'beranda') muat('beranda');
    else if (p === 'tentang-kami'){ muat('beranda'); setTimeout(function(){ var a = document.getElementById('tentang'); if (a) a.scrollIntoView({behavior:'smooth'}); }, 400); }
    else if (p === 'masuk') muat('masuk');
    else if (p === 'profil') muat('profil');
  });

  var $nav = $h.find('nav').first();
  $nav.append($nav.find('a').last().clone(true).attr('data-path', 'masuk').removeAttr('aria-current').text('Masuk / Daftar'));
  
  $h.find('img').first().closest('div.flex').css('cursor', 'pointer').on('click', function(){ muat(isLoggedIn ? 'beranda' : 'masuk'); });
  $h.find('button[aria-label="Keranjang belanja"]').on('click', function(){ muat('keranjang'); });
  $h.find('button[aria-label="Notifikasi"]').on('click', function(){ toast('Tidak ada notifikasi baru (dummy)'); });
  $h.find('button[aria-label="Pesan"]').on('click', function(){ toast('Fitur pesan hanya simulasi'); });
  
  // Profil / Masuk di Header
  $('#headerUserArea').on('click', function(){
    if (isLoggedIn) muat('profil');
    else muat('masuk');
  });

  // Tombol Logout di Header
  $('#headerLogoutBtn').on('click', function(e){
    e.preventDefault();
    logout();
  });

  var $q = $h.find('input[type=text]').first(), tm;
  $q.on('input', function(){ var v = $.trim(this.value); clearTimeout(tm); tm = setTimeout(function(){ if (CUR !== 'katalog') muat('katalog', {reset:true, q:v}); else { S.q = v; S.page = 1; renderKatalog(); } }, 350); });
  $h.find('select').first().on('change', function(){ muat('katalog', {reset:true, mode: this.value === 'all' ? undefined : this.value}); });

  renderAuthHeader();

  // Poin 1: Sebelum ke dashboard (beranda), wajib login terlebih dahulu
  if (isLoggedIn) {
    muat('beranda');
  } else {
    muat('masuk');
  }
});
