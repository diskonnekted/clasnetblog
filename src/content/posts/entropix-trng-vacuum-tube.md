---
title: "Entropix TRNG: Mengamankan Kriptografi dengan Keacakan Kuantum Tabung Vakum 12AX7"
description: "Mengupas arsitektur Entropix, sistem True Random Number Generator (TRNG) berbasis tabung vakum dual-triode 12AX7 dan ESP8266 yang memanfaatkan noise kuantum untuk menghasilkan entropi mutlak."
date: "2026-05-29"
category: "Embedded & IoT"
author: "Ahmad Pratama"
authorRole: "Hardware Security Engineer"
readingTime: "7 min read"
featured: false
number: "5.5"
coverImage: "/images/blog-entropix-trng.png"
---

Dalam dunia keamanan informasi dan kriptografi, kunci enkripsi yang kuat adalah fondasi utama pertahanan. Namun, sekuat apa pun algoritma kriptografi yang digunakan, kekuatannya akan runtuh jika bilangan acak yang digunakan untuk menghasilkan kunci tersebut dapat ditebak atau diprediksi.

Sebagian besar sistem komputer menggunakan *Pseudo-Random Number Generator* (PRNG) yang bekerja secara deterministik berdasarkan rumus matematika. Untuk keamanan tingkat militer, kita membutuhkan **True Random Number Generator (TRNG)** yang mengambil sumber keacakan (entropi) langsung dari fenomena fisik alam yang benar-benar tidak dapat diprediksi.

