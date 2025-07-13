'use client';

import React, { useState } from 'react';
import GoogleMapModal from './GoogleMapModal';

export default function SimpleShipmentTracking() {
  const [selectedShipment, setSelectedShipment] = useState<{id: string, route: string} | null>(null);

  const shipments = [
    { id: 'SP001', route: 'New York → Boston', status: 'In Transit', statusColor: 'green' },
    { id: 'SP002', route: 'Chicago → Detroit', status: 'Pending', statusColor: 'yellow' },
    { id: 'SP003', route: 'Los Angeles → San Francisco', status: 'Delivered', statusColor: 'green' }
  ];

  const handleViewMap = (shipment: {id: string, route: string}) => {
    setSelectedShipment(shipment);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipment Tracking</h1>
      <div className="space-y-6">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="border-2 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-gray-900">Shipment #{shipment.id}</h3>
                <p className="text-base text-gray-700 font-medium mt-1">From: {shipment.route}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 bg-${shipment.statusColor}-100 text-${shipment.statusColor}-800 rounded-full text-base font-semibold`}>
                  {shipment.status}
                </span>
                <button 
                  onClick={() => handleViewMap({id: shipment.id, route: shipment.route})}
                  className={`px-6 py-3 text-white rounded-lg font-semibold text-base hover:bg-blue-600 transition-colors ${
                    shipment.status === 'Delivered' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                  }`}
                  disabled={shipment.status === 'Delivered'}
                >
                  View Map
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Google Map Modal */}
      <GoogleMapModal 
        isOpen={selectedShipment !== null}
        onClose={() => setSelectedShipment(null)}
        shipmentId={selectedShipment?.id || ''}
        route={selectedShipment?.route || ''}
      />
    </div>
  );
}
