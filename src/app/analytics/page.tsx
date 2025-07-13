import Analytics from '@/components/Analytics';
import MobileNav from '@/components/MobileNav';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav currentPage="/analytics" />
      
      {/* Add mobile padding to account for fixed navigation */}
      <div className="pb-20 md:pb-0">
        <Analytics />
      </div>
    </div>
  );
}
