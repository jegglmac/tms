'use client';

import React, { useState, useEffect } from 'react';
import InstallButton from '@/components/InstallButton';
import {
  DevicePhoneMobileIcon,
  SignalIcon,
  MapPinIcon,
  BoltIcon,
  WifiIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

interface DeviceInfo {
  userAgent: string;
  platform: string;
  online: boolean;
  battery: number | null;
  connection: string;
}

const MobileTestPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    speed: null,
    heading: null,
    timestamp: 0
  });
  
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    userAgent: '',
    platform: '',
    online: true,
    battery: null,
    connection: 'unknown'
  });
  
  const [trackingStatus, setTrackingStatus] = useState<'stopped' | 'starting' | 'active' | 'error'>('stopped');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [useIPLocation, setUseIPLocation] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const [trackingHistory, setTrackingHistory] = useState<LocationData[]>([]);
  const [updateCount, setUpdateCount] = useState(0);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check permission status on mount (only after hydration)
  useEffect(() => {
    if (!mounted) return;
    
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then(result => {
          setPermissionStatus(result.state as any);
          result.onchange = () => {
            setPermissionStatus(result.state as any);
          };
        })
        .catch(() => {
          setPermissionStatus('unknown');
        });
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Get device information (only on client side)
    if (typeof window !== 'undefined') {
      setDeviceInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        online: navigator.onLine,
        battery: null,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      });

      // Get battery info if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setDeviceInfo(prev => ({
            ...prev,
            battery: Math.round(battery.level * 100)
          }));
        });
      }
    }
  }, [mounted]);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage('❌ Geolocation is not supported');
      setTrackingStatus('error');
      return;
    }

    setTrackingStatus('starting');
    setErrorMessage('Requesting location permission...');

    // Try to request permission explicitly
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      if (result.state === 'denied') {
        setErrorMessage('🚫 Location permission denied. Please click the location icon 🔒 in your browser address bar and select "Allow"');
        setTrackingStatus('error');
        return;
      }
    } catch (e) {
      // Permission API not supported, continue with geolocation request
    }

    // Attempt to get location (this will trigger permission request if needed)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPermissionStatus('granted');
        setErrorMessage('✅ Permission granted! Starting location tracking...');
        setTimeout(() => startTracking(), 500);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionStatus('denied');
          setErrorMessage('🚫 Permission denied. Please click the location icon 🔒 in your browser address bar and select "Allow location access"');
        } else {
          setErrorMessage('❌ Unable to get location. Please check your GPS settings.');
        }
        setTrackingStatus('error');
      },
      { timeout: 5000 }
    );
  };

  const startTracking = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage('❌ Geolocation is not supported by this browser');
      setTrackingStatus('error');
      return;
    }

    setTrackingStatus('starting');
    setErrorMessage('');
    setUseIPLocation(false);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const successHandler = (position: GeolocationPosition) => {
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
        timestamp: position.timestamp
      };
      
      setLocation(locationData);
      setTrackingStatus('active');
      setPermissionStatus('granted');
      setUpdateCount(prev => prev + 1);
      
      // Store in tracking history (keep last 50 points)
      setTrackingHistory(prev => {
        const newHistory = [...prev, locationData];
        return newHistory.slice(-50);
      });
      
      // Simulate sending data to TMS server
      sendLocationToServer(locationData);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let message = 'Unknown error occurred';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setPermissionStatus('denied');
          message = '🚫 Location access denied. Please enable location permissions in your browser settings and refresh the page.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = '📍 Location information unavailable. Make sure GPS is enabled and you have a good signal.';
          break;
        case error.TIMEOUT:
          message = '⏰ Location request timed out. Check your connection and try again.';
          break;
      }
      setErrorMessage(message);
      setTrackingStatus('error');
      
      // Only try IP fallback if permission was denied
      if (error.code === error.PERMISSION_DENIED) {
        console.log('GPS permission denied, attempting IP-based location fallback...');
        setTimeout(() => tryIPLocation(), 1000); // Small delay for better UX
      }
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);

    // Watch position for continuous updates
    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, options);

    // Store watch ID for cleanup
    return () => navigator.geolocation.clearWatch(watchId);
  };

  const tryIPLocation = async () => {
    setTrackingStatus('starting');
    setErrorMessage('');
    setUseIPLocation(true);

    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 10000, // IP location is less accurate
          speed: null,
          heading: null,
          timestamp: Date.now()
        });
        setTrackingStatus('active');
        setErrorMessage('Using IP-based location (approximate)');
      } else {
        throw new Error('No location data available');
      }
    } catch (error) {
      setErrorMessage('IP location failed. Please enable GPS location.');
      setTrackingStatus('error');
      setUseIPLocation(false);
    }
  };

  const stopTracking = () => {
    setTrackingStatus('stopped');
  };

  // Simulate sending location data to TMS server
  const sendLocationToServer = async (locationData: LocationData) => {
    try {
      // In a real implementation, this would send to your TMS API
      console.log('📡 Sending location to TMS server:', {
        vehicleId: `TMS-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        driverId: 'DRIVER-001',
        timestamp: new Date(locationData.timestamp).toISOString(),
        coordinates: {
          lat: locationData.latitude,
          lng: locationData.longitude,
          accuracy: locationData.accuracy
        },
        telemetry: {
          speed: locationData.speed,
          heading: locationData.heading
        }
      });
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In real implementation, you might store in localStorage as backup
      const trackingData = {
        timestamp: locationData.timestamp,
        lat: locationData.latitude,
        lng: locationData.longitude,
        accuracy: locationData.accuracy,
        speed: locationData.speed,
        heading: locationData.heading,
        sent: true
      };
      
      // Store in localStorage for offline capability
      const stored = localStorage.getItem('tms-tracking-data');
      const history = stored ? JSON.parse(stored) : [];
      history.push(trackingData);
      
      // Keep only last 100 points
      const trimmed = history.slice(-100);
      localStorage.setItem('tms-tracking-data', JSON.stringify(trimmed));
      
    } catch (error) {
      console.error('Failed to send location to server:', error);
      // In real implementation, queue for retry
    }
  };

  const getDeviceType = () => {
    if (typeof window === 'undefined') return '💻 Loading...';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone')) return '📱 iPhone';
    if (ua.includes('android')) return '📱 Android';
    if (ua.includes('ipad')) return '📱 iPad';
    return '💻 Desktop/Other';
  };

  const getBrowserType = () => {
    if (typeof window === 'undefined') return 'Loading...';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('edge')) return 'Edge';
    return 'Unknown';
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading mobile test...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-3">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DevicePhoneMobileIcon className="w-8 h-8 mr-3 text-blue-600" />
            TMS Mobile Test
          </h1>
          <p className="text-gray-600 mt-2">Test cell phone tracking features</p>
        </div>

        {/* Device Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SignalIcon className="w-5 h-5 mr-2 text-green-600" />
            Device Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Device:</span>
              <span className="font-semibold text-gray-900">{getDeviceType()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Browser:</span>
              <span className="font-semibold text-gray-900">{getBrowserType()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Platform:</span>
              <span className="font-semibold text-gray-900">{deviceInfo.platform || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Online:</span>
              <span className={`font-semibold flex items-center ${deviceInfo.online ? 'text-green-700' : 'text-red-700'}`}>
                <WifiIcon className="w-4 h-4 mr-1" />
                {deviceInfo.online ? 'Connected' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Connection:</span>
              <span className="font-semibold text-gray-900">{deviceInfo.connection}</span>
            </div>
            {deviceInfo.battery !== null && (
              <div className="flex justify-between">
                <span className="text-gray-800 font-medium">Battery:</span>
                <span className="font-semibold text-gray-900 flex items-center">
                  <BoltIcon className="w-4 h-4 mr-1 text-green-600" />
                  {deviceInfo.battery}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Tracking</h2>
          
          {trackingStatus === 'stopped' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>🔒 Privacy Note:</strong> Your location data stays on your device. This test demonstrates how the TMS tracks drivers during deliveries.
              </p>
            </div>
          )}

          {(trackingStatus === 'stopped' || trackingStatus === 'error') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm font-medium mb-2">🛠️ Permission Setup Guide:</p>
              <div className="space-y-2 text-yellow-700 text-xs">
                <div><strong>Step 1:</strong> Make sure location services are enabled on your device</div>
                <div><strong>Step 2:</strong> Click "Start Tracking" below - your browser will ask for permission</div>
                <div><strong>Step 3:</strong> Select "Allow" when prompted</div>
                <div className="text-yellow-600 italic">If no prompt appears, check the troubleshooting steps below when tracking fails</div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 mb-4">
            {permissionStatus === 'denied' || trackingStatus === 'error' ? (
              <button
                onClick={requestPermission}
                disabled={trackingStatus === 'starting'}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                {trackingStatus === 'starting' ? '📍 Requesting...' : '🔓 Request Permission'}
              </button>
            ) : (
              <button
                onClick={startTracking}
                disabled={trackingStatus === 'active' || trackingStatus === 'starting'}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              >
                {trackingStatus === 'starting' ? '📍 Starting...' : '🚀 Start Tracking'}
              </button>
            )}
            <button
              onClick={stopTracking}
              disabled={trackingStatus === 'stopped'}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              🛑 Stop
            </button>
          </div>

          {/* Retry button for error states */}
          {trackingStatus === 'error' && (
            <div className="mb-4">
              <button
                onClick={() => {
                  setTrackingStatus('stopped');
                  setErrorMessage('');
                  startTracking();
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🔄 Retry GPS Tracking
              </button>
            </div>
          )}

          <div className="mb-4">
            <button
              onClick={tryIPLocation}
              disabled={trackingStatus === 'active' || trackingStatus === 'starting'}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:bg-orange-700 transition-colors"
            >
              📡 Try IP-Based Location (Approximate)
            </button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Use this if GPS permission is denied
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              trackingStatus === 'active' ? 'bg-green-500' :
              trackingStatus === 'starting' ? 'bg-yellow-500' :
              trackingStatus === 'error' ? 'bg-red-500' : 'bg-gray-300'
            }`}></div>
            <span className="text-sm font-medium">
              Status: {trackingStatus.charAt(0).toUpperCase() + trackingStatus.slice(1)}
            </span>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{errorMessage}</p>
              
              {errorMessage.includes('denied') && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-red-700 text-sm font-medium mb-2">📍 How to enable location access:</p>
                  
                  <div className="bg-white rounded p-3 mb-3">
                    <p className="text-red-700 text-xs font-medium mb-2">Method 1: Browser Settings</p>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• <strong>Chrome Mobile:</strong> Menu (⋮) → Settings → Site Settings → Location → Allow</li>
                      <li>• <strong>Safari iPhone:</strong> Settings → Safari → Location → Ask or Allow</li>
                      <li>• <strong>Chrome Desktop:</strong> Address bar → Site Info (🛡️) → Location → Allow</li>
                      <li>• <strong>Firefox:</strong> Address bar → Shield icon → Allow location</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded p-3">
                    <p className="text-red-700 text-xs font-medium mb-2">Method 2: Try Different Browser</p>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• Open this page in Chrome or Firefox</li>
                      <li>• Try incognito/private mode</li>
                      <li>• Some browsers block location by default</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Data */}
        {location.latitude && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-green-600" />
              Location Data
              {useIPLocation && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  IP-Based
                </span>
              )}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-mono text-sm font-bold text-blue-900">
                  {location.latitude ? `${Math.abs(location.latitude).toFixed(6)}°${location.latitude >= 0 ? 'N' : 'S'}` : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-mono text-sm font-bold text-purple-900">
                  {location.longitude ? `${Math.abs(location.longitude).toFixed(6)}°${location.longitude >= 0 ? 'E' : 'W'}` : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">{location.accuracy?.toFixed(1)} meters</span>
              </div>
              {location.speed !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Speed:</span>
                  <span className="font-medium">{(location.speed * 2.237).toFixed(1)} mph</span>
                </div>
              )}
              {location.heading !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Heading:</span>
                  <span className="font-medium">{location.heading.toFixed(0)}°</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="font-medium flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1 text-blue-500" />
                  {new Date(location.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Updates */}
        {trackingStatus === 'active' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📍 Live Tracking Active</h3>
            <div className="space-y-2 text-green-800 text-sm">
              <div>✓ Location updates every few seconds</div>
              <div>✓ Movement and speed are being monitored</div>
              <div>✓ Data is processed locally on your device</div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border-l-4 border-green-400">
              <p className="text-green-700 text-xs">
                <strong>Live TMS Integration:</strong> This location data is now being transmitted to the 
                dispatch center for real-time fleet monitoring, route optimization, and customer updates.
              </p>
            </div>
          </div>
        )}

        {/* TMS Integration Features */}
        {trackingStatus === 'active' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚛 TMS Integration</h3>
            <div className="space-y-4">
              {/* Driver Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Driver Status</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    En Route
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Vehicle ID:</span>
                  <span className="font-mono text-sm">TMS-{String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}</span>
                </div>
              </div>

              {/* Route Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Route Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Stop:</span>
                    <span className="font-medium">Delivery Point #3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ETA:</span>
                    <span className="font-medium">{new Date(Date.now() + 30 * 60000).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Stops:</span>
                    <span className="font-medium">5 stops</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">94.2%</div>
                    <div className="text-gray-600">On-Time Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">8.5 MPG</div>
                    <div className="text-gray-600">Fuel Efficiency</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className="bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                    onClick={() => alert('Break time logged!')}
                  >
                    🛑 Log Break
                  </button>
                  <button 
                    className="bg-green-600 text-white text-xs px-3 py-2 rounded hover:bg-green-700 transition-colors"
                    onClick={() => alert('Delivery completed!')}
                  >
                    ✅ Complete Stop
                  </button>
                  <button 
                    className="bg-yellow-600 text-white text-xs px-3 py-2 rounded hover:bg-yellow-700 transition-colors"
                    onClick={() => alert('Issue reported!')}
                  >
                    ⚠️ Report Issue
                  </button>
                  <button 
                    className="bg-purple-600 text-white text-xs px-3 py-2 rounded hover:bg-purple-700 transition-colors"
                    onClick={() => alert('Message sent to dispatch!')}
                  >
                    📞 Contact Dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Transmission Status */}
        {trackingStatus === 'active' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📡 Data Transmission</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 text-sm">Server Connection:</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-800 text-sm">Last Update:</span>
                <span className="text-blue-900 font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-800 text-sm">Updates Sent:</span>
                <span className="text-blue-900 font-medium">{updateCount}</span>
              </div>
              <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-400">
                <p className="text-blue-700 text-xs">
                  <strong>Real Implementation:</strong> Location data is being transmitted to the TMS server 
                  every 5 seconds via secure API endpoints for fleet monitoring and customer notifications.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tracking History */}
        {trackingHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Tracking History</h3>
            <div className="text-sm text-gray-600 mb-3">
              Last {trackingHistory.length} location updates
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {trackingHistory.slice(-5).reverse().map((point, index) => (
                <div key={point.timestamp} className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs">
                      {point.latitude?.toFixed(6)}, {point.longitude?.toFixed(6)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(point.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>±{point.accuracy?.toFixed(1)}m</span>
                    {point.speed && <span>{(point.speed * 2.237).toFixed(1)} mph</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>Total Points: {trackingHistory.length}</span>
              <button 
                onClick={() => setTrackingHistory([])}
                className="text-red-600 hover:text-red-800"
              >
                Clear History
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* PWA Install Button */}
      <InstallButton />
    </div>
  );
};

export default MobileTestPage;
