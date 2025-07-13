'use client';

export default function ShipmentTracking() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Shipment Tracking - WORKING!</h1>
      <p className="text-gray-600 mb-4">This component is now loading successfully.</p>
      
      {/* Simple test table */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Test Shipments</h2>
        <div className="space-y-2">
          <div className="bg-white p-3 rounded border flex justify-between items-center">
            <span>SH-12345 - Electronics Shipment</span>
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              Map
            </button>
          </div>
          <div className="bg-white p-3 rounded border flex justify-between items-center">
            <span>SH-12346 - Furniture Shipment</span>
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
