---
title: "Go-LoRa EWS Dashboard: Sistem Peringatan Dini Bencana Berbasis IoT & GIS"
description: "Membahas arsitektur Go-LoRa EWS Dashboard yang menggabungkan backend berkinerja tinggi dari Go, visualisasi peta Leaflet JS, dan integrasi sensor LoRa untuk monitoring bencana."
date: "2026-05-29"
category: "Embedded & IoT"
author: "Ahmad Pratama"
authorRole: "IoT & GIS Developer"
readingTime: "6 min read"
featured: false
number: "5.4"
coverImage: "/images/blog-lora-ews-cover.png"
---

Kondisi topografi wilayah seperti Kabupaten Banjarnegara yang dikelilingi oleh pegunungan curam menjadikannya sangat rawan terhadap bencana alam, khususnya tanah longsor dan banjir bandang. Dalam upaya meminimalisasi korban jiwa dan kerugian materi, keberadaan sistem mitigasi bencana yang cepat dan akurat menjadi hal yang mutlak. Di sinilah **Early Warning System (EWS)** atau Sistem Peringatan Dini memainkan peran krusial.

Proyek **Go-LoRa EWS Dashboard** dirancang khusus untuk mengatasi tantangan tersebut. Dengan menggabungkan performa *backend* tangguh dari bahasa pemrograman **Go (Golang)**, visualisasi peta berbasis **Geographic Information System (GIS)** menggunakan **Leaflet JS**, serta transmisi data nirkabel jarak jauh berbasis **LoRa (Long Range)**, platform ini mampu memantau aktivitas sensor secara *real-time* bahkan dari area terpencil.

---

## 1. Arsitektur Backend Go: Konkurensi Tinggi & REST API Telemetri

Data sensor bencana alam dikirimkan oleh pulsa-pulsa mikrokontroler di lapangan secara terus-menerus (*continuous telemetry streaming*). Backend sistem harus mampu menerima ratusan *request* data secara simultan dari berbagai titik sensor tanpa mengalami *bottleneck*. 

Bahasa pemrograman **Go** dipilih sebagai fondasi backend karena beberapa alasan utama:
-   **Konkurensi Ringan (Goroutines)**: Go menggunakan *goroutines* yang hanya memakan memori sekitar 2 KB per utas, memungkinkan server menangani ribuan koneksi paralel dari perangkat ESP32/ESP8266 dengan beban CPU minimal.
-   **REST API Performa Tinggi**: Menyediakan *endpoint* API yang dioptimalkan untuk memproses muatan data (*JSON payload*) berisi parameter ketinggian air (Water Level), getaran tanah (Vibration), dan kemiringan lereng (Tilt).
-   **Kompilasi Kode Native**: Aplikasi dikompilasi menjadi satu berkas biner mandiri yang sangat cepat dijalankan tanpa memerlukan *runtime environment* eksternal seperti Node.js atau Python.

```go
// Ilustrasi struktur REST API penerima data telemetri di Go
type TelemetryData struct {
    DeviceID  string    `json:"device_id"`
    WaterLevel float64  `json:"water_level"`
    Vibration  float64  `json:"vibration"`
    TiltAngle  float64  `json:"tilt_angle"`
    Timestamp  time.Time `json:"timestamp"`
}

func handleTelemetry(w http.ResponseWriter, r *http.Request) {
    var data TelemetryData
    if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    // Proses penyimpanan data dan broadcast ke dashboard
    saveToDB(data)
    w.WriteHeader(http.StatusAccepted)
}
```

---

## 2. Frontend GIS Reaktif: Pemetaan Sensor Interaktif dengan Leaflet JS

Kecepatan respons petugas penanggulangan bencana sangat bergantung pada kemudahan memahami informasi di lapangan. Oleh karena itu, bagian frontend dirancang sederhana menggunakan **Vanilla JS** dan pustaka pemetaan **Leaflet JS** untuk menyajikan data berbasis spasial:

-   **Context-Aware Icons (Penanda Cerdas)**: Simbol penanda lokasi (*markers*) di peta didesain dinamis. Ikon akan berubah secara visual berdasarkan jenis sensor yang terpasang (ikon gelombang air untuk sensor banjir, atau ikon grafik retakan untuk sensor tanah longsor).
-   **Logika Ambang Batas (Threshold Logic)**: Warna indikator penanda berubah secara langsung mengikuti parameter tingkat bahaya:
    -   **Hijau (Safe)**: Kondisi lingkungan normal dan stabil.
    -   **Kuning (Warning)**: Sensor mendeteksi peningkatan getaran atau kenaikan debit air di atas batas normal.
    -   **Merah (Critical)**: Nilai sensor melewati ambang kritis, menandakan potensi longsor atau luapan air bandang akan segera terjadi.
-   **Admin Panel Integrasi**: Mempermudah registrasi sensor baru di lapangan dengan menentukan koordinat lintang (*latitude*) dan bujur (*longitude*) langsung melalui klik peta interaktif.

---

## 3. Integrasi Protokol LoRa: Solusi Daerah Minim Sinyal

Tantangan terbesar dalam instalasi sensor mitigasi bencana di daerah pegunungan Banjarnegara adalah keterbatasan infrastruktur telekomunikasi seluler (blank spot). Sensor yang terpasang di lereng bukit curam atau hulu sungai sering kali tidak mendapatkan sinyal internet 4G/LTE.

