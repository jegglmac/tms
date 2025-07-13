import { 
  TruckIcon, 
  UserIcon, 
  ClipboardDocumentListIcon,
  MapIcon,
  ChartBarIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: ChartBarIcon },
  { name: 'Fleet Management', href: 'fleet', icon: TruckIcon },
  { name: 'Drivers', href: 'drivers', icon: UserIcon },
  { name: 'Shipments', href: 'shipments', icon: ClipboardDocumentListIcon },
  { name: 'Routes', href: 'routes', icon: MapIcon },
  { name: 'Operations', href: 'operations', icon: Cog6ToothIcon },
  { name: 'Analytics', href: 'analytics', icon: ChartBarIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleUserMenuClick = (itemName: string) => {
    setUserMenuOpen(false);
    
    switch (itemName) {
      case 'View Profile':
        onPageChange('profile');
        break;
      case 'Settings':
        onPageChange('settings');
        break;
      case 'Sign Out':
        console.log('Sign out clicked');
        // You can add sign out logic here
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    { name: 'View Profile', icon: UserIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
    { name: 'Sign Out', icon: ArrowRightOnRectangleIcon },
  ];
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <TruckIcon className="h-8 w-8 text-white" />
            <h1 className="ml-2 text-xl font-bold text-white">TMS Pro</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onPageChange(item.href)}
                className={classNames(
                  currentPage === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left'
                )}
              >
                <item.icon
                  className={classNames(
                    currentPage === item.href ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                    'mr-3 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 relative bg-gray-700">
          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {userMenuItems.map((item) => (
                  <button
                    key={item.name}
                    className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => handleUserMenuClick(item.name)}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* User Profile Section */}
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center p-4 hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">AU</span>
              </div>
            </div>
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-300">administrator@tms.com</p>
            </div>
            <ChevronUpIcon 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                userMenuOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}
