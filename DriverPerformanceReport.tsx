'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  ChevronDownIcon,
  UserIcon,
  TrophyIcon,
  ClockIcon,
  ShieldCheckIcon,
  FunnelIcon,
  CalendarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

interface DriverPerformanceReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock driver performance data
const driverPerformanceData = [
  {
    id: 'DRV001',
    name: 'John Smith',
    photo: '/api/placeholder/48/48',
    totalTrips: 156,
    onTimeDeliveries: 149,
    onTimePercentage: 95.5,
    fuelEfficiency: 8.2,
    safetyScore: 98,
    customerRating: 4.8,
    totalMiles: 24580,
    avgTripDistance: 157.6,
    monthlyEarnings: 8450,
    violations: 0,
    accidents: 0,
    rank: 1,
    experience: '8 years',
    certifications: ['CDL-A', 'HazMat', 'Defensive Driving'],
    specializations: ['Long Haul', 'Refrigerated Transport']
  },
  {
    id: 'DRV002',
    name: 'Maria Garcia',
    photo: '/api/placeholder/48/48',
    totalTrips: 142,
    onTimeDeliveries: 134,
    onTimePercentage: 94.4,
    fuelEfficiency: 7.8,
    safetyScore: 100,
    customerRating: 4.9,
    totalMiles: 19850,
    avgTripDistance: 139.8,
    monthlyEarnings: 7920,
    violations: 0,
    accidents: 0,
    rank: 2,
    experience: '12 years',
    certifications: ['CDL-A', 'HazMat', 'First Aid'],
    specializations: ['Express Delivery', 'Local Routes']
  },
  {
    id: 'DRV003',
    name: 'David Johnson',
    photo: '/api/placeholder/48/48',
    totalTrips: 128,
    onTimeDeliveries: 116,
    onTimePercentage: 90.6,
    fuelEfficiency: 8.5,
    safetyScore: 95,
    customerRating: 4.6,
    totalMiles: 22100,
    avgTripDistance: 172.7,
    monthlyEarnings: 7650,
    violations: 1,
    accidents: 0,
    rank: 3,
    experience: '5 years',
    certifications: ['CDL-A', 'Defensive Driving'],
    specializations: ['Heavy Freight', 'Construction Materials']
  },
  {
    id: 'DRV004',
    name: 'Sarah Wilson',
    photo: '/api/placeholder/48/48',
    totalTrips: 134,
    onTimeDeliveries: 131,
    onTimePercentage: 97.8,
    fuelEfficiency: 7.6,
    safetyScore: 99,
    customerRating: 4.7,
    totalMiles: 18920,
    avgTripDistance: 141.2,
    monthlyEarnings: 8100,
    violations: 0,
    accidents: 0,
    rank: 4,
    experience: '6 years',
    certifications: ['CDL-A', 'HazMat', 'Customer Service'],
    specializations: ['Medical Supplies', 'Time-Critical Delivery']
  },
  {
    id: 'DRV005',
    name: 'Michael Brown',
    photo: '/api/placeholder/48/48',
    totalTrips: 119,
    onTimeDeliveries: 106,
    onTimePercentage: 89.1,
    fuelEfficiency: 8.9,
    safetyScore: 92,
    customerRating: 4.4,
    totalMiles: 21450,
    avgTripDistance: 180.3,
    monthlyEarnings: 7200,
    violations: 2,
    accidents: 1,
    rank: 5,
    experience: '3 years',
    certifications: ['CDL-A'],
    specializations: ['Standard Freight']
  },
  {
    id: 'DRV006',
    name: 'Emily Davis',
    photo: '/api/placeholder/48/48',
    totalTrips: 145,
    onTimeDeliveries: 138,
    onTimePercentage: 95.2,
    fuelEfficiency: 7.9,
    safetyScore: 97,
    customerRating: 4.8,
    totalMiles: 20380,
    avgTripDistance: 140.6,
    monthlyEarnings: 8200,
    violations: 0,
    accidents: 0,
    rank: 6,
    experience: '7 years',
    certifications: ['CDL-A', 'HazMat', 'Eco-Driving'],
    specializations: ['Eco-Friendly Routes', 'Urban Delivery']
  }
];

const performanceMetrics = [
  { metric: 'On-Time Delivery', average: 93.7, top: 97.8, industry: 89.2 },
  { metric: 'Safety Score', average: 96.8, top: 100, industry: 92.5 },
  { metric: 'Fuel Efficiency', average: 8.1, top: 7.6, industry: 8.5 },
  { metric: 'Customer Rating', average: 4.7, top: 4.9, industry: 4.3 },
  { metric: 'Miles per Month', average: 21050, top: 24580, industry: 18500 }
];