Go-LoRa EWS mengatasi hambatan transmisi ini dengan mengadopsi modul komunikasi **LoRa**:

>
> **Mengapa Menggunakan LoRa?**
> LoRa merupakan teknologi komunikasi radio nirkabel berdaya rendah (*Low Power Wide Area Network*) yang mampu mengirimkan paket data kecil hingga radius belasan kilometer di medan terbuka. Node sensor (berbasis ESP32 + LoRa Transceiver) di area blank spot cukup mengirimkan data telemetri ke stasiun **LoRa Gateway** terdekat yang memiliki akses internet, yang kemudian meneruskannya ke REST API backend Go.

---

## 4. Alur Kerja Deteksi dan Notifikasi

Sistem Peringatan Dini ini bekerja secara end-to-end melalui tahapan berikut:

<div class="my-8 p-6 rounded-2xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm flex flex-col items-center hover:border-neutral-800 transition-colors duration-500 relative overflow-hidden group">
  <div class="px-4 py-2 rounded-full border border-neutral-850 bg-neutral-900 text-xs font-mono font-bold text-white tracking-widest uppercase mb-6">
    ALUR TRANSMISI TELEMETRI EWS
  </div>
  
  <div class="w-full max-w-2xl space-y-6">
    <!-- Top Flow Row: Sensor -> Gateway -> Backend -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
      <!-- Sensor Node -->
      <div class="w-full md:w-[28%] p-3 rounded-lg border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
        <span class="text-[8px] font-mono text-neutral-500">NODE LAPANGAN</span>
        <h4 class="text-xs font-bold text-white">Sensor Node</h4>
        <span class="text-[9px] text-neutral-400">Water / Vibration / Tilt</span>
      </div>

      <!-- Arrow 1 -->
      <div class="flex flex-col items-center text-neutral-600">
        <span class="text-[8px] font-mono text-neutral-500">LoRa RF (Jarak Jauh)</span>
        <span class="text-base md:rotate-0 rotate-90">➔</span>
      </div>

      <!-- LoRa Gateway -->
      <div class="w-full md:w-[28%] p-3 rounded-lg border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
        <span class="text-[8px] font-mono text-neutral-500">GATEWAY</span>
        <h4 class="text-xs font-bold text-white">LoRa Gateway</h4>
        <span class="text-[9px] text-neutral-400">Penerima Sinyal Radio</span>
      </div>

      <!-- Arrow 2 -->
      <div class="flex flex-col items-center text-neutral-600">
        <span class="text-[8px] font-mono text-neutral-500">Wi-Fi/4G API</span>
        <span class="text-base md:rotate-0 rotate-90">➔</span>
      </div>

      <!-- Go Backend -->
      <div class="w-full md:w-[28%] p-3 rounded-lg border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
        <span class="text-[8px] font-mono text-neutral-500">PEMROSES DATA</span>
        <h4 class="text-xs font-bold text-white">Go Backend</h4>
        <span class="text-[9px] text-neutral-400">Ingestion API & Threshold</span>
      </div>
    </div>

    <!-- Vertical separator to targets -->
    <div class="flex flex-col items-center text-neutral-600">
      <span class="text-lg">↓</span>
      <span class="text-[8px] font-mono text-neutral-500">Broadcast</span>
    </div>

    <!-- Bottom Row: GIS and Alerts -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <!-- GIS Dashboard -->
      <div class="p-3 rounded-lg border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
        <span class="text-[8px] font-mono text-neutral-500">DASBOR UTAMA</span>
        <h4 class="text-xs font-bold text-white">GIS Dashboard</h4>
        <span class="text-[9px] text-neutral-400">Peta Spasial Reaktif (Leaflet JS)</span>
      </div>

      <!-- Alert System -->
      <div class="p-3 rounded-lg border border-neutral-900 bg-neutral-950/80 flex flex-col items-center text-center space-y-1">
        <span class="text-[8px] font-mono text-neutral-500">NOTIFIKASI</span>
        <h4 class="text-xs font-bold text-white">Alert System</h4>
        <span class="text-[9px] text-neutral-400">Kirim Alarm & Peringatan Dini</span>
      </div>
    </div>
  </div>
</div>

1.  **Akuisisi Data**: Sensor mengukur getaran tanah (menggunakan akselerometer) dan ketinggian air (menggunakan ultrasonik/tekanan).
2.  **Transmisi LoRa**: Modul memancarkan data telemetri terkompresi secara periodik ke Gateway.
3.  **Ingestion & Analisis**: Server Go memproses data masuk, membandingkannya dengan matriks batas bahaya di database.
4.  **Visualisasi & Aksi**: Peta Leaflet pada dashboard langsung berkedip merah jika mendeteksi status *Critical*, memicu alarm peringatan dini untuk segera melakukan evakuasi warga di area sekitar sensor.

---

## Kesimpulan

Platform **Go-LoRa EWS Dashboard** mendemonstrasikan kolaborasi apik antara rekayasa perangkat lunak berkinerja tinggi dan sistem tertanam (*embedded system*). Dengan memanfaatkan efisiensi pemrosesan konkurensi Go di sisi server, visualisasi peta spasial interaktif menggunakan Leaflet JS di sisi klien, serta kehandalan transmisi nirkabel jarak jauh LoRa, sistem ini berhasil menghadirkan solusi mitigasi bencana alam yang andal, hemat energi, dan siap diimplementasikan di wilayah pelosok sekalipun.
