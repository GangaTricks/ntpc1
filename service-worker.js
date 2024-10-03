// Define a cache name
const cacheName = 'ganga-cache-v2';

// List of files to cache
const filesToCache = [
  '/signin.html',
  '/signin.html' // Make sure this path is correct and unique
];

/// Install the service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Activate the service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== cacheName) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch from cache first, then network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Return the cached response if found
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        // Fetch from network
        return fetch(fetchRequest).then(
          function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response; // If response is invalid, just return it
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(function(error) {
          console.error('Fetching failed:', error);
          throw error;
        });
      })
  );
});