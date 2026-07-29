# Rancangan Bisnis Komponen UI Medis

> Catatan ide produk untuk membangun kumpulan komponen UI medis yang reusable, dimulai dari odontogram.

## 1. Ide Utama

Membuat **Medical UI Component Library** untuk developer rumah sakit, klinik, vendor EMR, dan aplikasi kesehatan. Produknya bukan aplikasi EMR lengkap, tetapi komponen klinis siap integrasi yang biasanya sulit dibuat dari nol.

Contoh komponen:

- Odontogram interaktif.
- Body map untuk lokasi luka atau nyeri.
- Grafik pertumbuhan anak.
- Partograf.
- Skala nyeri visual.
- Pemeriksaan mata dan telinga.
- Timeline pemberian obat.
- Input tanda vital dan skor peringatan dini.
- Signature pad serta preview dokumen klinis.

Nilai jual utamanya: developer mendapatkan komponen yang sudah nyaman dipakai, memiliki struktur data jelas, mudah dikonfigurasi, dan tidak terkunci ke satu backend atau satu rumah sakit.

## 2. Apakah Bentuk dan Aturan Gigi Akan Sama Semua?

**Core-nya bisa sama, tetapi implementasi akhirnya tidak akan selalu 100% sama.**

Bagian yang relatif universal:

- Susunan gigi dewasa dan gigi sulung.
- Jenis gigi: insisivus, kaninus, premolar, dan molar.
- Permukaan gigi: oklusal/incisal, mesial, distal, bukal/labial, dan lingual/palatal.
- Pemilihan satu gigi atau beberapa gigi.
- Kondisi umum seperti karies, tumpatan, hilang, belum erupsi, sisa akar, dan goyah.
- Mode input dan mode hanya-baca.

Bagian yang dapat berbeda:

- Sistem penomoran: FDI, Universal, atau Palmer.
- Warna, simbol, dan singkatan klinis.
- Daftar status yang digunakan rumah sakit.
- Apakah kondisi dicatat untuk seluruh gigi atau per permukaan.
- Alur persetujuan, koreksi, dan riwayat perubahan.
- Istilah bahasa serta format laporan/PDF.
- Integrasi diagnosis, tindakan, billing, dan rekam medis.
- Kebijakan lokal dan kebiasaan dokter gigi.

Karena itu, jangan membuat satu gambar gigi yang penuh aturan hard-coded. Buat **mesin odontogram yang sama**, lalu berikan konfigurasi untuk menyesuaikan aturan tiap pengguna.

## 3. Alur Bisnis Pembuatan Komponen

```text
Masalah klinis
    ↓
Observasi workflow dokter/perawat
    ↓
Definisi data dan istilah klinis
    ↓
Desain komponen headless
    ↓
Renderer visual + interaksi
    ↓
Konfigurasi organisasi
    ↓
Validasi tenaga medis
    ↓
Integrasi dan uji developer
    ↓
Rilis, dokumentasi, dan versioning
    ↓
Feedback penggunaan nyata
```

### Tahap 1 — Temukan masalah klinis

Jangan mulai dari gambar. Mulai dari pertanyaan:

- Siapa yang mengisi?
- Kapan data diisi?
- Keputusan klinis apa yang dibantu komponen?
- Data apa yang harus tersimpan?
- Siapa yang boleh mengubahnya setelah disahkan?
- Bagaimana tampilannya saat dicetak atau dibaca kembali?

Output: problem statement dan daftar pengguna.

### Tahap 2 — Petakan workflow nyata

Amati alur dokter dari membuka pasien sampai menyimpan assessment. Identifikasi keadaan penting:

- Belum diisi.
- Sedang dikerjakan.
- Ada perubahan yang belum disimpan.
- Sudah disimpan.
- Sudah ditandatangani.
- Dikoreksi atau dibuatkan addendum.
- Hanya dapat dibaca karena episode sudah ditutup.

Output: user flow, state diagram, dan aturan akses.

### Tahap 3 — Tentukan clinical data contract

