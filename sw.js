const CACHE_NAME = 'dutgen-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/badMood.html',
  '/pixelThoughts.html',
  '/gambar.html',
  '/gambar.js',
  '/dutgen.css',
  '/dutgen.js',
  'https://cdn.tailwindcss.com',
  'https://code.iconify.design/3/3.1.0/iconify.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});