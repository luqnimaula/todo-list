// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js"); // 7.6.1
importScripts("https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js");

// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('../firebase-messaging-sw.js')
// 	  .then(function(registration) {
// 	    console.log('Registration successful, scope is:', registration.scope);
// 	  }).catch(function(err) {
// 	    console.log('Service worker registration failed, error:', err);
// 	  });
// }

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
	apiKey: "",
  	authDomain: "",
  	databaseURL: "",
  	projectId: "",
  	storageBucket: "",
  	messagingSenderId: "",
  	appId: "",
  	measurementId: ""
});

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler((payload) => {
	const {data} = payload;
	// Customize notification here
	const notificationTitle = data && data.title;
	const notificationOptions = {
	    body: data && data.body,
	    icon: '/inix.png'
	};

  	return self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END background_handler]