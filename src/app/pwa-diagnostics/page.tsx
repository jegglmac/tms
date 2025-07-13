'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PWADiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {};

      // Check service worker
      results.serviceWorker = 'serviceWorker' in navigator;
      
      // Check manifest
      try {
        const manifestResponse = await fetch('/manifest.json');
        results.manifest = manifestResponse.ok;
        results.manifestData = await manifestResponse.json();
      } catch (error) {
        results.manifest = false;
        results.manifestError = error;
      }

      // Check HTTPS (not required for localhost)
      results.https = location.protocol === 'https:' || location.hostname === 'localhost';

      // Check if PWA is installable
      results.installPrompt = false;
      window.addEventListener('beforeinstallprompt', () => {
        results.installPrompt = true;
        setDiagnostics({...results});
      });

      // Check if already installed
      results.isInstalled = window.matchMedia('(display-mode: standalone)').matches;

      // Browser support
      results.browser = navigator.userAgent;
      results.isChrome = /Chrome/.test(navigator.userAgent);
      results.isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      results.isEdge = /Edge/.test(navigator.userAgent);

      setDiagnostics(results);
      setIsLoading(false);
    };

    runDiagnostics();
  }, []);

  const DiagnosticItem = ({ title, status, details }: any) => (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
      {status ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{details}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Running PWA diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PWA Installation Diagnostics</h1>
          <p className="text-gray-600">Check if your TMS app meets PWA installation requirements</p>
        </div>

        <div className="space-y-4">
          <DiagnosticItem
            title="Service Worker Support"
            status={diagnostics.serviceWorker}
            details={diagnostics.serviceWorker ? "Browser supports service workers" : "Service workers not supported"}
          />

          <DiagnosticItem
            title="Web App Manifest"
            status={diagnostics.manifest}
            details={diagnostics.manifest ? "Manifest file loaded successfully" : "Manifest file not found or invalid"}
          />

          <DiagnosticItem
            title="HTTPS / Secure Connection"
            status={diagnostics.https}
            details={diagnostics.https ? "Running on secure connection" : "PWA requires HTTPS (except localhost)"}
          />

          <DiagnosticItem
            title="Installation Prompt"
            status={diagnostics.installPrompt}
            details={diagnostics.installPrompt ? "Browser shows install prompt" : "No install prompt (may already be installed or browser doesn't support)"}
          />

          <DiagnosticItem
            title="Already Installed"
            status={diagnostics.isInstalled}
            details={diagnostics.isInstalled ? "PWA is currently running in standalone mode" : "PWA not installed"}
          />

          <DiagnosticItem
            title="Browser Compatibility"
            status={diagnostics.isChrome || diagnostics.isSafari || diagnostics.isEdge}
            details={`Browser: ${diagnostics.browser}`}
          />
        </div>

        {diagnostics.manifestData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manifest Details</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(diagnostics.manifestData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800">Installation Instructions</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2"><strong>Chrome/Edge:</strong></p>
                <ul className="list-disc list-inside mb-4 ml-4">
                  <li>Look for install icon in address bar</li>
                  <li>OR: Menu (⋮) → "Install TMS"</li>
                  <li>OR: Menu (⋮) → "Add to Home screen"</li>
                </ul>
                
                <p className="mb-2"><strong>Safari (iOS):</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Tap Share button (📤)</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in top right</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Re-run Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
