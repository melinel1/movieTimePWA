'use strict';

const CACHE_NAME = 'MovieTime-Cache-v1';

const CACHE_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/detalle.html',
    '/historia.html',
    '/manifest.json',
    '/css/styles.css',
    '/js/db.js',
    '/js/index.js',
    '/js/historia.js',
    '/js/detalle.js',
    '/js/offline.js',
    '/img/icons/favicon.ico',
    '/img/deco-busqueda.png',
    '/img/fondo-main.jpg',
    '/img/logo-nav.png',
    '/img/poster-not-found.jpg',
    '/img/icons/android-icon-36x36.png',
    '/img/icons/android-icon-48x48.png',
    '/img/icons/android-icon-72x72.png',
    '/img/icons/android-icon-96x96.png',
    '/img/icons/android-icon-144x144.png',
    '/img/icons/android-icon-192x192.png',
    '/img/icons/apple-icon-57x57.png',
    '/img/icons/apple-icon-60x60.png',
    '/img/icons/apple-icon-72x72.png',
    '/img/icons/apple-icon-76x76.png',
    '/img/icons/apple-icon-144x144.png',
    '/img/icons/apple-icon-152x152.png',
    '/img/icons/apple-icon-180x180.png',
    '/img/icons/apple-icon-precomposed.png',
    '/img/icons/apple-icon.png',
    '/img/icons/browserconfig.xml',
    '/img/icons/favicon-16x16.png',
    '/img/icons/favicon-32x32.png',
    '/img/icons/favicon-96x96.png',
    '/img/icons/ms-icon-70x70.png',
    '/img/icons/ms-icon-144x144.png',
    '/img/icons/ms-icon-150x150.png',
    '/img/icons/ms-icon-310x310.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js',
];

//* Instalación del Service Worker
self.addEventListener('install', (e) => {
    
  const cache = caches.open( CACHE_NAME ).then( cache => {
      return cache.addAll( CACHE_FILES )
  } )

  e.waitUntil( cache );
})

self.addEventListener('fetch', event => {
  const respuesta = fetch(event.request).then(respuestaNetwork => {
      return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, respuestaNetwork.clone());
          return respuestaNetwork;
      });
  }).catch(error => {
      return caches.match(event.request).then(respCache => {
          return respCache || caches.match('/offline.html');
      });
  });

  event.respondWith(respuesta);
});

// Cuando se instala se activa
self.addEventListener('activate', (event)=>{
  console.log('SW: Activado');
})