---
title: "Otomasi Pertanian Desa Jenggawur: Integrasi Agen IoT & Drone"
description: "Membahas bagaimana Smart Farm Monitoring System menggabungkan sensor tanah real-time dengan armada drone otonom untuk merevolusi pertanian presisi di Banjarnegara."
date: "2026-05-29"
category: "Embedded & IoT"
author: "Ahmad Pratama"
authorRole: "AI & Physics Simulation Engineer"
readingTime: "7 min read"
featured: false
number: "5.2"
coverImage: "/images/blog-drone-farm-cover.png"
---

Sektor pertanian adalah tulang punggung perekonomian Indonesia, namun sebagian besar petani lokal masih bergantung pada metode tradisional yang rentan terhadap ketidakpastian iklim, degradasi hara tanah, dan keterbatasan tenaga kerja. Di **Desa Jenggawur, Kabupaten Banjarnegara, Jawa Tengah**, sebuah inisiatif teknologi pertanian presisi dikembangkan untuk menjawab tantangan tersebut.

Proyek **Smart Farm Monitoring System** hadir sebagai platform otomasi terintegrasi yang menggabungkan sensor tanah berbasis *Internet of Things* (IoT) dan armada pesawat tanpa awak otonom (*autonomous UAV/drones*). Menggunakan koordinat geografis nyata Desa Jenggawur (-7.392220°, 109.677500°), sistem ini mendemonstrasikan bagaimana kolaborasi agen fisik dan perangkat lunak dapat secara signifikan meningkatkan produktivitas serta efisiensi lahan.

---

## 1. Konsep Multi-Agent: Sensor IoT sebagai Indra, Drone sebagai Aktor

Dalam arsitektur kecerdasan buatan, sebuah sistem otonom membutuhkan masukan lingkungan (*sensory inputs*) sebelum dapat melakukan tindakan fisik (*actuation*). Pada Smart Farm Monitoring System, konsep ini diimplementasikan melalui pembagian peran agen secara jelas:

### Agen Sensor IoT (Indra Lapangan)
Tersebar di berbagai zona lahan (Padi Sawah, Jagung, dan Cabai Rawit), sensor-sensor ini secara konstan melacak 7 parameter vital tanah:
-   **Kelembaban Tanah (Soil Moisture)**: Menentukan kebutuhan air.
-   **Kandungan Nutrisi N-P-K (Nitrogen, Fosfor, Kalium)**: Melacak kesuburan hara makro.
-   **pH Tanah & Suhu/Kelembaban Udara**: Memantau kesehatan mikro-klimat tanaman.

Data dikirimkan secara berkala oleh mikrokontroler di lapangan (seperti ESP32) menggunakan enkapsulasi JSON ke server pusat.

```cpp
// Representasi pengiriman data telemetri dari Agen Sensor ke Server
DynamicJsonDocument doc(1024);
doc["zone_id"] = "zone-a-rice";
doc["sensor_type"] = "NPK";
doc["value_nitrogen"] = 45.2; // ppm
doc["value_phosphorus"] = 38.1;
doc["value_potassium"] = 48.7;
```

### Agen Drone Otonom (Aktor Udara)
Sistem ini mengelola tiga armada pesawat tanpa awak (*drone fleet*) dengan spesifikasi misi yang disesuaikan dengan kebutuhan zona tanaman:
1.  **Drone-Sawah-1 (Zona A - Padi Sawah)**: Mengemban misi penyiraman air presisi.
2.  **Drone-Jagung-2 (Zona B - Jagung)**: Mengemban misi penyebaran pupuk organik cair.
3.  **Drone-Cabai-3 (Zona C - Cabai Rawit)**: Ditugaskan melakukan penyemprotan pestisida organik terarah.

Setiap drone memiliki agen kontrol otonom yang memproses perintah terbang, memantau daya baterai, dan melacak koordinat target secara real-time.

---

## 2. Loop Otomasi: Bagaimana Sistem Mengambil Keputusan

Inti dari sistem berbasis agen adalah **Close-Loop Control** (Sistem Kontrol Loop Tertutup). Sistem tidak hanya menyajikan data grafis pasif, tetapi dapat mengambil tindakan korektif berdasarkan ambang batas (*thresholds*) yang telah ditentukan:

