self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cache-v1')
      .then(cache => cache.addAll(['/']))
  )
})

self.addEventListener('fetch', event => {
  const {request} = event

  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  )
})
