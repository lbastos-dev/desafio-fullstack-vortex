const CACHE_NAME = 'vortex-marketplace-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/App.css',
  '/manifest.json'
];

// Instalação do Service Worker e armazenamento dos arquivos estáticos essenciais
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 🔥 Força o SW novo a se tornar ativo imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Arquivos essenciais indexados no cache com sucesso.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estratégia de Cache: Network First (Tenta a rede primeiro para dados atualizados, cai no cache se offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});