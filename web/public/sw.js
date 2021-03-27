
/*
self.addEventListener('push', function(event) {
  event.waitUntil(
        self.registration.showNotification('System Update', {
      lang: 'nl',
      body: 'Android: System Update (Tweakers demo)',
      icon: 'https://cdn.glitch.com/840016c1-35e1-4ad9-a9a3-2cc16306f43f%2Fcellphone-arrow-down.png?v=1616872620018',
      badge: "https://cdn.glitch.com/840016c1-35e1-4ad9-a9a3-2cc16306f43f%2Fcellphone-arrow-down.png?v=1616872620018",
      vibrate: [500, 100, 500],
    })
  );
});


self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});

*/

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Update Tweakers demo';
  const options = {
    body: 'Android: System Update (Tweakers demo)',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Android_logo_2019.svg/1200px-Android_logo_2019.svg.png',
    badge: "https://cdn.glitch.com/840016c1-35e1-4ad9-a9a3-2cc16306f43f%2Fcellphone-arrow-down.png?v=1616873564170",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/*
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});
*/

self.addEventListener('notificationclick', function(event) {
    let url = 'https://example.com/some-path/';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});