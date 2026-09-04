# ZAKY — Interactive Developer Portfolio

Dark, editorial, cinematic single-page experience built with React + Vite +
Tailwind CSS. Sections snap only at their edges — scrolling inside a section
stays natural, and a short transition plays only when you actually move to
the next/previous section.

## 1. Cara menjalankan project

```bash
npm install
npm run dev
```

Buka URL yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk build produksi:

```bash
npm run build
npm run preview
```

> Catatan: environment tempat proyek ini dibuat tidak punya akses internet,
> jadi `npm install` belum pernah dijalankan di sini. Jalankan perintah di
> atas di komputer Anda sendiri sebelum memakainya.

## 2. Cara mengganti profile photo

1. Taruh foto Anda di `src/assets/profile/` (misalnya `zaky.jpg`).
2. Buka `src/sections/Home.jsx`.
3. Uncomment baris `import profilePhoto from '../assets/profile/zaky.jpg'` di bagian atas file.
4. Ganti blok `<span>` placeholder di dalam kotak foto dengan:
   ```jsx
   <img src={profilePhoto} alt="Zaky" className="w-full h-full object-cover" />
   ```

## 3. Cara menambah project

Edit `src/data/projects.js` dan tambahkan object baru ke array:

```js
{
  id: 'project-04',
  title: 'Nama Project',
  category: 'Web Development',
  year: '2026',
  description: { id: 'Deskripsi bahasa Indonesia', en: 'English description' },
  technologies: ['React', 'Tailwind'],
  image: '/projects/project-04.webp',
  url: 'https://your-real-url.com',
}
```

Component `Projects.jsx` tidak perlu diubah sama sekali.

## 4. Cara mengganti project URL

Cukup ubah nilai `url` pada project terkait di `src/data/projects.js`. Tombol
"VIEW PROJECT" otomatis membuka URL tersebut di tab baru (`target="_blank"`,
`rel="noopener noreferrer"`).

## 5. Cara menambahkan achievement PDF

1. Taruh file PDF di `public/achievements/`.
2. Tambahkan entri di `src/data/achievements.js`:
   ```js
   { id: 'achievement-03', title: '...', year: '2026', description: {...}, type: 'pdf', file: '/achievements/nama-file.pdf' }
   ```
3. PDF dibuka langsung oleh browser di tab baru, tanpa dikonversi ke gambar.

## 6. Cara menambahkan achievement image

Sama seperti PDF, tapi gunakan `type: 'image'` dan `image: '/achievements/nama-file.jpg'`.
File taruh di `public/achievements/`. Klik pada item akan membuka image viewer
fullscreen dengan tombol close.

## 7. Cara mengganti gallery

Edit `src/data/gallery.js`. Setiap item punya `image`, `size` (`large` /
`medium` / `small` untuk mengatur ukuran di layout masonry), dan `caption`.
Taruh file gambar di `public/gallery/`.

## 8. Cara mengatur Spotify

Spotify **tidak menampilkan data palsu**. Selama belum dihubungkan, UI akan
menampilkan status "NOT CONNECTED" / "BELUM TERHUBUNG".

Untuk menghubungkan:
1. Buat backend/serverless function kecil yang menyimpan `client secret` dan
   `refresh token` Spotify (JANGAN taruh secret di frontend).
2. Endpoint tersebut memanggil Spotify Web API dan mengembalikan JSON dengan
   bentuk: `{ nowPlaying, topArtists, topTracks, listeningTimeHours }`.
3. Set `VITE_SPOTIFY_API_ENDPOINT` di file `.env` (contoh ada di `.env.example`)
   agar mengarah ke endpoint tersebut.
4. `src/services/spotify.js` akan otomatis memanggilnya — tidak perlu ubah UI.

## 9. Cara mengatur coding stats

Saat ini `src/services/codingStats.js` membaca dari `src/data/stats.json`
(ditandai jelas sebagai placeholder di UI). Untuk data asli:

1. Ganti isi fungsi `getCodingStats()` di `src/services/codingStats.js` agar
   memanggil API sungguhan (misalnya WakaTime, atau GitHub GraphQL untuk
   commit count).
2. Pastikan bentuk data yang dikembalikan tetap sama:
   `{ totalTimeHours, commits, linesWritten, languages: [{name, percent}] }`.
3. Component `Stats.jsx` tidak perlu diubah.

## 10. Cara mengganti music

1. Taruh file `.mp3` di `public/music/` (default: `track-01.mp3` sampai `track-04.mp3`).
2. Atau ubah array `TRACKS` di `src/context/PlayerContext.jsx` untuk nama file
   dan judul yang berbeda.
3. Musik tidak autoplay (browser memblokirnya) — akan mulai setelah user
   menekan tombol play pertama kali, dan tetap berjalan saat berpindah section.

## Struktur navigasi/scroll

Scroll di dalam satu section berjalan natural. Saat mencapai ujung atas/bawah
section dan Anda scroll sekali lagi (atau swipe di mobile), terjadi transisi
singkat (~850ms) ke section berikutnya/sebelumnya, dengan cooldown yang sama
untuk mencegah lompat beberapa section sekaligus. Logic ini ada di
`src/hooks/useSectionScroll.js` dan berlaku sama di desktop maupun mobile
(custom cursor saja yang dimatikan di mobile).

## Loading screen antar-section

Setiap kali pindah section (lewat scroll, navbar, atau tombol panah/PageUp
PageDown), `src/components/LoadingScreen.jsx` menampilkan tirai singkat berisi
nomor halaman (mis. `02 / 07`), judul tujuan ("ENTERING ABOUT"), progress
persentase (00% → 100%), dan status singkat yang berganti di tengah transisi.
Semua teks status ada di `src/data/translations.js` → `loadingScreen`.

## Sistem reveal animation

* `src/hooks/useSectionReveal.js` — memberi setiap section sebuah `key` yang
  berubah setiap kali section itu menjadi aktif, sehingga heading (`reveal-line`),
  paragraf/metadata (`reveal-up`), dan foto (`reveal-image-el`) di
  `src/index.css` selalu replay animasinya setiap kali dimasuki.
* `src/hooks/useInView.js` + `src/components/Reveal.jsx` /
  `RevealImage.jsx` — dipakai untuk item berulang (baris project, kartu
  achievement, foto gallery) supaya muncul satu per satu saat discroll ke
  posisinya, bukan sekaligus saat section dibuka.
* Semua animasi hanya memakai `transform`, `opacity`, dan `clip-path` (tidak
  ada layout thrashing), dan otomatis dinonaktifkan ketika
  `prefers-reduced-motion: reduce` aktif di OS/browser user.

## Dark / Light theme

Tombol theme ada di navbar (`☼ LIGHT` / `☾ DARK`). Semua warna di seluruh
website berasal dari CSS variable di `src/index.css` (`:root` untuk dark,
`[data-theme="light"]` untuk light) yang lalu dipakai oleh
`tailwind.config.js` — jadi tidak perlu mengubah component manapun untuk
menambah/mengubah warna theme. Pilihan theme disimpan di `localStorage`
(`zaky-theme`) dan langsung diterapkan sebelum React mount (lewat inline
script di `index.html`) supaya tidak ada flash warna yang salah saat reload.

## Teknologi

React 18, Vite, Tailwind CSS. GSAP sudah ada di `package.json` sebagai
dependency siap pakai bila Anda ingin menambah animasi lanjutan — saat ini
transisi utama sudah dicover dengan CSS transform/opacity agar tetap ringan.
