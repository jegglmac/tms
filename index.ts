// Core types for Transport Management System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'driver' | 'customer';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  make: string;
  year: number;
  type: 'truck' | 'van' | 'motorcycle' | 'car';
  capacity: number; // in kg
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  status: 'active' | 'maintenance' | 'inactive';
  driverId?: string;
  currentLocation?: Location;
  mileage: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  experience: number; // years
  rating: number; // 1-5
  status: 'available' | 'assigned' | 'off-duty';
  currentVehicleId?: string;
  currentLocation?: Location;
  completedTrips: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: Address;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: Date;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  weight: number; // kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  description: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedVehicleId?: string;
  assignedDriverId?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  waypoints: Location[];
  distance: number; // km
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  fuelCost: number;
  tollCost: number;
  status: 'planned' | 'active' | 'completed';
  shipmentIds: string[];
  vehicleId: string;
  driverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileageAtService: number;
  serviceDate: Date;
  nextServiceDue?: Date;
  serviceProvider: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  fuelAmount: number; // liters
  cost: number;
  mileage: number;
  station: string;
  location: Location;
  date: Date;
  createdAt: Date;
}

export interface Trip {
  id: string;
  routeId: string;
  vehicleId: string;
  driverId: string;
  startTime: Date;
  endTime?: Date;
  startMileage: number;
  endMileage?: number;
  status: 'active' | 'completed' | 'cancelled';
  fuelUsed?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  availableDrivers: number;
  totalShipments: number;
  pendingShipments: number;
  completedShipments: number;
  totalRevenue: number;
  fuelCosts: number;
  maintenanceCosts: number;
  averageDeliveryTime: number; // hours
  onTimeDeliveryRate: number; // percentage
}
