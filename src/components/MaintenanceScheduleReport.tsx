'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentIcon,
  TableCellsIcon,
  CodeBracketIcon,
  TruckIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface MaintenanceScheduleReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock maintenance data
const maintenanceScheduleData = [
  {
    vehicleId: 'VH001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2022,
    mileage: 145200,
    lastService: '2024-11-15',
    nextService: '2025-01-15',
    daysUntilService: 8,
    serviceType: 'Preventive Maintenance',
    estimatedCost: 850,
    priority: 'High',
    location: 'Main Depot',
    status: 'Scheduled'
  },
  {
    vehicleId: 'VH002',
    make: 'Peterbilt',
    model: '579',
    year: 2021,
    mileage: 198500,
    lastService: '2024-10-20',
    nextService: '2025-01-20',
    daysUntilService: 13,
    serviceType: 'Engine Overhaul',
    estimatedCost: 3200,
    priority: 'Critical',
    location: 'Service Center A',
    status: 'Scheduled'
  },
  {
    vehicleId: 'VH003',
    make: 'Kenworth',
    model: 'T680',
    year: 2023,
    mileage: 89300,
    lastService: '2024-12-01',
    nextService: '2025-02-01',
    daysUntilService: 25,
    serviceType: 'Tire Replacement',
    estimatedCost: 1200,
    priority: 'Medium',
    location: 'Main Depot',
    status: 'Pending'
  },
  {
    vehicleId: 'VH004',
    make: 'Volvo',
    model: 'VNL',
    year: 2020,
    mileage: 234800,
    lastService: '2024-11-10',
    nextService: '2025-01-10',
    daysUntilService: 3,
    serviceType: 'Brake System Check',
    estimatedCost: 650,
    priority: 'High',
    location: 'Service Center B',
    status: 'Overdue'
  },
  {
    vehicleId: 'VH005',
    make: 'Mack',
    model: 'Anthem',
    year: 2022,
    mileage: 167400,
    lastService: '2024-11-25',
    nextService: '2025-02-25',
    daysUntilService: 49,
    serviceType: 'Transmission Service',
    estimatedCost: 1800,
    priority: 'Medium',
    location: 'Main Depot',
    status: 'Scheduled'
  },
  {
    vehicleId: 'VH006',
    make: 'International',
    model: 'LT Series',
    year: 2021,
    mileage: 178900,
    lastService: '2024-12-05',
    nextService: '2025-03-05',
    daysUntilService: 57,
    serviceType: 'Annual Inspection',
    estimatedCost: 450,
    priority: 'Low',
    location: 'Service Center A',
    status: 'Scheduled'
  }
];

const maintenanceCostTrends = [
  { month: 'Jan', planned: 8500, unplanned: 2300, total: 10800 },
  { month: 'Feb', planned: 9200, unplanned: 1800, total: 11000 },
  { month: 'Mar', planned: 7800, unplanned: 3100, total: 10900 },
  { month: 'Apr', planned: 8900, unplanned: 2200, total: 11100 },
  { month: 'May', planned: 9500, unplanned: 1900, total: 11400 },
  { month: 'Jun', planned: 8200, unplanned: 2800, total: 11000 },
  { month: 'Jul', planned: 8800, unplanned: 2100, total: 10900 },
  { month: 'Aug', planned: 9300, unplanned: 1700, total: 11000 },
  { month: 'Sep', planned: 8600, unplanned: 2400, total: 11000 },
  { month: 'Oct', planned: 9100, unplanned: 2000, total: 11100 },
  { month: 'Nov', planned: 8950, unplanned: 2150, total: 11100 },
  { month: 'Dec', planned: 9400, unplanned: 1600, total: 11000 }
];

const serviceTypeDistribution = [
  { type: 'Preventive Maintenance', count: 8, percentage: 33.3, color: '#10B981' },
  { type: 'Engine Service', count: 5, percentage: 20.8, color: '#3B82F6' },
  { type: 'Brake System', count: 4, percentage: 16.7, color: '#F59E0B' },
  { type: 'Tire Service', count: 3, percentage: 12.5, color: '#8B5CF6' },
  { type: 'Transmission', count: 2, percentage: 8.3, color: '#EF4444' },
  { type: 'Inspection', count: 2, percentage: 8.3, color: '#6B7280' }
];

