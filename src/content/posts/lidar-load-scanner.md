---
title: "Orion LiDAR Load Scanner: Otomasi Pengukuran Muatan berbasis IoT"
description: "Membahas bagaimana Orion LiDAR Load Scanner mengintegrasikan sensor ToF VL53L1X, kamera ESP32-CAM, dan algoritma State Machine untuk mengukur volume muatan truk."
date: "2026-05-29"
category: "Embedded & IoT"
author: "Ahmad Pratama"
authorRole: "AI & Physics Simulation Engineer"
readingTime: "6 min read"
featured: false
number: "5.3"
coverImage: "/images/blog-lidar-cover.png"
---

Dalam industri logistik, konstruksi, dan pertambangan, pengukuran volume muatan material curah (seperti pasir, kerikil, atau tanah galian) pada truk sering kali menghadapi kendala efisiensi. Metode jembatan timbang konvensional membutuhkan waktu lama dan hanya mengukur berat total, bukan volume visual. Di sisi lain, estimasi manual oleh petugas sangat rentan terhadap kesalahan manusia (*human error*) dan manipulasi data.

Proyek **Orion LiDAR Load Scanner** hadir sebagai solusi modern berbasis *Internet of Things* (IoT). Menggabungkan sensor pemindai jarak laser dengan modul kamera mikro, sistem ini mampu mendeteksi keberadaan truk, melacak profil muatan, serta mengambil bukti foto dokumentasi secara otonom saat truk melintasi portal pemindai.

---

## 1. Integrasi Perangkat Keras: ESP32-CAM & LiDAR ToF

Jantung dari perangkat pemindai ini adalah mikrokontroler **ESP32-CAM** (Model AI Thinker). Modul berbiaya rendah ini sangat bertenaga karena mengintegrasikan chip ESP32 berkemampuan Wi-Fi/Bluetooth dengan sensor kamera **OV2640**. 

Untuk mengukur ketinggian muatan dengan presisi tinggi, ESP32-CAM dihubungkan dengan sensor **LiDAR VL53L1X**:
-   **Teknologi Time-of-Flight (ToF)**: VL53L1X memancarkan pulsa laser inframerah tak terlihat dan mengukur waktu yang dibutuhkan cahaya untuk memantul kembali dari permukaan muatan. Metode ini memberikan hasil pengukuran jarak yang sangat akurat hingga jarak 4 meter, tidak terpengaruh oleh warna material atau kondisi cahaya eksternal.
-   **Koneksi Pin I2C Kustom**: Karena modul ESP32-CAM memiliki pin GPIO terbatas akibat penggunaan jalur data kamera, komunikasi I2C dikonfigurasi secara perangkat lunak (*software I2C*) menggunakan **GPIO 13 (SDA)** dan **GPIO 14 (SCL)**.

<div class="my-8 p-6 rounded-2xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm flex flex-col items-center hover:border-neutral-800 transition-colors duration-500 relative overflow-hidden group">
  <div class="px-4 py-2 rounded-full border border-neutral-850 bg-neutral-900 text-xs font-mono font-bold text-white tracking-widest uppercase mb-6">
    SKEMA KONEKSI WIRING PERANGKAT
  </div>
  
  <div class="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12 w-full max-w-lg">
    <!-- ESP32-CAM Pinout -->
    <div class="w-full sm:w-[40%] p-4 rounded-xl border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-3">
      <span class="text-[9px] font-mono text-neutral-500">PENGENDALI</span>
      <h4 class="text-xs font-bold text-white">ESP32-CAM</h4>
      <div class="w-full space-y-1 font-mono text-[10px] text-neutral-400">
        <div class="flex justify-between border-b border-neutral-900 pb-0.5"><span>GPIO 13</span> <span class="text-neutral-600">SDA</span></div>
        <div class="flex justify-between border-b border-neutral-900 pb-0.5"><span>GPIO 14</span> <span class="text-neutral-600">SCL</span></div>
        <div class="flex justify-between border-b border-neutral-900 pb-0.5"><span>5V / 3V</span> <span class="text-neutral-600">VCC</span></div>
        <div class="flex justify-between"><span>GND</span> <span class="text-neutral-600">GND</span></div>
      </div>
    </div>

    <!-- Wiring connection lines -->
    <div class="hidden sm:flex flex-col justify-around h-20 text-neutral-600 w-12 font-mono text-xs">
      <div class="flex items-center justify-center border-t border-dashed border-neutral-800 w-full">➔</div>
      <div class="flex items-center justify-center border-t border-dashed border-neutral-800 w-full mt-2">➔</div>
      <div class="flex items-center justify-center border-t border-dashed border-neutral-800 w-full mt-2">➔</div>
      <div class="flex items-center justify-center border-t border-dashed border-neutral-800 w-full mt-2">➔</div>
    </div>

    <!-- LiDAR Pinout -->
    <div class="w-full sm:w-[40%] p-4 rounded-xl border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-3">
      <span class="text-[9px] font-mono text-neutral-500">SENSOR DETEKSI</span>
      <h4 class="text-xs font-bold text-white">LiDAR VL53L1X</h4>
      <div class="w-full space-y-1 font-mono text-[10px] text-neutral-400">
        <div class="flex justify-between border-b border-neutral-900 pb-0.5"><span class="text-neutral-600">SDA</span> <span>SDA</span></div>
        <div class="flex justify-between border-b border-neutral-900 pb-0.5"><span class="text-neutral-600">SCL</span> <span>SCL</span></div>
        <div class="flex justify-between border-b border-neutral-900 pb-0.5"><span class="text-neutral-600">VCC</span> <span>VCC</span></div>
        <div class="flex justify-between"><span class="text-neutral-600">GND</span> <span>GND</span></div>
      </div>
    </div>
  </div>
