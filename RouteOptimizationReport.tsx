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
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ChartBarSquareIcon,
  DocumentIcon,
  TableCellsIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

interface RouteOptimizationReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock route optimization data
const routePerformanceData = [
  {
    routeId: 'RT001',
    name: 'LA-SF Express',
    distance: 380,
    currentTime: 6.5,
    optimizedTime: 5.8,
    timeSaved: 0.7,
    fuelCurrent: 42.5,
    fuelOptimized: 38.2,
    fuelSaved: 4.3,
    costCurrent: 280,
    costOptimized: 251,
    costSaved: 29,
    efficiency: 89.6,
    congestionLevel: 'Medium',
    stops: 3,
    priority: 'High'
  },
  {
    routeId: 'RT002',
    name: 'NY-Boston Corridor',
    distance: 215,
    currentTime: 4.2,
    optimizedTime: 3.6,
    timeSaved: 0.6,
    fuelCurrent: 28.5,
    fuelOptimized: 24.8,
    fuelSaved: 3.7,
    costCurrent: 198,
    costOptimized: 172,
    costSaved: 26,
    efficiency: 86.9,
    congestionLevel: 'High',
    stops: 2,
    priority: 'High'
  },
  {
    routeId: 'RT003',
    name: 'Chicago-Detroit',
    distance: 280,
    currentTime: 5.1,
    optimizedTime: 4.7,
    timeSaved: 0.4,
    fuelCurrent: 35.2,
    fuelOptimized: 32.8,
    fuelSaved: 2.4,
    costCurrent: 245,
    costOptimized: 228,
    costSaved: 17,
    efficiency: 93.1,
    congestionLevel: 'Low',
    stops: 4,
    priority: 'Medium'
  },
  {
    routeId: 'RT004',
    name: 'Dallas-Houston',
    distance: 240,
    currentTime: 4.8,
    optimizedTime: 4.2,
    timeSaved: 0.6,
    fuelCurrent: 32.1,
    fuelOptimized: 28.6,
    fuelSaved: 3.5,
    costCurrent: 210,
    costOptimized: 187,
    costSaved: 23,
    efficiency: 89.0,
    congestionLevel: 'Medium',
    stops: 3,
    priority: 'Medium'
  },
  {
    routeId: 'RT005',
    name: 'Miami-Orlando',
    distance: 235,
    currentTime: 4.5,
    optimizedTime: 4.1,
    timeSaved: 0.4,
    fuelCurrent: 31.8,
    fuelOptimized: 29.2,
    fuelSaved: 2.6,
    costCurrent: 195,
    costOptimized: 178,
    costSaved: 17,
    efficiency: 91.3,
    congestionLevel: 'Low',
    stops: 2,
    priority: 'Low'
  },
  {
    routeId: 'RT006',
    name: 'Seattle-Portland',
    distance: 173,
    currentTime: 3.2,
    optimizedTime: 2.9,
    timeSaved: 0.3,
    fuelCurrent: 22.4,
    fuelOptimized: 20.6,
    fuelSaved: 1.8,
    costCurrent: 155,
    costOptimized: 142,
    costSaved: 13,
    efficiency: 91.6,
    congestionLevel: 'Low',
    stops: 1,
    priority: 'Low'
  }
];

