'use client';

import React, { useState } from 'react';
import { 
  XMarkIcon, 
  TruckIcon, 
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface NewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShipmentCreated?: () => void;
  currentVehicle?: {
    id: string;
    name: string;
    driver: string;
    position: { lat: number; lng: number };
    fuel: number;
  };
  currentLocation?: string;
}

interface ShipmentData {
  pickupAddress: string;
  deliveryAddress: string;
  cargo: string;
  weight: string;
  priority: 'Standard' | 'Urgent' | 'Express';
  customerName: string;
  customerPhone: string;
  notes: string;
  pickupTime: string;
  deliveryTime: string;
}

export default function MobileNewShipmentModal({ 
  isOpen, 
  onClose, 
  onShipmentCreated,
  currentVehicle, 
  currentLocation 
}: NewShipmentModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shipmentData, setShipmentData] = useState<ShipmentData>({
    pickupAddress: currentLocation || '',
    deliveryAddress: '',
    cargo: '',
    weight: '',
    priority: 'Standard',
    customerName: '',
    customerPhone: '',
    notes: '',
    pickupTime: new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16), // 30 min from now
    deliveryTime: new Date(Date.now() + 4 * 60 * 60000).toISOString().slice(0, 16) // 4 hours from now
  });

  const totalSteps = 3;

  if (!isOpen) return null;

  const handleInputChange = (field: keyof ShipmentData, value: string) => {
    setShipmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const shipmentId = `TMS-${Date.now().toString().slice(-6)}`;
    
    alert(`✅ Shipment Created Successfully!

Shipment ID: ${shipmentId}
From: ${shipmentData.pickupAddress}
To: ${shipmentData.deliveryAddress}
Vehicle: ${currentVehicle?.name || 'Auto-Assigned'}
Driver: ${currentVehicle?.driver || 'Auto-Assigned'}
Priority: ${shipmentData.priority}

Estimated Cost: $${(Math.random() * 200 + 150).toFixed(2)}
Estimated Delivery: ${new Date(shipmentData.deliveryTime).toLocaleString()}`);
    
    setIsSubmitting(false);
    onClose();
    setStep(1);
    
    // Call the success callback
    if (onShipmentCreated) {
      onShipmentCreated();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup & Delivery Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
              <input
                type="text"
                value={shipmentData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter pickup address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <input
                type="text"
                value={shipmentData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter delivery address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                <input
                  type="datetime-local"
                  value={shipmentData.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                <input
                  type="datetime-local"
                  value={shipmentData.deliveryTime}
                  onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Description</label>
              <input
                type="text"
                value={shipmentData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Electronics, Furniture, Food"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={shipmentData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter weight in pounds"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
              <select
                value={shipmentData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Standard">Standard (+$0)</option>
                <option value="Urgent">Urgent (+$25)</option>
                <option value="Express">Express (+$50)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
              <textarea
                value={shipmentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special handling instructions..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={shipmentData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
              <input
                type="tel"
                value={shipmentData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Shipment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{shipmentData.pickupAddress || 'Current Location'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{shipmentData.deliveryAddress || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cargo:</span>
                  <span className="font-medium">{shipmentData.cargo || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{shipmentData.weight ? `${shipmentData.weight} lbs` : 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`font-medium ${
                    shipmentData.priority === 'Express' ? 'text-red-600' :
                    shipmentData.priority === 'Urgent' ? 'text-orange-600' : 'text-green-600'
                  }`}>{shipmentData.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{currentVehicle?.name || 'Auto-Assign'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">{currentVehicle?.driver || 'Auto-Assign'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center space-x-3">
            <TruckIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">New Shipment</h2>
              <p className="text-sm text-gray-600">Step {step} of {totalSteps}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1 < step ? <CheckIcon className="w-4 h-4" /> : i + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !shipmentData.deliveryAddress) ||
                (step === 2 && !shipmentData.cargo)
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !shipmentData.customerName}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Shipment</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
