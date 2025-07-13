'use client';

import { useEffect, useRef } from 'react';

interface RouteData {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  currentPosition: { lat: number; lng: number; name: string };
  waypoints: Array<{ lat: number; lng: number; name: string }>;
}

interface DynamicMapComponentProps {
  routeData: RouteData;
  shipment: {
    id: string;
    status: string;
  };
}

export default function DynamicMapComponent({ routeData, shipment }: DynamicMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let map: any;
    let L: any;

    const initializeMap = async () => {
      try {
        // Dynamic import of Leaflet
        L = (await import('leaflet')).default;
        const { MapContainer, TileLayer, Marker, Popup, Polyline } = await import('react-leaflet');

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create map
        map = L.map(mapRef.current).setView([39.0458, -96.0922], 5);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Create custom icons
        const truckIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #EF4444; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                   🚛
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const originIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const destinationIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Add markers
        L.marker([routeData.origin.lat, routeData.origin.lng], { icon: originIcon })
          .addTo(map)
          .bindPopup(`<b>Origin</b><br>${routeData.origin.name}`);

        L.marker([routeData.destination.lat, routeData.destination.lng], { icon: destinationIcon })
          .addTo(map)
          .bindPopup(`<b>Destination</b><br>${routeData.destination.name}`);

        L.marker([routeData.currentPosition.lat, routeData.currentPosition.lng], { icon: truckIcon })
          .addTo(map)
          .bindPopup(`<b>Current Position</b><br>${routeData.currentPosition.name}<br>Status: ${shipment.status}`);

        // Add route line
        const routeCoordinates = routeData.waypoints.map(point => [point.lat, point.lng]);
        L.polyline(routeCoordinates, { 
          color: '#3B82F6', 
          weight: 4, 
          opacity: 0.7 
        }).addTo(map);

        // Fit map to show all points
        const group = new L.featureGroup([
          L.marker([routeData.origin.lat, routeData.origin.lng]),
          L.marker([routeData.destination.lat, routeData.destination.lng]),
          L.marker([routeData.currentPosition.lat, routeData.currentPosition.lng])
        ]);
        map.fitBounds(group.getBounds().pad(0.1));

      } catch (error) {
        console.error('Error initializing map:', error);
        // Fallback to a simple map representation
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div class="text-center p-8">
                <div class="text-4xl mb-4">🗺️</div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Route Overview</h3>
                <div class="space-y-2 text-left max-w-sm">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-sm">Origin: ${routeData.origin.name}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span class="text-sm">Current: ${routeData.currentPosition.name}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span class="text-sm">Destination: ${routeData.destination.name}</span>
                  </div>
                </div>
                <p class="text-xs text-gray-600 mt-4">Interactive map loading...</p>
              </div>
            </div>
          `;
        }
      }
    };

    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
      if (map) {
        map.remove();
      }
    };
  }, [routeData, shipment]);

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
}