const monthlyTrends = [
  { month: 'Jan', onTime: 92.5, safety: 95.2, fuel: 8.3, satisfaction: 4.6 },
  { month: 'Feb', onTime: 93.1, safety: 96.1, fuel: 8.2, satisfaction: 4.7 },
  { month: 'Mar', onTime: 94.2, safety: 96.8, fuel: 8.1, satisfaction: 4.7 },
  { month: 'Apr', onTime: 93.8, safety: 97.2, fuel: 8.0, satisfaction: 4.8 },
  { month: 'May', onTime: 94.7, safety: 96.9, fuel: 7.9, satisfaction: 4.7 },
  { month: 'Jun', onTime: 95.1, safety: 97.5, fuel: 7.8, satisfaction: 4.8 }
];

const performanceCategories = [
  { category: 'Excellent (95-100%)', count: 3, percentage: 50, color: '#10B981' },
  { category: 'Good (90-94%)', count: 2, percentage: 33.3, color: '#3B82F6' },
  { category: 'Average (85-89%)', count: 1, percentage: 16.7, color: '#F59E0B' },
  { category: 'Below Average (<85%)', count: 0, percentage: 0, color: '#EF4444' }
];

const trainingPrograms = [
  { program: 'Defensive Driving', completed: 5, enrolled: 1, effectiveness: 95 },
  { program: 'Fuel Efficiency', completed: 4, enrolled: 2, effectiveness: 88 },
  { program: 'Customer Service', completed: 3, enrolled: 3, effectiveness: 92 },
  { program: 'Safety Protocols', completed: 6, enrolled: 0, effectiveness: 97 },
  { program: 'Technology Training', completed: 2, enrolled: 4, effectiveness: 85 }
];

