// Nama cache versi 1. Perbarui angka versi ini setiap kali Anda membuat perubahan pada daftar aset.
const CACHE_NAME = 'Notepad'; 

// Daftar semua aset yang harus di-cache agar aplikasi berfungsi penuh secara offline.
// Termasuk file lokal, semua CSS, dan semua library JS CDN.
const ASSETS_TO_CACHE = [
    './', // index.html (atau nama file HTML utama Anda)
    './manifest.json',
    './service-worker.js',
    './android-chrome-512x512.png',
    './android-chrome-192x192.png',
    './apple-touch-icon.png',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './favicon/ico',
    // Jika punya file CSS atau JS terpisah, tambahkan di sini
    // '/style.css',
    // '/app.js'
    
    // --- CSS Libraries ---
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material-darker.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/eclipse.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/idea.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/monokai.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/default.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/lint.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldgutter.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/dialog/dialog.min.css',

    // --- JS Libraries (Head) ---
    'https://html2canvas.hertzen.com/dist/html22canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/htmlhint/1.1.4/htmlhint.js',
    'https://cdnjs.cloudflare.com/ajax/libs/csslint/1.0.5/csslint.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jshint/2.13.6/jshint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify-html.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify-css.min.js',

    // --- CodeMirror JS Libraries (Bottom) ---
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/clike/clike.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/markdown/markdown.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/meta.min.js',
    
    // --- CodeMirror Addons ---
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/lint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/html-lint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/css-lint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/json-lint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/javascript-lint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/matchbrackets.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/selection/active-line.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldgutter.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/xml-fold.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/search/searchcursor.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/search/search.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/dialog/dialog.min.js'
];

// 1. EVENT INSTALL
self.addEventListener('install', (event) => {
    // Tunggu sampai semua aset di-cache
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Membuka dan meng-cache aset inti.');
                // Menggunakan .addAll() untuk mencoba meng-cache semua aset sekaligus
                return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                    console.error('[Service Worker] Gagal meng-cache beberapa aset (mungkin CDN):', err);
                    // Jika ada kegagalan, mencoba meng-cache satu per satu untuk memastikan aset lokal ter-cache
                    return Promise.all(ASSETS_TO_CACHE.map(url => {
                        return cache.add(url).catch(e => console.warn(`[Service Worker] Gagal meng-cache: ${url}`));
                    }));
                });
            })
            .then(() => self.skipWaiting()) // Aktifkan SW baru segera
    );
});

// 2. EVENT ACTIVATE
self.addEventListener('activate', (event) => {
    // Hapus cache lama
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Ambil kendali klien segera
    );
});

// 3. EVENT FETCH
self.addEventListener('fetch', (event) => {
    // Strategi Cache-First: Coba dari cache, jika tidak ada, ambil dari network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ditemukan di cache, kembalikan respons dari cache
                if (response) {
                    return response;
                }
                
                // Jika tidak ditemukan di cache, ambil dari network
                return fetch(event.request).then((fetchResponse) => {
                    // Cek jika kita menerima respons yang valid (status 200) dan bukan CORS/chrome-extension
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse; 
                    }
                    
                    // Klon respons agar kita bisa menyimpannya di cache dan mengembalikannya ke browser
                    const responseToCache = fetchResponse.clone();
                    
                    // Simpan aset baru (yang tidak ada di daftar awal) ke cache (misalnya Font Awesome Font Files)
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return fetchResponse;
                }).catch(error => {
                    // Jika network gagal (offline) dan tidak ada di cache, bisa memberikan fallback offline page
                    console.log('[Service Worker] Fetch gagal:', event.request.url, error);
                    // Untuk Dev Editor ini, asumsikan index.html adalah fallback page
                    if (event.request.mode === 'navigate') {
                        return caches.match('./'); // Kembalikan index.html dari cache jika navigasi gagal
                    }
                    return new Response(null, { status: 503, statusText: 'Service Unavailable' });
                });
            })
    );
});