/////////////////////////////////////////////////////////////////////////////
// You can find dozens of practical, detailed, and working examples of 
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
/////////////////////////////////////////////////////////////////////////////

// Cache name

var dataCacheName='v1.0'; //file json
var cacheName='v1.0'; //statik image,css
var filesToCache=[
  'index.html',
  '/',
      'favicon.ico',
      'css\/*.css',
      'js\/*.js',
      'js\/*.gif',
      'js\/*.txt',
			'images\/*.jpg',
      'images\/**\/*.png',
      'images\/**\/*.svg'  /* subfolder,subfolder dlm images yg ada png*/
];


// self.addEventListener('installpwa', function (event) {
//     // Perform install step:  loading each required file into cache
//     event.waitUntil(
//       caches.open(cacheName)
//         .then(function (cache) {
//           // Add all offline dependencies to the cache
//           return cache.addAll(filesToCache);
//         })
//         .then(function () {
//           return self.skipWaiting();
//         })
//     );
//   });



  self.addEventListener('installpwa',function(e){
    console.log('[Service Worker] install');
    self.skipWaiting();
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[Service Worker] caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


// utk clear cache kalau ada data ,files yg berubah
self.addEventListener('activate',function(e){
  console.log('[Service Worker] Activate');
  e.waitUntil(
      caches.keys().then(function(keyList){
          return Promise.all(keyList.map(function(key){
              if(key !== cacheName  &&  key !== dataCacheName){
                  console.log('[Service Worker] Removing old cache ',key);
                  return caches.delete(key);
              }
          }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch',function(e){
  e.respondWith(
      caches.open(cacheName).then(function(cache){
          return cache.match(e.request).then(function(response){
              return response || fetch (e.request);
          })
      })       
  );
});


self.addEventListener('push', function(e) {
    const data = e.data.json();
    var options;
   // console.log(data);
  
    if (data.url) {
      options = {
        body : data.body,
        badge: "./assets/img/icon/notification_192.png",
        icon : "./assets/img/icon/192x192.png",
        
        data : {url: data.url},
        actions: [
          {
            action: 'web-action',
            title: 'Open web'
          }
        ]
      }
    }
    else {
      options = {
        body : data.body,
        badge: "./assets/img/icon/nnotification_192.png",
        icon : "./assets/img/icon/192x192.png",
        vibrate: [100, 50, 100]
      }
    }
  
    self.registration.showNotification(data.title, options);
  });
  
  self.addEventListener('pushsubscriptionchange', function(e) {
    console.info('Subscription expired');
  
  });
  
  
  
  self.addEventListener('notificationclick', function(e) {
    if (!e.action) {
      // Was a normal notification click
      console.info('Notification Click.');
      return;
    }
  
    switch (e.action) {
      case 'web-action':
        e.notification.close();
  
        e.waitUntil(
          clients.openWindow(e.notification.data.url)
        );
        break;
    }
  });
  
  
  navigateFallbackWhitelist: [/^(?!\/__).*/];