Data harus dapat dipakai tanpa bergantung pada bentuk visual. Untuk odontogram, contoh sederhananya:

```ts
type ToothNumberingSystem = 'FDI' | 'UNIVERSAL' | 'PALMER';

type ToothSurface =
  | 'OCCLUSAL_INCISAL'
  | 'MESIAL'
  | 'DISTAL'
  | 'BUCCAL_LABIAL'
  | 'LINGUAL_PALATAL';

type ToothFinding = {
  id: string;
  tooth: string;
  surface?: ToothSurface;
  conditionCode: string;
  note?: string;
  recordedAt?: string;
  recordedBy?: string;
};

type OdontogramValue = {
  numberingSystem: ToothNumberingSystem;
  dentition: 'PRIMARY' | 'PERMANENT' | 'MIXED';
  findings: ToothFinding[];
};
```

Kondisi sebaiknya memakai `conditionCode`, bukan hanya warna. Warna adalah tampilan; code adalah data klinis.

Output: schema TypeScript, JSON example, validation rules, dan migration policy.

### Tahap 4 — Pisahkan domain, visual, dan integrasi

Arsitektur yang disarankan:

```text
Domain Core
├── model dan validation
├── aturan penomoran
└── transform/serializer

UI Renderer
├── SVG bentuk gigi
├── interaksi per permukaan
├── status/legend
└── mode edit/read-only/print

Organization Profile
├── daftar kondisi
├── warna dan simbol
├── bahasa
└── permission

Application Adapter
├── React Hook Form
├── REST/GraphQL mapper
├── audit trail
└── PDF/export
```

Dengan pemisahan ini, bentuk UI dapat berubah tanpa merusak data dan integrasi backend.

### Tahap 5 — Validasi klinis dan UX

Komponen belum dianggap selesai hanya karena tampilannya bagus. Minimal review dilakukan oleh:

- Tenaga medis yang benar-benar mengisi form.
- Developer yang akan melakukan integrasi.
- QA untuk keyboard, layar kecil, dan mode read-only.
- Tim keamanan/data untuk akses dan audit trail.

Skenario uji odontogram:

- Dokter dapat menemukan nomor gigi dengan cepat.
- Permukaan yang diklik tidak tertukar.
- Status tetap dapat dipahami tanpa mengandalkan warna saja.
- Gigi sulung dan permanen tidak tertukar.
- Perubahan belum tersimpan terlihat jelas.
- Hasil read-only dan PDF konsisten dengan data input.
- Riwayat koreksi tidak menghapus catatan sebelumnya secara diam-diam.

Output: clinical sign-off, UX test result, dan daftar risiko.

### Tahap 6 — Packaging dan dokumentasi developer

Calon susunan package:

```text
@medical-ui/core
@medical-ui/react
@medical-ui/odontogram
@medical-ui/tailwind-preset
@medical-ui/icons
```

API komponen idealnya tetap sederhana:

```tsx
<Odontogram
  value={value}
  onChange={setValue}
  numberingSystem="FDI"
  dentition="MIXED"
  conditions={hospitalConditions}
  readOnly={false}
/>
```

Dokumentasi wajib:

- Quick start.
- Daftar props dan events.
- Contoh value JSON.
- Controlled dan uncontrolled usage.
- Form integration.
- Theme customization.
- Accessibility.
- Mode print/PDF.
- Migration guide setiap breaking change.

## 4. Lapisan Produk Odontogram

### Level 1 — Basic

- Gambar anatomis per jenis gigi.
- Klik satu gigi untuk memberikan status.
- Gigi dewasa dan gigi sulung.
- Legend serta read-only mode.

Target: klinik kecil dan form assessment sederhana.

### Level 2 — Clinical

- Input kondisi per permukaan.
- Multiple findings dalam satu gigi.
- Catatan dan rencana tindakan.
- History serta audit trail event.
- Keyboard navigation dan accessibility.

Target: rumah sakit dan EMR yang membutuhkan pencatatan lebih rinci.

