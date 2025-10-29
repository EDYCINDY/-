// Nama cache
const CACHE_NAME = 'Nootpad++';

// Daftar file yang akan di-cache (App Shell)
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './android-chrome-512x512.png',
    './android-chrome-192x192.png',
    './apple-touch-icon.png',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './favicon/ico'
    // Jika punya file CSS atau JS terpisah, tambahkan di sini
    // '/style.css',
    // '/app.js'
];

// 1. Event 'install': dijalankan saat service worker baru terdeteksi
self.addEventListener('install', event => {
    console.log('SW Install: Meng-cache App Shell');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL_URLS))
            .then(() => self.skipWaiting()) // Aktifkan SW baru segera setelah instalasi
    );
});

// 2. Event 'activate': dijalankan saat service worker baru aktif. Berguna untuk membersihkan cache lama.
self.addEventListener('activate', event => {
    console.log('SW Activate: Membersihkan cache lama');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// 3. Event 'fetch': Inti dari strategi caching. Dijalankan untuk setiap permintaan.
self.addEventListener('fetch', event => {
    // Gunakan strategi "Network First"
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Jika berhasil, simpan respons ke cache dan kembalikan ke browser
                console.log(`Fetch: Berhasil dari network untuk ${event.request.url}`);
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Jika network gagal (offline), coba cari di cache
                console.log(`Fetch: Gagal dari network, mencari di cache untuk ${event.request.url}`);
                return caches.match(event.request);
            })
    );
});

