# GMI HostelKu

GMI HostelKu ialah satu platform pengurusan asrama (Hostel Management System) berasaskan web yang direka khas untuk pelajar dan warden di German-Malaysian Institute (GMI). Sistem ini memfokuskan kepada antaramuka (UI) yang moden, pantas, dan mesra pengguna bagi memudahkan urusan asrama secara digital.

## 📌 Ciri-ciri Utama (Features)

### 🎓 Portal Pelajar (Student Portal)
- **Log Masuk & Pendaftaran:** Sistem pengesahan (login/register) selamat.
- **Permohonan Bilik (Room Application):** Pelajar boleh memohon asrama dan memilih bilik.
- **Laporan Kerosakan (Maintenance):** Borang untuk melaporkan kerosakan fasiliti.
- **Permohonan Keluar (Move-Out):** Sistem permohonan pindah keluar asrama yang bersistematik (menggunakan sistem *Wizard* 3 bahagian).
- **Profil Pelajar:** Pengurusan maklumat profil dan avatar.

### 👮 Portal Warden (Warden Portal)
- **Papan Pemuka (Dashboard):** Ringkasan statistik permohonan, aduan, dan status bilik.
- **Pengurusan Pelajar & Bilik:** Memantau rekod pelajar dan kapasiti setiap blok/bilik.
- **Kelulusan (Approvals):** Meluluskan atau menolak permohonan bilik dan pindah keluar pelajar.
- **Laporan Penyelenggaraan (Maintenance Logs):** Menguruskan dan memantau status aduan kerosakan dari pelajar.
- **Laporan (Reports):** Analitik bulanan dan penjanaan rekod operasi asrama.

## 🛠 Teknologi Yang Digunakan (Tech Stack)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+).
- **Backend / Cloud:** Firebase (Authentication, Firestore Database, Firebase Hosting).
- **Perpustakaan (Libraries):** 
  - *SweetAlert2* (Untuk notifikasi / popup yang cantik)
  - *Choices.js* (Untuk paparan dropdown yang moden)
  - *FontAwesome* (Untuk ikon antaramuka)

## 🚀 Status Projek & Konfigurasi (Deployment)
- **Hosting:** Di-*deploy* sepenuhnya menggunakan Firebase Hosting.
- **Domain:** Menggunakan *Custom Domain* (gmi-hostelku.my).
- **E-mel Automasi:** Dikonfigurasi supaya e-mel seperti 'Reset Password' dihantar menggunakan alamat rasmi (`support@gmi-hostelku.my`) untuk mengelakkan folder *Spam*.

---
*Dokumen ini adalah ringkasan teknikal (Technical Report) bagi projek Final Year Project (FYP).*