const monthlyOptimizationTrends = [
  { month: 'Jan', timeSaved: 12.4, fuelSaved: 18.2, costSaved: 2840, efficiency: 85.2 },
  { month: 'Feb', timeSaved: 14.1, fuelSaved: 20.8, costSaved: 3120, efficiency: 87.1 },
  { month: 'Mar', timeSaved: 15.8, fuelSaved: 22.4, costSaved: 3450, efficiency: 88.6 },
  { month: 'Apr', timeSaved: 17.2, fuelSaved: 24.1, costSaved: 3780, efficiency: 89.4 },
  { month: 'May', timeSaved: 18.9, fuelSaved: 26.3, costSaved: 4120, efficiency: 90.8 },
  { month: 'Jun', timeSaved: 20.3, fuelSaved: 28.7, costSaved: 4480, efficiency: 91.5 },
  { month: 'Jul', timeSaved: 21.6, fuelSaved: 30.2, costSaved: 4720, efficiency: 92.1 },
  { month: 'Aug', timeSaved: 22.8, fuelSaved: 31.8, costSaved: 4950, efficiency: 92.8 },
  { month: 'Sep', timeSaved: 21.4, fuelSaved: 29.9, costSaved: 4650, efficiency: 91.9 },
  { month: 'Oct', timeSaved: 23.1, fuelSaved: 33.2, costSaved: 5180, efficiency: 93.4 },
  { month: 'Nov', timeSaved: 24.5, fuelSaved: 35.1, costSaved: 5420, efficiency: 94.2 },
  { month: 'Dec', timeSaved: 25.8, fuelSaved: 37.4, costSaved: 5750, efficiency: 94.8 }
];

const congestionAnalysis = [
  { zone: 'High Traffic Zones', routes: 8, avgDelay: 45, impact: 'High', color: '#EF4444' },
  { zone: 'Medium Traffic Zones', routes: 12, avgDelay: 28, impact: 'Medium', color: '#F59E0B' },
  { zone: 'Low Traffic Zones', routes: 15, avgDelay: 12, impact: 'Low', color: '#10B981' },
  { zone: 'Construction Zones', routes: 5, avgDelay: 65, impact: 'Critical', color: '#8B5CF6' }
];

const optimizationMetrics = [
  { metric: 'Total Time Saved', value: '25.8 hrs', change: '+12.3%', trend: 'up' },
  { metric: 'Fuel Efficiency', value: '94.8%', change: '+8.7%', trend: 'up' },
  { metric: 'Cost Reduction', value: '$5,750', change: '+15.2%', trend: 'up' },
  { metric: 'Route Efficiency', value: '91.2%', change: '+6.4%', trend: 'up' }
];

const routeComplexityData = [
  { stops: 1, routes: 8, efficiency: 95.2, avgTime: 2.8 },
  { stops: 2, routes: 12, efficiency: 92.1, avgTime: 3.9 },
  { stops: 3, routes: 10, efficiency: 89.4, avgTime: 5.2 },
  { stops: 4, routes: 6, efficiency: 86.7, avgTime: 6.8 },
  { stops: 5, routes: 4, efficiency: 83.5, avgTime: 8.1 }
];

const peakTimeAnalysis = [
  { hour: '6 AM', volume: 15, efficiency: 92.3, delay: 8 },
  { hour: '8 AM', volume: 45, efficiency: 78.2, delay: 28 },
  { hour: '10 AM', volume: 35, efficiency: 85.4, delay: 18 },
  { hour: '12 PM', volume: 52, efficiency: 74.6, delay: 35 },
  { hour: '2 PM', volume: 38, efficiency: 82.1, delay: 22 },
  { hour: '4 PM', volume: 48, efficiency: 76.8, delay: 32 },
  { hour: '6 PM', volume: 42, efficiency: 79.5, delay: 26 },
  { hour: '8 PM', volume: 25, efficiency: 88.9, delay: 15 }
];

