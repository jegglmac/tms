'use client';

import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after a short delay even if no install prompt
    const timer = setTimeout(() => {
      if (!installPrompt && !isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [installPrompt, isDismissed]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;

      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsVisible(false);
      } else {
        console.log('User dismissed the install prompt');
      }

      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleManualInstall = () => {
    alert(
      'To install TMS App:\n\n' +
      'Chrome/Edge: Menu (⋮) → "Add to Home screen"\n' +
      'Safari: Share (📤) → "Add to Home Screen"\n\n' +
      'The app will then appear on your home screen!'
    );
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 shadow-lg z-50 animate-slide-down">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ArrowDownTrayIcon className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Install TMS App</p>
            <p className="text-blue-100 text-xs">Add to home screen for better experience</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isInstallable ? (
            <button
              onClick={handleInstallClick}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              Install
            </button>
          ) : (
            <button
              onClick={handleManualInstall}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              How to Install
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="text-blue-200 hover:text-white transition-colors p-1"
            aria-label="Dismiss"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
