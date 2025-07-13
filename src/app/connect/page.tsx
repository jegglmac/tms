'use client';

import { useState, useEffect } from 'react';

export default function ConnectionHelper() {
  const [deviceIP, setDeviceIP] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  useEffect(() => {
    // Common local IP patterns to try
    const possibleIPs = [
      '192.168.0.14',
      '192.168.1.14', 
      '10.0.0.14',
      '172.16.0.14'
    ];
    
    setDeviceIP('192.168.0.14'); // Based on our ipconfig results
    
    // Generate QR code URL for easy mobile access
    const testUrl = 'http://192.168.0.14:3003/test';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(testUrl)}`;
    setQrCodeUrl(qrUrl);
  }, []);

  const testUrls = [
    `http://${deviceIP}:3003/test`,
    `http://${deviceIP}:3003/mobile-test`,
    `http://${deviceIP}:3003`,
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            📱 Mobile Connection Helper
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Quick Connect via QR Code
              </h2>
              <div className="flex justify-center mb-4">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code for mobile access" className="border rounded" />
                )}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan this QR code with your phone to access the TMS test page
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Manual Connection URLs
              </h2>
              <div className="space-y-2">
                {testUrls.map((url, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border">
                    <code className="text-sm text-blue-600 break-all">{url}</code>
                    <button
                      onClick={() => navigator.clipboard?.writeText(url)}
                      className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure both devices are on the same WiFi network</li>
                <li>• Try temporarily disabling Windows Firewall</li>
                <li>• Check if your router blocks device-to-device communication</li>
                <li>• Some corporate/public networks block local connections</li>
                <li>• Try using your phone's mobile hotspot if WiFi doesn't work</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Alternative: Use Mobile Hotspot</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Enable mobile hotspot on your phone</li>
                <li>2. Connect your computer to the phone's hotspot</li>
                <li>3. Check the new IP address with: <code>ipconfig</code></li>
                <li>4. Access the new IP address from your phone's browser</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