export default function RouteOptimizationReport({ isModal = true, onClose }: RouteOptimizationReportProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const downloadAsCSV = () => {
    try {
      const csvRows = [
        ['Route Optimization Report'],
        ['Report Period', 'January 2024 - December 2024'],
        ['Generated', new Date().toLocaleDateString()],
        ['Generated By', 'TMS Pro Analytics System'],
        [],
        ['Executive Summary'],
        ['Metric', 'Value', 'Change', 'Trend'],
        ...optimizationMetrics.map(metric => [metric.metric, metric.value, metric.change, metric.trend]),
        [],
        ['Route Performance Analysis'],
        ['Route ID', 'Name', 'Distance (mi)', 'Current Time (hrs)', 'Optimized Time (hrs)', 'Time Saved (hrs)', 'Fuel Current (gal)', 'Fuel Optimized (gal)', 'Fuel Saved (gal)', 'Cost Current ($)', 'Cost Optimized ($)', 'Cost Saved ($)', 'Efficiency %', 'Congestion Level', 'Priority'],
        ...routePerformanceData.map(route => [
          route.routeId,
          route.name,
          route.distance,
          route.currentTime,
          route.optimizedTime,
          route.timeSaved,
          route.fuelCurrent,
          route.fuelOptimized,
          route.fuelSaved,
          route.costCurrent,
          route.costOptimized,
          route.costSaved,
          route.efficiency,
          route.congestionLevel,
          route.priority
        ]),
        [],
        ['Monthly Optimization Trends'],
        ['Month', 'Time Saved (hrs)', 'Fuel Saved (gal)', 'Cost Saved ($)', 'Efficiency %'],
        ...monthlyOptimizationTrends.map(row => [row.month, row.timeSaved, row.fuelSaved, row.costSaved, row.efficiency]),
        [],
        ['Congestion Analysis'],
        ['Zone', 'Routes Count', 'Avg Delay (min)', 'Impact Level'],
        ...congestionAnalysis.map(zone => [zone.zone, zone.routes, zone.avgDelay, zone.impact]),
        [],
        ['Peak Time Analysis'],
        ['Hour', 'Traffic Volume', 'Efficiency %', 'Avg Delay (min)'],
        ...peakTimeAnalysis.map(peak => [peak.hour, peak.volume, peak.efficiency, peak.delay]),
        [],
        ['Route Complexity Analysis'],
        ['Stops', 'Routes Count', 'Efficiency %', 'Avg Time (hrs)'],
        ...routeComplexityData.map(complex => [complex.stops, complex.routes, complex.efficiency, complex.avgTime])
      ];

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `route-optimization-report-${new Date().toISOString().split('T')[0]}.csv`;
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
        title: 'Route Optimization Report - TMS Pro',
        text: 'Route Optimization Report generated by TMS Pro Analytics System. This report provides comprehensive insights into route efficiency, cost savings, and optimization opportunities.',
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
        reportType: 'Route Optimization Report',
        generatedDate: new Date().toISOString(),
        generatedBy: 'TMS Pro Analytics System',
        period: 'January 2024 - December 2024',
        version: '1.0.0',
        summary: {
          totalRoutes: routePerformanceData.length,
          totalTimeSaved: '25.8 hours',
          totalFuelSaved: '37.4 gallons',
          totalCostSaved: '$5,750',
          avgEfficiency: '91.2%',
          highPriorityRoutes: routePerformanceData.filter(r => r.priority === 'High').length,
          totalOptimizationPotential: '$68,000 annually'
        },
        routePerformance: routePerformanceData.map(route => ({
          ...route,
          optimizationScore: Math.round((route.timeSaved + route.fuelSaved + route.costSaved / 10) * 10) / 10,
          improvementPercentage: Math.round(((route.costCurrent - route.costOptimized) / route.costCurrent) * 100 * 10) / 10
        })),
        monthlyTrends: monthlyOptimizationTrends,
        congestionAnalysis: congestionAnalysis,
        optimizationMetrics: optimizationMetrics,
        routeComplexity: routeComplexityData,
        peakTimeAnalysis: peakTimeAnalysis,
        recommendations: {
          immediate: [
            'Prioritize LA-SF Express and NY-Boston routes for optimization',
            'Implement dynamic routing during peak hours (8 AM, 12 PM, 4 PM)',
            'Use alternative routes in construction zones'
          ],
          longTerm: [
            'Invest in real-time traffic monitoring systems',
            'Consider route consolidation for improved fuel efficiency',
            'Implement time-of-day delivery restrictions for high-congestion areas'
          ]
        },
        metadata: {
          totalDataPoints: routePerformanceData.length + monthlyOptimizationTrends.length + peakTimeAnalysis.length,
          analysisDepth: 'Comprehensive',
          confidenceLevel: '94.2%',
          lastUpdated: new Date().toISOString()
        }
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `route-optimization-report-${new Date().toISOString().split('T')[0]}.json`;
      
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
            <h1 className="text-3xl font-bold text-gray-900">Route Optimization Report</h1>
            <p className="text-lg text-gray-600 mt-2">Advanced Route Analysis & Optimization Insights</p>
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500">
              <span>Report Period: January 2024 - December 2024</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>Generated By: TMS Pro Analytics System</span>
              <span>Report ID: ROT-2024-001</span>
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          {optimizationMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Optimization Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  6 routes analyzed with optimization potential
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  25.8 hours total time saved per month
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  37.4 gallons fuel efficiency improvement
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mr-2" />
                  5 routes affected by construction zones
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  $5,750 monthly cost savings achieved
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  91.2% average route efficiency maintained
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Trends */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Optimization Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time & Cost Savings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyOptimizationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="costSaved" fill="#3B82F6" name="Cost Saved ($)" />
                <Line yAxisId="right" type="monotone" dataKey="timeSaved" stroke="#10B981" strokeWidth={3} name="Time Saved (hrs)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Improvement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyOptimizationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
                <Area type="monotone" dataKey="efficiency" stroke="#8B5CF6" fill="#C4B5FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Route Performance Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Performance Analysis</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Saved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Saved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Saved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congestion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routePerformanceData.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{route.name}</div>
                          <div className="text-sm text-gray-500">{route.routeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.distance} mi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-green-500 mr-1" />
                        {route.timeSaved} hrs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <BoltIcon className="h-4 w-4 text-blue-500 mr-1" />
                        {route.fuelSaved} gal
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 text-green-600 mr-1" />
                        ${route.costSaved}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '60px' }}>
                          <div 
                            className={`h-2 rounded-full ${
                              route.efficiency >= 90 ? 'bg-green-500' :
                              route.efficiency >= 85 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${route.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{route.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        route.congestionLevel === 'High' ? 'bg-red-100 text-red-800' :
                        route.congestionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {route.congestionLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        route.priority === 'High' ? 'bg-red-100 text-red-800' :
                        route.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {route.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Traffic Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Traffic & Congestion Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Congestion Impact</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={congestionAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="routes"
                >
                  {congestionAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} routes`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Time Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={peakTimeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="volume" fill="#8B5CF6" name="Traffic Volume" />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2} name="Efficiency %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Route Complexity Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Complexity vs Efficiency</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stops Impact on Performance</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart data={routeComplexityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stops" name="Number of Stops" />
              <YAxis dataKey="efficiency" name="Efficiency %" />
              <Tooltip formatter={(value, name) => [value, name]} />
              <Scatter name="Route Efficiency" dataKey="efficiency" fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimization Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              High-Impact Optimizations
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Prioritize LA-SF Express and NY-Boston routes for immediate optimization</li>
              <li>• Implement dynamic routing to avoid peak congestion hours</li>
              <li>• Use alternative routes during construction periods</li>
              <li>• Optimize fuel consumption through route consolidation</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• Monitor high-congestion zones and adjust schedules accordingly</li>
              <li>• Reduce stops on complex routes to improve efficiency</li>
              <li>• Implement real-time traffic monitoring for dynamic adjustments</li>
              <li>• Consider time-of-day restrictions for heavy traffic routes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        <p>This report is confidential and proprietary to TMS Pro. Generated on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">For questions about this report, contact: operations@tmspro.com | (555) 123-4567</p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Route Optimization Report</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            {reportContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {reportContent}
    </div>
  );
}
