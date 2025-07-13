import Operations from '@/components/Operations';
import MobileNav from '@/components/MobileNav';

export default function OperationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav currentPage="/operations" />
      
      {/* Add mobile padding to account for fixed navigation */}
      <div className="pb-20 md:pb-0">
        <Operations />
      </div>
    </div>
  );
}
