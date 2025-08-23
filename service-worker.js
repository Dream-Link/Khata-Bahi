const CACHE_NAME = 'khata-bahi-cache-v1';
const urlsToCache = [
  '/',
  'index.html'
  // अगर भविष्य में कोई CSS या JS फाइल जोड़ते हैं तो उसे यहाँ डालें
];

// सर्विस वर्कर को इनस्टॉल करें
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache खोला गया');
        return cache.addAll(urlsToCache);
      })
  );
});

// रिक्वेस्ट को कैश और रिटर्न करें
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // अगर कैश में है - तो वहां से दें
        if (response) {
          return response;
        }
        // नहीं तो नेटवर्क से लायें
        return fetch(event.request);
      }
    )
  );
});

// पुराने कैश को अपडेट करें
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});