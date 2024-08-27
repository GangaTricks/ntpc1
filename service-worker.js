// Define a cache name
const cacheName = 'ganga-cache-v2';

// List of files to cache
const filesToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/icon1.png',
  '/icon2.png',
  '/logo.png',
  '/banner1.png',
  '/about1.png',
  
  '/facts/biology/biology1.html',
  '/facts/biology/biology2.html',
  '/facts/biology/biology3.html',
  '/facts/biology/chemistry1.html',
  '/facts/biology/pythics1.html', // Ensure this path is correct
  
  '/facts/computer/computer1.html',
  '/facts/computer/computer2.html',

  '/facts/economics/economics1.html',
  '/facts/economics/economics2.html',

  '/facts/geography/geography1.html',
  '/facts/geography/geography2.html',

  '/facts/history/history1.html',
  '/facts/history/history2.html',

  '/facts/oneword/oneword1.html',
  '/facts/oneword/idiom1.html',
  '/facts/oneword/confusion1.html',
  '/facts/oneword/phrasalverb1.html',
  '/facts/oneword/phrasalverb2.html',
  '/facts/oneword/phrasalverb3.html',
  '/facts/oneword/sscvocab1.html',
  '/facts/oneword/vocabrisk1.html',

  '/facts/polity/polity1.html',
  '/facts/polity/polity2.html',
  '/facts/polity/polity3.html',

  '/facts/preposition/adjective1.html',
  '/facts/preposition/adverb1.html',
  '/facts/preposition/article1.html',
  '/facts/preposition/conditional1.html',
  '/facts/preposition/fixedpreposition5.html',
  '/facts/preposition/grammar1.html',
  '/facts/preposition/infinite1.html',
  '/facts/preposition/noun1.html',
  '/facts/preposition/preposition1.html',
  '/facts/preposition/preposition2.html',
  '/facts/preposition/preposition3.html',
  '/facts/preposition/preposition4.html',
  '/facts/preposition/pronoun1.html',
  '/facts/preposition/questiontag2.html',
  '/facts/preposition/sytax1.html',
  '/facts/preposition/tense1.html',
  '/facts/preposition/conjunction1.html',

  '/facts/pyq/cgl231.html',
  '/facts/pyq/delhiconstable23.html',
  '/facts/pyq/hub.html',
  '/facts/pyq/index.html',
  '/facts/pyq/mts21.html',
  '/facts/pyq/sscgd22.html',

  '/facts/speed/speed1.html',
  '/facts/speed/synomyn.html',
  '/facts/speed/spelling.html',
  '/facts/speed/oneword.html',
  '/facts/speed/improvement.html',
  '/facts/speed/idiom.html',
  '/facts/speed/error.html',
  '/facts/speed/antonym.html',

  '/facts/static/award1.html',
  '/facts/static/book1.html',
  '/facts/static/computer1.html',
  '/facts/static/cricket1.html',
  '/facts/static/dance1.html',
  '/facts/static/date1.html',
  '/facts/static/entertainment1.html',
  '/facts/static/events1.html',
  '/facts/static/famous1.html',
  '/facts/static/festival1.html',
  '/facts/static/founder1.html',
  '/facts/static/fullform1.html',
  '/facts/static/instrument1.html',
  '/facts/static/miscellaneous1.html',
  '/facts/static/organisation1.html',
  '/facts/static/painting1.html',
  '/facts/static/religious1.html',
  '/facts/static/scheme1.html',
  '/facts/static/song1.html',
  '/facts/static/sport1.html',
  '/facts/static/state1.html',
  '/facts/static/static1.html',
  '/facts/static/superlative1.html',
  '/facts/static/world1.html',

  '/facts/study/001.html',
  '/facts/study/awareness_001.html' // Make sure this path is correct and unique
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