<div class="my-8 p-6 rounded-2xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm flex flex-col items-center hover:border-neutral-800 transition-colors duration-500 relative overflow-hidden group">
  <div class="px-4 py-2 rounded-full border border-neutral-850 bg-neutral-900 text-xs font-mono font-bold text-white tracking-widest uppercase mb-6">
    LOOP OTOMASI DEVISI PERTANIAN
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl items-center">
    <!-- Step 1: Sensor Lapangan -->
    <div class="p-4 rounded-xl border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
      <span class="text-[9px] font-mono text-neutral-500">TAHAP 1</span>
      <h4 class="text-xs font-bold text-white">Sensor Lapangan</h4>
      <p class="text-[10px] text-neutral-400">Deteksi kelembaban tanah & udara secara berkala</p>
    </div>

    <!-- Arrow 1 to Server -->
    <div class="flex flex-col items-center text-neutral-600 justify-center">
      <span class="text-[9px] font-mono text-neutral-500 mb-1">Kirim Telemetri</span>
      <span class="text-lg md:rotate-0 rotate-90">➔</span>
    </div>

    <!-- Step 2: FastAPI Server -->
    <div class="p-4 rounded-xl border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
      <span class="text-[9px] font-mono text-neutral-500">TAHAP 2</span>
      <h4 class="text-xs font-bold text-white">FastAPI Server</h4>
      <p class="text-[10px] text-neutral-400">Evaluasi data terhadap batas threshold kritis</p>
    </div>

    <!-- Arrow 2 to Action (vertical line connecting) -->
    <div class="md:col-span-3 flex justify-center text-neutral-600 py-1">
      <div class="flex flex-col items-center">
        <span class="text-[9px] font-mono text-neutral-500">Ambil Tindakan</span>
        <span class="text-lg">↓</span>
      </div>
    </div>

    <!-- Step 3: Armada Drone (Bottom row) -->
    <div class="md:col-start-2 p-4 rounded-xl border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
      <span class="text-[9px] font-mono text-neutral-500">TAHAP 3</span>
      <h4 class="text-xs font-bold text-white">Armada Drone</h4>
      <p class="text-[10px] text-neutral-400">Kirim koordinat GPS & terbang otonom untuk penyiraman</p>
    </div>
  </div>
</div>

Sebagai contoh, jika sensor kelembaban tanah di Zona C (Cabai Rawit) mendeteksi penurunan kelembaban di bawah **25%** (ambang batas kritis untuk cabai rawit), sistem secara otomatis memicu skenario berikut:
1.  **Evaluasi Status**: Server FastAPI mendeteksi anomali level merah (*Critical Alert*).
2.  **Pemicuan Irigasi**: Sistem mengaktifkan katup sirkuit irigasi pintar di zona terkait.
3.  **Misi Drone**: Jika area kering terlalu luas atau membutuhkan intervensi udara, sistem menugaskan **Drone-Cabai-3** untuk terbang ke titik koordinat GPS spesifik tempat sensor kering berada guna melakukan penyemprotan air presisi tinggi.

---

## 3. Dasbor Pemantauan: Peta Leaflet & Analisis Recharts

Untuk mempermudah operator perkebunan dalam memantau operasi multi-agen ini, frontend sistem menyediakan visualisasi premium berbasis web:

*   **Peta Interaktif (Leaflet.js)**: Menampilkan citra satelit Desa Jenggawur. Lokasi drone divisualisasikan dengan penanda (*markers*) dinamis yang berubah warna berdasarkan status (Hijau = Siap, Kuning = Sedang Misi, Merah = Baterai Lemah). Jalur penerbangan dari posko ke target ditampilkan menggunakan garis putus-putus (*dashed flight paths*) secara dinamis.
*   **Grafik Analitik 24 Jam (Recharts)**: Menyajikan grafik garis multivariabel untuk melacak tren perbaikan nutrisi N-P-K tanah setelah dilakukan pemupukan otonom oleh drone. Hal ini membantu operator memverifikasi apakah intervensi agen drone berhasil mengembalikan kesuburan tanah ke tingkat normal.

---

## 4. Keunggulan Arsitektur Sistem

Penerapan teknologi modern memastikan platform ini andal untuk penggunaan skala lapangan:
-   **FastAPI & Motor Driver**: Menjamin performa backend asinkronus yang sangat cepat saat menerima ribuan data telemetri simultan dari banyak sensor lapangan.
-   **MongoDB Storage**: Struktur data NoSQL yang fleksibel memudahkan penyimpanan catatan log sensor historis tanpa perlu membebani relasi database.
-   **Mobile-First Responsive Design**: Didesain responsif menggunakan Tailwind CSS agar aplikasi dapat diakses dengan nyaman oleh penyuluh pertanian langsung di tengah sawah menggunakan *smartphone* atau tablet.

---

## Kesimpulan

Smart Farm Monitoring System di Desa Jenggawur menunjukkan masa depan pertanian Indonesia yang cerdas dan efisien. Dengan meletakkan teknologi IoT sebagai indra penilai kondisi tanah, dan drone otonom sebagai agen pelaksana tindakan presisi, sistem ini meminimalkan pemborosan air, pupuk, dan pestisida. Kolaborasi teknologi kecerdasan buatan berbasis agen dan rekayasa perangkat keras ini adalah langkah nyata menuju ketahanan pangan yang berkelanjutan dan berbasis data.
