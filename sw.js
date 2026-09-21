/* Service worker: mette in cache tutta la mostra, così la app
   funziona anche dove in chiesa il segnale è debole.
   Quando si modificano opere o testi, aumentare il numero di VERSIONE. */
const VERSIONE = 'tondogiro-v3';
const FILE = [
  './',
  'index.html',
  'css/style.css',
  'fonts/caveat-brush-latin-400-normal.woff2',
  'fonts/jost-latin-400-normal.woff2',
  'fonts/jost-latin-500-normal.woff2',
  'fonts/jost-latin-600-normal.woff2',
  'img/icone/apple-touch-icon.png',
  'img/icone/favicon-32.png',
  'img/icone/favicon.svg',
  'img/icone/icona-192.png',
  'img/icone/icona.svg',
  'img/icone/icona-512.png',
  'img/icone/icona-maskable-512.png',
  'img/opere/cortile-dei-cerchi.jpg',
  'img/opere/girotondo-carminio.jpg',
  'img/opere/girotondo-giallo.jpg',
  'img/opere/girotondo-ocra.jpg',
  'img/opere/girotondo-ombre-lunghe.jpg',
  'img/opere/girotondo-verde.jpg',
  'img/opere/mini/cortile-dei-cerchi.jpg',
  'img/opere/mini/girotondo-carminio.jpg',
  'img/opere/mini/girotondo-giallo.jpg',
  'img/opere/mini/girotondo-ocra.jpg',
  'img/opere/mini/girotondo-ombre-lunghe.jpg',
  'img/opere/mini/girotondo-verde.jpg',
  'img/opere/mini/quattro-cerchi-grigio.jpg',
  'img/opere/mini/uomo-in-camicia.jpg',
  'img/opere/mini/uomo-in-giacca.jpg',
  'img/opere/quattro-cerchi-grigio.jpg',
  'img/opere/uomo-in-camicia.jpg',
  'img/opere/uomo-in-giacca.jpg',
  'js/app.js',
  'js/opere.js',
  'manifest.webmanifest'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Pagina HTML: prima la rete (così le modifiche arrivano subito), la cache solo se manca il segnale
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => {
      const copia = res.clone(); caches.open(VERSIONE).then(c => c.put('index.html', copia)); return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  // Immagini, caratteri, stili, script: prima la cache
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request).then(res => {
    const copia = res.clone();
    if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(VERSIONE).then(c => c.put(e.request, copia));
    return res;
  })));
});