</div>

---

## 2. Algoritma State Machine untuk Deteksi Otonom

Agar sistem dapat beroperasi secara mandiri tanpa memerlukan tombol aktivasi fisik dari petugas, firmware ESP32-CAM mengadopsi algoritma **Finite State Machine** (FSM) yang mendeteksi pergerakan truk berdasarkan pembacaan sensor LiDAR secara konstan:

1.  **State 1: Masuk (Idle -> Truck Detected)**
    Dalam kondisi diam (*idle*), sensor LiDAR mengukur jarak ke lantai jalan (misalnya 3.5 meter). Saat moncong truk melintasi bawah portal, jarak yang dibaca sensor tiba-tiba memendek (misal menjadi 1.8 meter). Sistem mendeteksi bahwa truk telah **Masuk** ke area pemindaian.
2.  **State 2: Cari Puncak (Scanning)**
    Selagi badan truk bergerak lambat melewati portal, sensor LiDAR terus melakukan pembacaan cepat (hingga 50 kali per detik). Algoritma melacak nilai jarak terpendek (yang berarti titik muatan tertinggi atau **Puncak Muatan**) secara dinamis.
3.  **State 3: Keluar (Capture & Send)**
    Saat bagian belakang bak truk meninggalkan sensor, jarak pembacaan kembali ke baseline lantai jalan (3.5 meter). Sistem mendeteksi bahwa truk telah **Keluar**. 

Tepat pada momen transisi ini, mikrokontroler memicu kamera ESP32-CAM untuk mengambil foto truk, menggabungkan data tinggi puncak yang terdeteksi, dan mengirimkannya ke server backend.

---

## 3. Efisiensi Transmisi Event-Driven (Hemat Bandwidth)

Dalam instalasi industri terpencil (seperti area tambang atau galian C), koneksi internet seluler sering kali terbatas dan mahal. Orion LiDAR Load Scanner mengatasi masalah ini dengan menerapkan arsitektur komunikasi **Event-Driven**:

>
> **Komunikasi Berbasis Peristiwa**: Perangkat IoT tidak mengirimkan data pengukuran secara terus-menerus (*periodic streaming*). Modul hanya akan mengaktifkan transmisi Wi-Fi/data dan mengirimkan muatan data (*JSON payload* beserta lampiran gambar JPEG) **hanya ketika satu siklus State Machine (Masuk -> Cari Puncak -> Keluar) selesai**. Strategi ini menghemat konsumsi energi baterai dan memotong penggunaan kuota data seluler hingga lebih dari **90%**.

---

## 4. Sistem Backend & Web Dashboard

Di sisi server, aplikasi menggunakan backend berbasis **PHP** dengan basis data **MySQL/MariaDB**:
-   **API Endpoints**: Menerima request POST multi-part dari ESP32-CAM berisi data numerik (tinggi muatan, ID alat) dan menyimpan berkas gambar truk ke direktori `/photos/`.
-   **Dashboard Pemantauan**: Frontend menyajikan tabel riwayat deteksi yang diperbarui secara langsung, lengkap dengan tampilan foto bukti truk untuk mencegah kecurangan (*fraud*). Grafik statistik harian membantu manajemen memantau volume total material yang keluar dari lokasi galian setiap harinya.

---

## Kesimpulan

Proyek **Orion LiDAR Load Scanner** adalah contoh nyata bagaimana teknologi *embedded system* berbiaya rendah dapat memecahkan masalah industri yang krusial. Dengan mengombinasikan sensor laser LiDAR ToF VL53L1X, kemampuan pemrosesan gambar ESP32-CAM, dan perancangan firmware *State Machine* yang cerdas, sistem ini berhasil menghadirkan otomasi pencatatan muatan truk yang akurat, transparan, dan hemat energi.