const DriverPerformanceReport: React.FC<DriverPerformanceReportProps> = ({ 
  isModal = false, 
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = () => {
    window.print();
    showNotification('Print dialog opened');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Driver Performance Report - TMS',
      text: 'Comprehensive driver performance analysis report for our transport management system.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showNotification('Report shared successfully');
      } catch (err) {
        console.log('Error sharing:', err);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Report link copied to clipboard');
  };

  const exportToPDF = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showNotification('PDF export completed');
    }, 2000);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Driver Performance Report'],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['Driver Performance Data'],
      ['ID', 'Name', 'Total Trips', 'On-Time %', 'Fuel Efficiency', 'Safety Score', 'Customer Rating', 'Monthly Earnings', 'Rank'],
      ...driverPerformanceData.map(driver => [
        driver.id,
        driver.name,
        driver.totalTrips,
        driver.onTimePercentage,
        driver.fuelEfficiency,
        driver.safetyScore,
        driver.customerRating,
        driver.monthlyEarnings,
        driver.rank
      ]),
      [''],
      ['Performance Metrics'],
      ['Metric', 'Fleet Average', 'Top Performer', 'Industry Average'],
      ...performanceMetrics.map(metric => [
        metric.metric,
        metric.average,
        metric.top,
        metric.industry
      ]),
      [''],
      ['Monthly Trends'],
      ['Month', 'On-Time %', 'Safety Score', 'Fuel Efficiency', 'Customer Satisfaction'],
      ...monthlyTrends.map(trend => [
        trend.month,
        trend.onTime,
        trend.safety,
        trend.fuel,
        trend.satisfaction
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `driver-performance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('CSV export completed');
  };

  const exportToJSON = () => {
    const jsonData = {
      reportTitle: 'Driver Performance Report',
      generatedDate: new Date().toISOString(),
      reportPeriod: 'June 2025',
      summary: {
        totalDrivers: driverPerformanceData.length,
        averageOnTimeDelivery: 93.7,
        averageSafetyScore: 96.8,
        averageFuelEfficiency: 8.1,
        averageCustomerRating: 4.7
      },
      drivers: driverPerformanceData,
      performanceMetrics,
      monthlyTrends,
      performanceCategories,
      trainingPrograms,
      insights: [
        'Top performer John Smith achieves 95.5% on-time delivery rate',
        'All drivers maintain safety scores above 92%',
        'Fuel efficiency improved by 6.3% compared to last quarter',
        'Customer satisfaction ratings consistently above 4.4 stars'
      ]
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `driver-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('JSON export completed');
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600 bg-green-100';
    if (percentage >= 90) return 'text-blue-600 bg-blue-100';
    if (percentage >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <TrophyIcon className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <TrophyIcon className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500">#{rank}</span>;
  };

  const containerClass = isModal 
    ? "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    : "min-h-screen bg-gray-50 py-8";

  const contentClass = isModal 
    ? "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
    : "max-w-7xl mx-auto";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserIcon className="w-8 h-8 mr-3 text-blue-600" />
                Driver Performance Report
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive driver analytics and performance metrics</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Period: June 2025
                <ClockIcon className="w-4 h-4 ml-4 mr-1" />
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Download Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  )}
                  Download
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                </button>
                
                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          exportToPDF();
                          setShowDownloadMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Download as PDF
                      </button>
                      <button
                        onClick={() => {
                          exportToCSV();
                          setShowDownloadMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Download as CSV
                      </button>
                      <button
                        onClick={() => {
                          exportToJSON();
                          setShowDownloadMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Download as JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PrinterIcon className="w-4 h-4 mr-2" />
                Print
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </button>

              {isModal && onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Performance Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fleet Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.metric}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Fleet Avg</span>
                      <span className="text-lg font-bold text-gray-900">{metric.average}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Top Performer</span>
                      <span className="text-sm font-semibold text-green-600">{metric.top}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Industry Avg</span>
                      <span className="text-sm text-gray-600">{metric.industry}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Leaderboard */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Performance Leaderboard</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Earnings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {driverPerformanceData.map((driver, index) => (
                    <React.Fragment key={driver.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {getRankIcon(driver.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">{driver.id} • {driver.experience}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.totalTrips}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(driver.onTimePercentage)}`}>
                            {driver.onTimePercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-gray-900">{driver.safetyScore}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <FunnelIcon className="w-4 h-4 text-blue-500 mr-1" />
                            {driver.fuelEfficiency} mpg
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(driver.customerRating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-600">{driver.customerRating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${driver.monthlyEarnings.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {selectedDriver === driver.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {selectedDriver === driver.id && (
                        <tr>
                          <td colSpan={9} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                                <div className="space-y-1">
                                  {driver.certifications.map((cert, i) => (
                                    <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                                <div className="space-y-1">
                                  {driver.specializations.map((spec, i) => (
                                    <span key={i} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Performance Stats</h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div>Total Miles: {driver.totalMiles.toLocaleString()}</div>
                                  <div>Avg Trip Distance: {driver.avgTripDistance} mi</div>
                                  <div>Violations: {driver.violations}</div>
                                  <div>Accidents: {driver.accidents}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Trends and Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Performance Trends */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="onTime" fill="#3B82F6" name="On-Time %" />
                  <Line type="monotone" dataKey="safety" stroke="#10B981" strokeWidth={2} name="Safety Score" />
                  <Line type="monotone" dataKey="satisfaction" stroke="#F59E0B" strokeWidth={2} name="Customer Satisfaction" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({category, percentage}) => `${category}: ${percentage}%`}
                  >
                    {performanceCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {performanceCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-700">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{category.count} drivers</span>
                      <span className="text-gray-500 ml-2">({category.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Driver Performance Radar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top 3 Drivers Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={[
                { subject: 'On-Time', johnSmith: 95.5, mariaGarcia: 94.4, davidJohnson: 90.6 },
                { subject: 'Safety', johnSmith: 98, mariaGarcia: 100, davidJohnson: 95 },
                { subject: 'Fuel Efficiency', johnSmith: 82, mariaGarcia: 78, davidJohnson: 85 },
                { subject: 'Customer Rating', johnSmith: 96, mariaGarcia: 98, davidJohnson: 92 },
                { subject: 'Experience', johnSmith: 80, mariaGarcia: 100, davidJohnson: 50 }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="John Smith" dataKey="johnSmith" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                <Radar name="Maria Garcia" dataKey="mariaGarcia" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                <Radar name="David Johnson" dataKey="davidJohnson" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Training Programs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Training Programs & Development</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectiveness</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainingPrograms.map((program, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program.program}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {program.completed} drivers
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {program.enrolled} drivers
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          program.effectiveness >= 95 ? 'bg-green-100 text-green-800' :
                          program.effectiveness >= 90 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {program.effectiveness}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(program.completed / (program.completed + program.enrolled)) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">Top Performers</h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• John Smith leads with 95.5% on-time delivery</li>
                    <li>• Maria Garcia maintains perfect safety record</li>
                    <li>• Sarah Wilson excels in customer satisfaction (4.7/5)</li>
                    <li>• Overall fleet performance above industry standards</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">Improvement Areas</h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Focus on fuel efficiency training programs</li>
                    <li>• Implement advanced safety protocols</li>
                    <li>• Enhance customer service training</li>
                    <li>• Monitor driver wellness and fatigue management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPerformanceReport;
