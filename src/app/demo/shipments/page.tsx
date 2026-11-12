'use client';

import React, { useState, useEffect } from 'react';
import SimpleShipmentTracking from '@/components/SimpleShipmentTracking';
import MobileShipmentTracking from '@/components/MobileShipmentTracking';
import MobileNav from '@/components/MobileNav';

export default function ShipmentsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav currentPage="/shipments" />
      <p className="bg-amber-50 px-4 py-2 text-center text-amber-900">Demonstration data</p>
      
      {/* Add mobile padding to account for fixed navigation */}
      <div className="pb-20 md:pb-0">
        {isMobile ? <MobileShipmentTracking /> : <SimpleShipmentTracking />}
      </div>
    </div>
  );
}
