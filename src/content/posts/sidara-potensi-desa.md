---
title: "SIDARA Banjarnegara: Rekayasa Frontend GIS Potensi Desa"
description: "Membahas bagaimana Sistem Informasi Database Potensi Desa (SIDARA) merancang peta sebaran GIS interaktif menggunakan Leaflet.js dan Tailwind CSS."
date: "2026-05-29"
category: "Rekayasa Frontend"
author: "Budi Pratama"
authorRole: "Senior Frontend Architect"
readingTime: "6 min read"
featured: false
number: "3.3"
coverImage: "/images/blog-sidara-cover.png"
---

Kabupaten Banjarnegara, Jawa Tengah, memiliki kekayaan potensi wilayah yang sangat beragam—dari sektor pertanian dataran tinggi di Kalibening, pariwisata alam di Dieng, hingga sentra kuliner dan UMKM di dataran rendah. Sayangnya, banyak dari potensi strategis ini belum terpetakan secara digital sehingga menyulitkan investor, wisatawan, maupun pemerintah kabupaten dalam memetakan peluang ekonomi.

Untuk menjembatani kebutuhan data spasial ini, dikembangkanlah platform **SIDARA (Sistem Informasi Database Potensi Desa)**. Fokus utama rekayasa frontend pada sistem ini adalah bagaimana merancang antarmuka **Geographic Information System (GIS)** yang interaktif, berkinerja tinggi pada perangkat mobile, serta mudah dioperasikan baik oleh pengunjung umum maupun operator desa.

---

## 1. Integrasi Leaflet.js: Rendering Peta Spasial Ringan

Peta sebaran potensi adalah fitur utama dari SIDARA. Penggunaan Google Maps API sering kali dihindari dalam proyek kelurahan/kabupaten skala menengah karena model lisensi berbayar dan ukuran pustaka yang cukup berat untuk koneksi internet pedesaan. 

Sebagai alternatif, frontend SIDARA mengintegrasikan **Leaflet.js** dipadu dengan tile server gratis dari **OpenStreetMap**:
-   **Keringanan Pustaka**: Ukuran file CSS dan JS Leaflet hanya berkisar **40KB**, sangat jauh lebih ringan dibanding pustaka pemetaan lainnya. Ini memastikan halaman peta dapat dimuat dalam waktu kurang dari 2 detik pada jaringan 3G.
-   **Custom Marker Dinamis**: Untuk mempermudah navigasi visual, penanda (*marker*) pada peta diwarnai berdasarkan kategori potensi desa (contoh: *marker* hijau untuk Pertanian/Perkebunan, biru untuk Wisata Alam, emas untuk Kuliner/UMKM, dan merah untuk Pertambangan).
-   **Popup Kaya Informasi**: Setiap marker yang diklik akan membuka jendela popup berisi gambar produk, rating verifikasi, tombol kontak WhatsApp langsung ke pemilik usaha, serta tautan navigasi Google Maps untuk rute perjalanan.

```javascript
// Contoh inisialisasi peta Leaflet.js untuk SIDARA
const map = L.map('map').setView([-7.392220, 109.677500], 11); // Koordinat Banjarnegara

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Menambahkan penanda potensi
const marker = L.marker([-7.34567, 109.65432], { icon: greenIcon }).addTo(map);
marker.bindPopup("<b>Kopi Arabika Kalibening</b><br>Kategori: Pertanian<br><a href='/potensi/kopi-kalibening'>Detail Potensi</a>");
```

---

## 2. Sistem Penyaringan Multi-Dimensi di Sisi Klien

Mencari potensi di wilayah seluas Kabupaten Banjarnegara membutuhkan sistem filter yang presisi. Pengunjung harus dapat dengan mudah memotong data berdasarkan Kecamatan, Kategori Potensi, dan Status Verifikasi.

Rekayasa frontend SIDARA mengimplementasikan **Client-Side Filtering** yang responsif:
-   **Tanpa Page Reload**: Filter dikelola menggunakan JavaScript untuk memanipulasi visibilitas marker pada peta dan daftar kartu potensi di panel samping secara instan tanpa perlu memuat ulang seluruh halaman.
-   **Kombinasi Query**: Pengguna dapat menggabungkan kriteria pencarian (misalnya: mencari potensi berkategori "Kuliner" hanya di Kecamatan "Batur"). Peta secara dinamis melakukan penyesuaian batas tampilan koordinat (*pan/zoom fitBounds*) berdasarkan sebaran marker yang tersisa setelah disaring.

---

## 3. UX Crowdsourcing & Sistem Lencana Verifikasi

Salah satu pilar keberhasilan database potensi desa adalah keakuratan data yang diinput langsung oleh masyarakat (pemilik UMKM/pengelola aset desa). SIDARA mengadopsi alur pendaftaran mandiri (*crowdsourcing*) dengan antarmuka yang sangat disederhanakan:

*   **Penyemat Koordinat GPS**: Warga yang ingin mendaftarkan usahanya dapat menentukan lokasi persis di peta hanya dengan mengklik titik koordinat di kanvas peta Leaflet. Sistem secara otomatis membaca nilai Latitude dan Longitude untuk diisikan ke dalam formulir pendaftaran.
*   **Lencana Status Verifikasi (Verification Badges)**: Untuk menjaga keaslian data, setiap item potensi menampilkan lencana visual yang jelas:
    -   `Verified` (Lencana Hijau dengan ikon centang): Menandakan data telah diverifikasi langsung oleh Admin Desa dengan mengunjungi lokasi fisik usaha.
    -   `Pending` (Lencana Kuning): Data crowdsourcing yang baru masuk dan sedang menunggu antrean kurasi.

---

## 4. Desain Tata Letak Dashboard Responsif pada Template Laravel Blade

Penyusunan frontend dasbor admin desa dan super admin kabupaten dirancang menggunakan **Tailwind CSS** yang diintegrasikan ke dalam arsitektur **Laravel Blade**:
-   **Split Screen Layout**: Di layar desktop, aplikasi menyajikan tata letak dua kolom: kolom kiri berupa daftar direktori potensi yang dapat digulir, dan kolom kanan berupa kanvas peta Leaflet yang tetap statis mengikuti pergerakan navigasi kamera.
-   **Mobile-Optimized Drawer**: Pada layar smartphone, kanvas peta mengambil porsi layar penuh, sementara detail daftar potensi disembunyikan di dalam *bottom drawer* yang dapat ditarik ke atas menggunakan gesekan jari (*swipe gestures*).

---

## Kesimpulan

Platform **SIDARA** membuktikan bahwa visualisasi data geografis tingkat kelurahan tidak harus mahal dan lambat. Melalui rekayasa frontend yang memanfaatkan integrasi Leaflet.js untuk pemetaan ringan, manipulasi filter sisi klien yang instan, serta formulir crowdsourcing yang mudah digunakan, platform ini berhasil menjadi pustaka potensi digital yang responsif, inklusif, dan siap mempromosikan keunggulan lokal Kabupaten Banjarnegara ke tingkat nasional.