const maintenanceMetrics = [
  { metric: 'Total Vehicles', value: '6', change: '0%', trend: 'neutral' },
  { metric: 'Scheduled Services', value: '5', change: '+25%', trend: 'up' },
  { metric: 'Overdue Services', value: '1', change: '-50%', trend: 'down' },
  { metric: 'Est. Total Cost', value: '$8,150', change: '+12%', trend: 'up' }
];

const upcomingMaintenanceData = [
  { week: 'Week 1', services: 2, cost: 1500 },
  { week: 'Week 2', services: 1, cost: 3200 },
  { week: 'Week 3', services: 0, cost: 0 },
  { week: 'Week 4', services: 2, cost: 3000 },
  { week: 'Week 5', services: 1, cost: 450 }
];

export default function MaintenanceScheduleReport({ isModal = true, onClose }: MaintenanceScheduleReportProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const downloadAsCSV = () => {
    try {
      const csvRows = [
        ['Maintenance Schedule Report'],
        ['Report Period', 'January 2025 - March 2025'],
        ['Generated', new Date().toLocaleDateString()],
        ['Generated By', 'TMS Pro Analytics System'],
        [],
        ['Executive Summary'],
        ['Total Vehicles', maintenanceScheduleData.length],
        ['Scheduled Services', maintenanceScheduleData.filter(v => v.status === 'Scheduled').length],
        ['Overdue Services', maintenanceScheduleData.filter(v => v.status === 'Overdue').length],
        ['Total Estimated Cost', `$${maintenanceScheduleData.reduce((sum, vehicle) => sum + vehicle.estimatedCost, 0)}`],
        [],
        ['Vehicle Maintenance Schedule'],
        ['Vehicle ID', 'Make', 'Model', 'Year', 'Mileage', 'Last Service', 'Next Service', 'Days Until Service', 'Service Type', 'Estimated Cost', 'Priority', 'Location', 'Status'],
        ...maintenanceScheduleData.map(vehicle => [
          vehicle.vehicleId,
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.mileage,
          vehicle.lastService,
          vehicle.nextService,
          vehicle.daysUntilService,
          vehicle.serviceType,
          vehicle.estimatedCost,
          vehicle.priority,
          vehicle.location,
          vehicle.status
        ]),
        [],
        ['Monthly Cost Trends'],
        ['Month', 'Planned Cost', 'Unplanned Cost', 'Total Cost'],
        ...maintenanceCostTrends.map(row => [row.month, row.planned, row.unplanned, row.total]),
        [],
        ['Service Type Distribution'],
        ['Service Type', 'Count', 'Percentage %'],
        ...serviceTypeDistribution.map(service => [service.type, service.count, service.percentage]),
        [],
        ['Upcoming Maintenance Schedule'],
        ['Week', 'Number of Services', 'Estimated Cost'],
        ...upcomingMaintenanceData.map(week => [week.week, week.services, week.cost])
      ];

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `maintenance-schedule-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setShowDownloadMenu(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          CSV downloaded successfully!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV file. Please try again.');
    }
  };

  const downloadAsPDF = () => {
    setIsGeneratingPDF(true);
    try {
      // Add print styles
      const printStyles = document.createElement('style');
      printStyles.textContent = `
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12px; }
          .print-page-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
          h1, h2, h3 { page-break-after: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          td, th { page-break-inside: avoid; }
          .chart-container { page-break-inside: avoid; }
        }
      `;
      document.head.appendChild(printStyles);
      
      // Add no-print class to action buttons
      const actionButtons = document.querySelectorAll('.print-hide');
      actionButtons.forEach(btn => btn.classList.add('no-print'));
      
      window.print();
      
      // Clean up
      setTimeout(() => {
        document.head.removeChild(printStyles);
        actionButtons.forEach(btn => btn.classList.remove('no-print'));
        setIsGeneratingPDF(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPDF(false);
      alert('Error generating PDF. Please try again.');
    }
    setShowDownloadMenu(false);
  };

  const shareReport = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: 'Maintenance Schedule Report - TMS Pro',
        text: 'Maintenance Schedule Report generated by TMS Pro Analytics System. This report provides comprehensive vehicle maintenance scheduling, cost analysis, and service tracking for fleet management.',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nView report: ${shareData.url}`);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg z-50';
        notification.innerHTML = `
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
            </svg>
            Report link copied to clipboard!
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sharing report:', error);
      
      // Fallback to simple copy
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Report link copied to clipboard!');
      } catch (clipboardError) {
        alert('Sharing failed. Please copy the URL manually.');
      }
    }
    setIsSharing(false);
  };

  const downloadAsJSON = () => {
    try {
      const reportData = {
        reportType: 'Maintenance Schedule Report',
        generatedDate: new Date().toISOString(),
        generatedBy: 'TMS Pro Analytics System',
        period: 'January 2025 - March 2025',
        version: '1.0.0',
        summary: {
          totalVehicles: maintenanceScheduleData.length,
          scheduledServices: maintenanceScheduleData.filter(v => v.status === 'Scheduled').length,
          overdueServices: maintenanceScheduleData.filter(v => v.status === 'Overdue').length,
          pendingServices: maintenanceScheduleData.filter(v => v.status === 'Pending').length,
          totalEstimatedCost: maintenanceScheduleData.reduce((sum, vehicle) => sum + vehicle.estimatedCost, 0),
          avgDaysUntilService: Math.round(maintenanceScheduleData.reduce((sum, vehicle) => sum + vehicle.daysUntilService, 0) / maintenanceScheduleData.length),
          criticalPriorityCount: maintenanceScheduleData.filter(v => v.priority === 'Critical').length,
          highPriorityCount: maintenanceScheduleData.filter(v => v.priority === 'High').length
        },
        maintenanceSchedule: maintenanceScheduleData.map(vehicle => ({
          ...vehicle,
          costPerMile: Math.round((vehicle.estimatedCost / vehicle.mileage) * 10000) / 10000,
          serviceUrgency: vehicle.daysUntilService <= 7 ? 'Urgent' : vehicle.daysUntilService <= 14 ? 'Soon' : 'Planned',
          vehicleAge: new Date().getFullYear() - vehicle.year
        })),
        costTrends: maintenanceCostTrends,
        serviceDistribution: serviceTypeDistribution,
        upcomingSchedule: upcomingMaintenanceData,
        insights: {
          mostUrgentVehicle: maintenanceScheduleData.reduce((most, vehicle) => vehicle.daysUntilService < most.daysUntilService ? vehicle : most),
          highestCostService: maintenanceScheduleData.reduce((highest, vehicle) => vehicle.estimatedCost > highest.estimatedCost ? vehicle : highest),
          maintenanceTrend: 'Proactive maintenance scheduling showing 25% increase in planned services',
          costOptimization: 'Unplanned maintenance costs reduced by 15% through better scheduling'
        },
        recommendations: [
          'Prioritize VH004 brake system check - overdue by 3 days',
          'Schedule VH002 engine overhaul within next 2 weeks',
          'Implement predictive maintenance for vehicles over 200k miles',
          'Consider bulk purchasing for tire replacements to reduce costs',
          'Review maintenance intervals for high-mileage vehicles'
        ],
        metadata: {
          totalDataPoints: maintenanceScheduleData.length + maintenanceCostTrends.length + serviceTypeDistribution.length,
          analysisDepth: 'Comprehensive',
          confidenceLevel: '94.8%',
          lastUpdated: new Date().toISOString(),
          maintenanceCompliance: '83.3%'
        }
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `maintenance-schedule-report-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
          JSON report downloaded successfully!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Error downloading JSON:', error);
      alert('Error downloading JSON file. Please try again.');
    }
    setShowDownloadMenu(false);
  };

  const reportContent = (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Schedule Report</h1>
            <p className="text-lg text-gray-600 mt-2">Fleet Maintenance Planning & Cost Analysis</p>
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500">
              <span>Report Period: January 2025 - March 2025</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>Generated By: TMS Pro Analytics System</span>
              <span>Report ID: MSR-2025-001</span>
            </div>
          </div>
          <div className="flex space-x-2 print-hide">
            <button 
              onClick={downloadAsPDF}
              disabled={isGeneratingPDF}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 shadow-sm"
              title="Print Report"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print
                </>
              )}
            </button>
            
            <button 
              onClick={shareReport}
              disabled={isSharing}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 shadow-sm"
              title="Share Report"
            >
              {isSharing ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sharing...
                </>
              ) : (
                <>
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                title="Download Report"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Download
                <ChevronDownIcon className="w-3 h-3 ml-1" />
              </button>
              
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-10 border border-gray-100">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      Export Options
                    </div>
                    <button
                      onClick={downloadAsPDF}
                      disabled={isGeneratingPDF}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      {isGeneratingPDF ? (
                        <svg className="animate-spin w-4 h-4 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <DocumentIcon className="w-4 h-4 mr-3 text-red-500" />
                      )}
                      <div className="text-left">
                        <div className="font-medium">PDF Document</div>
                        <div className="text-xs text-gray-500">Full report with charts & formatting</div>
                      </div>
                    </button>
                    <button
                      onClick={downloadAsCSV}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <TableCellsIcon className="w-4 h-4 mr-3 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">CSV Spreadsheet</div>
                        <div className="text-xs text-gray-500">Data for Excel/Google Sheets</div>
                      </div>
                    </button>
                    <button
                      onClick={downloadAsJSON}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CodeBracketIcon className="w-4 h-4 mr-3 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">JSON Data</div>
                        <div className="text-xs text-gray-500">Structured data with metadata</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 shadow-sm"
                title="Close Report"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {maintenanceMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {metric.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : metric.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <ClockIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  5 vehicles with scheduled maintenance appointments
                </li>
                <li className="flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-2" />
                  1 vehicle overdue for brake system maintenance
                </li>
                <li className="flex items-center">
                  <ClockIcon className="w-4 h-4 text-blue-500 mr-2" />
                  Average 25 days until next scheduled service
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  Total estimated cost: $8,150 for upcoming services
                </li>
                <li className="flex items-center">
                  <WrenchScrewdriverIcon className="w-4 h-4 text-purple-500 mr-2" />
                  2 critical priority services requiring immediate attention
                </li>
                <li className="flex items-center">
                  <TruckIcon className="w-4 h-4 text-gray-500 mr-2" />
                  Fleet average mileage: 169,017 miles
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Schedule</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Maintenance Schedule</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceScheduleData.map((vehicle, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <TruckIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.vehicleId}</div>
                          <div className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.mileage.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.lastService}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.nextService}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${vehicle.daysUntilService <= 0 ? 'text-red-600' : vehicle.daysUntilService <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {vehicle.daysUntilService <= 0 ? `${Math.abs(vehicle.daysUntilService)} overdue` : `${vehicle.daysUntilService} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.serviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vehicle.estimatedCost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        vehicle.priority === 'High' ? 'bg-yellow-100 text-yellow-800' :
                        vehicle.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        vehicle.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Maintenance Costs</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={maintenanceCostTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`$${value}`, name === 'planned' ? 'Planned' : name === 'unplanned' ? 'Unplanned' : 'Total']} />
                  <Area type="monotone" dataKey="planned" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="unplanned" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Type Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {serviceTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Maintenance Schedule</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={upcomingMaintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="services" fill="#3B82F6" name="Number of Services" />
                <Bar yAxisId="right" dataKey="cost" fill="#10B981" name="Estimated Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Immediate Action Required
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li>• VH004 brake system check is 3 days overdue - schedule immediately</li>
              <li>• VH002 engine overhaul needed within 13 days - high cost service</li>
              <li>• VH001 preventive maintenance due in 8 days - schedule soon</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Optimization Opportunities
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Bundle tire services for VH003 with other nearby vehicles</li>
              <li>• Consider bulk purchasing for transmission services</li>
              <li>• Implement predictive maintenance for high-mileage vehicles</li>
              <li>• Schedule annual inspections during low-demand periods</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6">
            {reportContent}
          </div>
        </div>
      </div>
    );
  }

  return reportContent;
}