### Level 3 — Enterprise

- Custom terminology dan mapping code.
- Permission dan digital signature integration.
- PDF/print renderer.
- Multi-tenant configuration.
- Analytics event tanpa membawa data pasien.
- Long-term support dan migration tooling.

Target: vendor EMR dan jaringan rumah sakit.

## 5. Model Bisnis yang Mungkin

### Open-core

- Core odontogram dan renderer dasar: open-source.
- Advanced surfaces, audit trail, PDF, dan enterprise adapter: berbayar.

Kelebihan: mudah dikenal developer dan cepat memperoleh feedback.

### Commercial component license

- Biaya per aplikasi, developer seat, atau organisasi.
- Cocok jika dokumentasi dan support menjadi kekuatan utama.

### Hosted configuration platform

- Library tetap berjalan di aplikasi pengguna.
- Pengaturan kondisi, warna, bahasa, dan version profile dikelola dari dashboard.
- Jangan mengirim data pasien ke platform hanya untuk merender komponen.

### Implementation dan support

- Pendapatan dari integrasi, custom workflow, migration, training, dan SLA.
- Cocok untuk rumah sakit yang membutuhkan bantuan langsung.

Model awal yang paling realistis: **odontogram core open-source + paket enterprise dan jasa integrasi**.

## 6. Prinsip Produk

1. **Clinical data first.** Gambar adalah representasi dari data, bukan sumber kebenaran.
2. **Configurable, bukan hard-coded.** Setiap organisasi dapat memiliki konvensi berbeda.
3. **Backend agnostic.** Komponen menerima value dan menghasilkan event; pengguna memilih cara menyimpannya.
4. **Tidak bergantung pada warna.** Selalu sediakan simbol, pola, label, atau tooltip.
5. **Audit-friendly.** Perubahan penting harus dapat direpresentasikan sebagai event.
6. **Print is a first-class feature.** Komponen medis sering dibaca dalam PDF atau berkas cetak.
7. **No patient data by default.** Library tidak boleh melakukan telemetry yang membawa identitas atau data klinis.
8. **Versioning harus disiplin.** Perubahan schema data lebih berisiko daripada perubahan styling.
9. **Clinical review tetap wajib.** Library membantu implementasi, bukan menggantikan keputusan tenaga medis.

## 7. MVP yang Disarankan

Urutan pengerjaan paling masuk akal:

1. Bentuk SVG untuk insisivus, kaninus, premolar, dan molar.
2. Susunan FDI gigi dewasa dan gigi sulung.
3. Pemilihan status seluruh gigi.
4. Controlled component API (`value` dan `onChange`).
5. Legend yang configurable.
6. Edit, read-only, dan print mode.
7. Storybook/demo serta dokumentasi instalasi.
8. Unit test untuk numbering dan state transition.
9. Uji langsung bersama dokter gigi.
10. Baru lanjut ke pemilihan per permukaan dan audit history.

## 8. Definition of Done

Satu komponen medis siap dirilis apabila:

- Data contract terdokumentasi dan tervalidasi.
- Semua state UX penting tersedia.
- Dapat digunakan tanpa backend khusus.
- Dapat dioperasikan dengan mouse dan keyboard.
- Tampilan tidak bergantung pada warna saja.
- Edit, read-only, dan print mode konsisten.
- Memiliki unit test dan contoh integrasi.
- Sudah direview tenaga medis terkait.
- Breaking change dan migration path dijelaskan.
- Tidak mengirim atau menyimpan data pasien secara tersembunyi.

## 9. Kesimpulan

Odontogram bisa menjadi komponen pertama yang kuat karena masalahnya jelas, visual, dan reusable. Bentuk dasar giginya dapat digunakan bersama, tetapi sistem penomoran, status, simbol, workflow, serta integrasinya harus configurable.

Positioning sederhananya:

> **Komponen UI klinis siap integrasi untuk developer, dengan data contract yang jelas dan workflow yang dapat disesuaikan.**

