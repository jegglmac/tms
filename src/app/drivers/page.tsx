import DriverPerformance from '@/components/DriverPerformance';
import MobileNav from '@/components/MobileNav';

export default function DriversPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav currentPage="/drivers" />
      
      {/* Add mobile padding to account for fixed navigation */}
      <div className="pb-20 md:pb-0">
        <DriverPerformance />
      </div>
    </div>
  );
}
