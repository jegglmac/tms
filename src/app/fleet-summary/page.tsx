'use client';

import React, { useState, useEffect } from 'react';
import FleetSummaryReport from '@/components/FleetSummaryReport';
import MobileFleetSummary from '@/components/MobileFleetSummary';
import MobileNav from '@/components/MobileNav';

export default function FleetSummaryPage() {
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
      <MobileNav currentPage="/fleet-summary" />
      
      {/* Add mobile padding to account for fixed navigation */}
      <div className="pb-20 md:pb-0">
        {isMobile ? <MobileFleetSummary /> : <FleetSummaryReport />}
      </div>
    </div>
  );
}
