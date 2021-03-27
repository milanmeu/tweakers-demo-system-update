function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

navigator.serviceWorker.register("sw.js");

navigator.serviceWorker.ready
  .then(function(registration) {
    return registration.pushManager
      .getSubscription()
      .then(async function(subscription) {
        if (subscription) {
          return subscription;
        }

        const response = await fetch("./vapidPublicKey");
        const vapidPublicKey = await response.text();

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      });
  })
  .then(function(subscription) {
    console.log(JSON.stringify({
        subscription: "subscription"
      }))
    fetch("./register", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        subscription: subscription
      })
    });

    document.getElementById("doIt").onclick = function() {
      //const delay = document.getElementById('notification-delay').value;
      //const ttl = document.getElementById('notification-ttl').value;

      const delay = 10;
      const ttl = 10;

      fetch("./sendNotification", {
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          subscription: subscription,
          delay: delay,
          ttl: ttl
        })
      });
    };
  });
