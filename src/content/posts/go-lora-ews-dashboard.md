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

```
[ Sensor Node ] --(LoRa RF)--> [ LoRa Gateway ] --(Wi-Fi/4G API)--> [ Go Backend ]
                                                                          |
                                                                   +------+------+
                                                                   |             |
                                                                   v             v
                                                            [ GIS Dashboard ] [ Alert System ]
```

1.  **Akuisisi Data**: Sensor mengukur getaran tanah (menggunakan akselerometer) dan ketinggian air (menggunakan ultrasonik/tekanan).
2.  **Transmisi LoRa**: Modul memancarkan data telemetri terkompresi secara periodik ke Gateway.
3.  **Ingestion & Analisis**: Server Go memproses data masuk, membandingkannya dengan matriks batas bahaya di database.
4.  **Visualisasi & Aksi**: Peta Leaflet pada dashboard langsung berkedip merah jika mendeteksi status *Critical*, memicu alarm peringatan dini untuk segera melakukan evakuasi warga di area sekitar sensor.

---

## Kesimpulan

Platform **Go-LoRa EWS Dashboard** mendemonstrasikan kolaborasi apik antara rekayasa perangkat lunak berkinerja tinggi dan sistem tertanam (*embedded system*). Dengan memanfaatkan efisiensi pemrosesan konkurensi Go di sisi server, visualisasi peta spasial interaktif menggunakan Leaflet JS di sisi klien, serta kehandalan transmisi nirkabel jarak jauh LoRa, sistem ini berhasil menghadirkan solusi mitigasi bencana alam yang andal, hemat energi, dan siap diimplementasikan di wilayah pelosok sekalipun.
