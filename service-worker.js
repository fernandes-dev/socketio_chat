const staticCache = "Socket.io 25-08-2019"

//lista de arquivos que devem ser cacheados
const files = [
  './src/app/view/assets/css/bootstrap.min.css',
  './src/app/view/assets/css/chat.css',
  './src/app/view/assets/css/home.css',
  './src/app/view/assets/css/index.css',
  './src/app/view/assets/css/register_login.css',
  './src/app/view/assets/js/axios.min.js',
  './src/app/view/assets/js/bootstrap.min.js',
  './src/app/view/assets/js/index.js',
  './src/app/view/assets/js/jquery.min.js',
  './src/app/view/assets/js/socketio.min.js',
  './src/app/view/assets/js/userSocket.js',
  './src/app/view/assets/img/node.png',
]

// Faz cache dos arquivos ao instalar 
this.addEventListener("install", event => {
  this.skipWaiting()

  event.waitUntil(
    caches.open(staticCache)
      .then(cache => {
        return cache.addAll(files)
      })
  )
})

// Limpa o cache antigo 
this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('meu-site-')))
          .filter(cacheName => (cacheName !== staticCache))
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})

// Reponde o request direto do cache
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o cache
        if (response) {
          return response;
        }
        // Faz a requisição  
        return fetch(event.request);
      })
      .catch(() => {
        // Mostra uma página de offline
        return caches.match('');
      })
  )
});