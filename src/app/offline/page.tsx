'use client';

import { WifiIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <WifiIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600">
            No internet connection detected. Some features may be limited.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Available Offline:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• View cached data</li>
              <li>• Use GPS tracking</li>
              <li>• Record location data</li>
              <li>• Access stored routes</li>
            </ul>
          </div>

          <button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>Try Again</span>
          </button>

          <p className="text-xs text-gray-500">
            Data will sync automatically when connection is restored.
          </p>
        </div>
      </div>
    </div>
  );
}
