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
      
      {/* Add mobile padding to account for fixed navigation */}
      <div className="pb-20 md:pb-0">
        {isMobile ? <MobileShipmentTracking /> : <SimpleShipmentTracking />}
      </div>
    </div>
  );
}
