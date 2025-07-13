'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import Settings from '@/components/Settings';
import ActivityLog from '@/components/ActivityLog';
import FleetManagement from '@/components/FleetManagement';
import RouteOptimization from '@/components/RouteOptimization';
import DriverPerformance from '@/components/DriverPerformance';
import SimpleShipmentTracking from '@/components/SimpleShipmentTracking';
import Operations from '@/components/Operations';
import Analytics from '@/components/Analytics';
import InstallButton from '@/components/InstallButton';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for navigation events from header
  useEffect(() => {
    const handleNavigateToProfile = () => {
      setCurrentPage('profile');
    };

    window.addEventListener('navigate-to-profile', handleNavigateToProfile);
    
    return () => {
      window.removeEventListener('navigate-to-profile', handleNavigateToProfile);
    };
  }, []);

  // Redirect to mobile dashboard if on mobile
  useEffect(() => {
    if (isMobile && typeof window !== 'undefined') {
      window.location.href = '/mobile-dashboard';
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'profile' && <UserProfile />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'activity-log' && <ActivityLog />}
          {currentPage === 'fleet' && <FleetManagement />}
          {currentPage === 'drivers' && <DriverPerformance />}
          {currentPage === 'shipments' && <SimpleShipmentTracking />}
          {currentPage === 'routes' && (
            <RouteOptimization onOptimize={() => console.log('Optimizing routes from main page...')} />
          )}
          {currentPage === 'operations' && <Operations />}
          {currentPage === 'analytics' && <Analytics />}
        </main>
        
        {/* PWA Install Button */}
        <InstallButton />
      </div>
    </div>
  );
}
