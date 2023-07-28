
'nilayil/index.html', // Add any other HTML pages you want to cache
  'nilayil/logo.png', // Add any image files you want to cache
  'nilayil/bg1.jpg'


// Define the cache names for different types of resources
const cacheNames = {
    html: 'html-resources-cache-v1',
    remote: 'remote-resources-cache-v1',
  };
  
  // Define the files to cache
  const filesToCache = [
    '/',
    '/nilayil/index.html',
    '/nilayil/bg1.jpg',
    '/nilayil/logo.png',
    // Add more local resources to cache as needed
  ];
  
  // Install the Service Worker and cache the resources
  self.addEventListener('install', event => {
    event.waitUntil(
      Promise.all([
        caches.open(cacheNames.html).then(cache => cache.addAll(filesToCache)),
      ])
    );
  });
  
  // Activate the Service Worker and clean up old caches
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (!Object.values(cacheNames).includes(cache)) {
              return caches.delete(cache);
            }
          })
        );
      })
    );
  });
  
  // Intercept fetch requests and serve cached resources if available
  self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
  
    // Serve cached local resources
    if (requestUrl.origin === location.origin) {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request);
          })
      );
    } else {
      // Cache and serve remote URLs
      event.respondWith(
        caches.open(cacheNames.remote)
          .then(cache => {
            return cache.match(event.request)
              .then(response => {
                return response || fetch(event.request)
                  .then(fetchResponse => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                  });
              });
          })
      );
    }
  });

  










