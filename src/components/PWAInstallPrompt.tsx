'use client';

import { useEffect } from 'react';

export default function PWAInstallPrompt() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Handle install prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deferredPrompt: any;
    const addBtn = document.getElementById('add-button');

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI to notify the user they can add to home screen
      if (addBtn) {
        addBtn.style.display = 'block';
      }
    });

    const handleInstallClick = () => {
      // Hide the app provided install promotion
      if (addBtn) {
        addBtn.style.display = 'none';
      }
      // Show the install prompt
      if (deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      }
    };

    if (addBtn) {
      addBtn.addEventListener('click', handleInstallClick);
    }

    // Cleanup
    return () => {
      if (addBtn) {
        addBtn.removeEventListener('click', handleInstallClick);
      }
    };
  }, []);

  return null;
}
