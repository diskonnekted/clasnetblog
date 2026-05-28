---
title: "VPDS: Deteksi Parkir & Lalu Lintas Cerdas berbasis YOLOv8"
description: "Membahas bagaimana Vehicle Parking Detection System mengintegrasikan kamera otonom ESP32-CAM, model visi komputer YOLOv8, dan peta interaktif untuk manajemen lalu lintas kota."
date: "2026-05-29"
category: "AI & Agen"
author: "Ahmad Pratama"
authorRole: "AI & Physics Simulation Engineer"
readingTime: "7 min read"
featured: false
number: "1.1"
coverImage: "/images/blog-vpds-cover.png"
---

Kemacetan lalu lintas dan kelangkaan ruang parkir adalah dua masalah kronis di wilayah perkotaan yang terus bertumbuh. Metode pemantauan konvensional menggunakan kamera CCTV pasif sering kali tidak efisien karena membutuhkan operator manusia untuk mengawasi layar secara terus-menerus. 

Untuk merevolusi sistem manajemen transportasi kota, dikembangkanlah **VPDS (Vehicle Parking & Traffic Detection System)**. Proyek ini mengintegrasikan kecerdasan buatan (*Artificial Intelligence*) pada kamera pemantau untuk mengenali, mengklasifikasikan, dan melacak kendaraan secara otonom. Dengan menggabungkan modul kamera mikro **ESP32-CAM**, model visi komputer **YOLOv8**, dan peta spasial interaktif, VPDS mampu menyajikan data lalu lintas secara real-time dan akurat.

---

## 1. Arsitektur Dual-Core VPDS

VPDS dirancang dengan memisahkan fungsi komputasi visi komputer yang berat dari dasbor manajemen data ringan. Sistem ini dibagi menjadi dua repositori utama:

1.  **`VPDS-Python-AI-CAM` (Pusat Inteligensia Visi)**:
    Backend berbasis **Python Flask** yang bertanggung jawab memproses aliran video (*video stream*) dari kamera pemantau, menjalankan algoritma deteksi objek berbasis GPU, dan mengelola integrasi peta wilayah.
2.  **`VPDS-Vehicle-Parking-Detection-System` (Dasbor Logika & Data)**:
    Antarmuka dasbor monitoring berbasis **PHP & Tailwind CSS** yang menerima telemetri parkir, menghitung durasi, dan memvisualisasikan data statistik dalam bentuk grafik interaktif untuk admin.

```
+----------------+       (Video Stream)       +-------------------+
|   ESP32-CAM    |--------------------------->|  Python Flask /   |
| (Edge Camera)  |                            |  YOLOv8 Engine    |
+----------------+                            +-------------------+
        |                                               |
        | (HTTP POST Telemetry)                         | (Database Sync)
        v                                               v
+------------------+     (Query API)          +-------------------+
| PHP Web Server & |<-------------------------|   MySQL/MariaDB   |
| Dashboard UI     |                          |   Database        |
+------------------+                          +-------------------+
```

---

## 2. Agen Visi Komputer YOLOv8 & OpenCV

Komponen utama yang mengubah kamera pasif menjadi agen pintar terletak pada modul **`VPDS-Python-AI-CAM`**. Menggunakan model deteksi objek mutakhir **YOLOv8 (You Only Look Once v8)** dari Ultralytics, agen visi ini mampu mendeteksi kendaraan dalam waktu milidetik:

-   **Klasifikasi Kendaraan**: Sistem mendeteksi dan mengklasifikasikan objek ke dalam kategori spesifik: *Mobil (Car)*, *Motor (Motorcycle)*, *Bus*, dan *Truk*.
-   **Penghitungan Lalu Lintas (*Traffic Counting*)**: Dengan menggambar garis batas virtual pada layar video (*virtual line crossing*), agen AI dapat melacak pergerakan objek menggunakan OpenCV dan menghitung jumlah kendaraan yang melintas secara real-time.
-   **Koneksi Stabil & Efisien**: Menyadari bahwa kamera IP nirkabel (seperti ESP32-CAM) rentan terhadap gangguan sinyal, sistem dilengkapi fitur *Auto-Reconnect* dan mode *Single-View Dashboard* untuk menjaga kestabilan *frame rate* serta mengurangi beban utilisasi memori CPU/GPU.

---

## 3. Logika Deteksi Parkir di Sisi Kamera (Edge Computing)

Selain analisis video terpusat di server menggunakan YOLOv8, sistem ini juga mendukung skenario komputasi tepi (*edge computing*) langsung pada mikrokontroler **ESP32-CAM** melalui firmware khusus:

*   **Deteksi Gerakan Lokal (*Local Motion Detection*)**: ESP32-CAM membandingkan perbedaan matriks piksel antar frame video secara berurutan untuk mendeteksi adanya pergerakan tanpa perlu mengirim data video mentah ke server.
*   **Klasifikasi Berdasarkan Intensitas Gerak**: Kendaraan diklasifikasikan secara sederhana berdasarkan ukuran perubahan piksel (objek besar seperti mobil memicu perubahan piksel >15.000, sementara motor memicu perubahan >5.000).
*   **Logika Ambang Waktu Parkir**: Untuk mencegah kesalahan pencatatan kendaraan yang hanya melintas sekilas, sistem menerapkan *parking threshold* selama **5 menit (300.000 ms)**. Kendaraan hanya akan tercatat sebagai "parkir" jika terdeteksi berhenti diam di slot parkir melebihi durasi tersebut.

---

## 4. Antarmuka Spasial & Dasbor Interaktif

Data lalu lintas dan status ketersediaan parkir tidak akan berguna jika tidak disajikan secara informatif. Dasbor VPDS mengintegrasikan antarmuka visual kelas premium:

*   **Peta Ruas Jalan Interaktif (LeafletJS & KML)**: Mengintegrasikan visualisasi peta wilayah Kabupaten Banjarnegara. Lokasi kamera pemantau dipetakan secara geografis, lengkap dengan status kepadatan lalu lintas pada ruas jalan tersebut yang dihitung langsung oleh agen YOLOv8.
*   **Dasbor Real-Time Tailwind CSS**: Data grafik statistik di dasbor diperbarui secara dinamis setiap 30 detik untuk memberikan informasi total kendaraan aktif, durasi rata-rata parkir, serta grafik distribusi jenis kendaraan.

---

## Kesimpulan

Sistem **VPDS** menunjukkan bagaimana integrasi AI visi komputer, mikrokontroler murah, dan arsitektur server yang tepat dapat melahirkan solusi kota cerdas (*smart city*) yang andal. Dengan meletakkan agen visi YOLOv8 untuk mengenali objek secara cerdas di sisi server, dipadukan dengan deteksi gerak taktis ESP32-CAM di sisi lapangan, VPDS menyajikan pengawasan lalu lintas dan ruang parkir secara otonom, presisi, serta efisien.