Proyek **[Entropix TRNG](https://github.com/diskonnekted/TRNG)** yang dipublikasikan melalui web profil **[entropix.clasnet.co.id](https://entropix.clasnet.co.id/)** adalah inovasi perangkat keras keamanan (*Hardware Security Module*) yang menjembatani teknologi lawas **tabung vakum 12AX7** dengan mikrokontroler modern **ESP8266** untuk menghasilkan bilangan acak dengan entropi murni mendekati sempurna (>0.99 bits/bit).

---

## Bagaimana Entropix Bekerja? Memanfaatkan Kebisingan Kuantum

Conventional silicon-based TRNGs biasanya memanfaatkan kebisingan termal dari sirkuit semikonduktor. Namun, sirkuit silikon rentan terhadap gangguan luar (seperti fluktuasi suhu eksternal) dan serangan samping (*side-channel attacks*). 

Entropix mengatasi kelemahan ini dengan memanfaatkan tabung vakum dual-triode tipe **12AX7**. Di dalam ruang hampa udara tabung kaca ini, elektron melompat dari katoda yang panas menuju anoda melalui beberapa fenomena mekanika kuantum yang menghasilkan noise acak murni:

1. **Shot Noise**: Kebisingan kuantum yang terjadi akibat sifat diskrit dari muatan listrik elektron. Pemancaran elektron dari katoda ke anoda adalah proses stokastik (acak) yang diatur oleh probabilitas kuantum.
2. **Thermal Noise (Johnson-Nyquist)**: Getaran termal dari pembawa muatan listrik di dalam komponen aktif yang beroperasi pada suhu tinggi (80-120°C).
3. **Quantum Tunneling**: Elektron menembus penghalang potensial listrik pada grid kontrol tabung secara acak pada tingkat sub-atomik.

---

## Arsitektur Dual-Channel Entropix

Untuk menjamin kualitas keacakan dan keandalan sistem (*fault tolerance*), Entropix menggunakan arsitektur jalur ganda (*dual-channel*):

<div class="my-8 w-full rounded-2xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm p-6 flex flex-col items-center space-y-6 relative overflow-hidden group hover:border-neutral-800 transition-colors duration-500">
<div class="px-4 py-2 rounded-full border border-neutral-850 bg-neutral-900 text-xs font-mono font-bold text-white tracking-widest uppercase">
DIAGRAM BLOK ARSITEKTUR ENTROPIX TRNG
</div>

<div class="w-full max-w-2xl space-y-6">
<!-- Row 1: Source (12AX7 Dual Triode) -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div class="border border-neutral-900 bg-neutral-950/60 rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-[8px] font-mono text-neutral-500 mb-1">SALURAN A (TRIODA 1)</span>
<h4 class="text-xs font-bold text-white mb-1">Shot &amp; Thermal Noise</h4>
<p class="text-[10px] text-neutral-400">Fluktuasi tegangan kuantum analog ~100 µV RMS.</p>
</div>
<div class="border border-neutral-900 bg-neutral-950/60 rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-[8px] font-mono text-neutral-500 mb-1">SALURAN B (TRIODA 2)</span>
<h4 class="text-xs font-bold text-white mb-1">Shot &amp; Thermal Noise</h4>
<p class="text-[10px] text-neutral-400">Fluktuasi tegangan kuantum analog ~100 µV RMS.</p>
</div>
</div>

<!-- Connector Arrow -->
<div class="flex flex-col items-center text-neutral-600 text-sm">
<span>↓</span>
<span class="text-[8px] font-mono text-neutral-500">Amplifikasi 1000x (OPA2134) &amp; Butterworth Low-Pass Filter</span>
</div>

<!-- Row 2: Signal Processing & ADC -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div class="border border-neutral-900 bg-neutral-950/60 rounded-xl p-3 flex flex-col items-center text-center">
<h4 class="text-xs font-bold text-white mb-1">ADC A (12-bit, 250 kS/s)</h4>
<p class="text-[10px] text-neutral-400">Konversi sinyal analog terfilter menjadi data digital.</p>
</div>
<div class="border border-neutral-900 bg-neutral-950/60 rounded-xl p-3 flex flex-col items-center text-center">
<h4 class="text-xs font-bold text-white mb-1">ADC B (12-bit, 250 kS/s)</h4>
<p class="text-[10px] text-neutral-400">Konversi sinyal analog terfilter menjadi data digital.</p>
</div>
</div>

<!-- Connector Arrow -->
<div class="flex flex-col items-center text-neutral-600 text-sm">
<span>↓</span>
<span class="text-[8px] font-mono text-neutral-500">XOR Combiner (Koreksi Bias Von Neumann)</span>
</div>

<!-- Row 3: XOR, ESP8266 & Output -->
<div class="border border-neutral-900 bg-neutral-950/60 rounded-xl p-4 flex flex-col items-center text-center max-w-md mx-auto w-full">
<span class="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-900/50 text-[9px] font-mono text-emerald-400 mb-2">PENGOLAH DATA AKHIR (ESP8266)</span>
<h4 class="text-xs font-bold text-white mb-1">XOR Combiner &amp; REST API</h4>
<p class="text-[10px] text-neutral-400">Penggabungan dua stream data acak murni, siap diakses via WiFi/Web API.</p>
</div>
</div>

<!-- Progress/Min-Entropy Bar -->
<div class="w-full max-w-2xl bg-neutral-950/50 p-4 rounded-xl border border-neutral-900">
<div class="flex justify-between items-center text-[10px] font-mono text-neutral-500 mb-1.5">
<span>KUALITAS ENTROPI KELUARAN (MIN-ENTROPY)</span>
<span class="text-emerald-400 font-bold">>0.99 bits/bit (Perfect)</span>
</div>
<div class="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850/80">
<div class="h-full bg-gradient-to-r from-neutral-800 via-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style="width: 99.5%;"></div>
</div>
</div>
</div>

Proses pemrosesan sinyal pada Entropix berjalan dalam beberapa tahap:
1. **Amplifikasi Sinyal**: Noise kuantum analog yang sangat kecil dari tabung 12AX7 diperkuat sebanyak 1000 kali (60 dB) menggunakan operational amplifier audiophile **OPA2134** berderau rendah untuk menjaga integritas keacakan.
2. **Filtering**: Sinyal dilewatkan pada filter low-pass Butterworth orde ke-4 dengan frekuensi cutoff 100 kHz guna memangkas interferensi frekuensi radio eksternal.
3. **Digitalisasi (ADC)**: Sinyal analog yang bersih diubah menjadi data biner digital melalui konverter ADC 12-bit dengan kecepatan sampling 250 kS/s.
4. **Kombinasi XOR**: Stream biner dari Saluran A dan Saluran B digabungkan menggunakan operasi logika XOR. Kombinasi ini menghilangkan bias statistik dan melipatgandakan tingkat entropi keluaran.

---

## Uji Sertifikasi dan Kepatuhan Kriptografi

Keacakan dari sebuah generator entropi tidak boleh diasumsikan begitu saja, melainkan harus diuji secara statistik. Entropix TRNG telah lulus serangkaian pengujian standardisasi militer dan industri terkemuka:

- **NIST SP 800-22**: Paket uji statistik standar yang mengevaluasi keacakan biner untuk mendeteksi deviasi non-acak. Entropix berhasil lulus seluruh pengujian (termasuk frequency test, runs test, dan spectral DFT).
- **BSI AIS-31 (Class PTG.2)**: Sertifikasi standar Eropa untuk generator bilangan acak fisik guna memastikan ketahanan terhadap gangguan lingkungan dan kegagalan komponen.
- **FIPS 140-3**: Standar keamanan modul kriptografi AS yang memverifikasi integritas perlindungan fisik dan matematis dari generator kunci enkripsi.

---

## Integrasi IoT dan Kemudahan Akses: ESP8266 Dashboard

Salah satu keunggulan utama Entropix dibandingkan TRNG industri tradisional adalah kemudahan integrasinya dengan infrastruktur modern melalui mikrokontroler **ESP8266**. Perangkat ini dilengkapi dengan:

* **Real-time Web Dashboard**: Antarmuka berbasis web responsif untuk memantau kesehatan tabung vakum (suhu filamen, tegangan supply anoda), serta statistik kualitas entropi secara langsung.
* **REST API Server**: Menyediakan endpoint API lokal (seperti `/api/random/bytes` atau `/api/random/hex`) yang memudahkan server web, aplikasi backend, atau perangkat IoT lain mengambil data acak secara instan melalui protokol HTTP/JSON.
* **Health Monitoring & Auto-Calibration**: Algoritma cerdas yang mendeteksi kegagalan perangkat keras (misalnya filamen tabung putus) dan secara otomatis mengkalibrasi ulang parameter bias untuk mempertahankan kualitas keacakan di atas ambang kritis.

---

## Kesimpulan

**Entropix TRNG** membuktikan bahwa teknologi retro tidak selamanya tertinggal. Dengan menggabungkan keacakan mekanika kuantum murni dari tabung vakum 12AX7 dengan pemrosesan sinyal presisi OPA2134 dan fleksibilitas IoT dari ESP8266, Entropix menawarkan solusi Hardware Security Module yang tangguh, transparan (open source), dan sangat aman untuk kebutuhan enkripsi modern.

Bagi pengembang keamanan, akademisi, maupun antusias perangkat keras, proyek ini menyediakan cetak biru lengkap (*open source firmware* dan dokumentasi skematik) untuk membangun benteng keamanan informasi yang tidak dapat ditembus oleh superkomputer sekalipun.
