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
  FireIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentIcon,
  TableCellsIcon,
  CodeBracketIcon,
  TruckIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon
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
  Area,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

interface FuelAnalysisReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock fuel data
const vehicleFuelData = [
  {
    vehicleId: 'VH001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2022,
    totalMiles: 15420,
    fuelConsumed: 2140,
    fuelCost: 6842,
    avgMPG: 7.2,
    fuelEfficiencyRating: 'Good',
    carbonEmissions: 22.8,
    idleTime: 124,
    avgFuelPrice: 3.20,
    fuelStations: 28,
    maintenanceScore: 85
  },
  {
    vehicleId: 'VH002',
    make: 'Peterbilt',
    model: '579',
    year: 2021,
    totalMiles: 18950,
    fuelConsumed: 2850,
    fuelCost: 9215,
    avgMPG: 6.6,
    fuelEfficiencyRating: 'Fair',
    carbonEmissions: 30.4,
    idleTime: 156,
    avgFuelPrice: 3.23,
    fuelStations: 35,
    maintenanceScore: 78
  },
  {
    vehicleId: 'VH003',
    make: 'Kenworth',
    model: 'T680',
    year: 2023,
    totalMiles: 12350,
    fuelConsumed: 1580,
    fuelCost: 5056,
    avgMPG: 7.8,
    fuelEfficiencyRating: 'Excellent',
    carbonEmissions: 16.9,
    idleTime: 89,
    avgFuelPrice: 3.20,
    fuelStations: 22,
    maintenanceScore: 92
  },
  {
    vehicleId: 'VH004',
    make: 'Volvo',
    model: 'VNL',
    year: 2020,
    totalMiles: 16780,
    fuelConsumed: 2420,
    fuelCost: 7744,
    avgMPG: 6.9,
    fuelEfficiencyRating: 'Good',
    carbonEmissions: 25.8,
    idleTime: 142,
    avgFuelPrice: 3.20,
    fuelStations: 31,
    maintenanceScore: 81
  },
  {
    vehicleId: 'VH005',
    make: 'Mack',
    model: 'Anthem',
    year: 2022,
    totalMiles: 14560,
    fuelConsumed: 2080,
    fuelCost: 6656,
    avgMPG: 7.0,
    fuelEfficiencyRating: 'Good',
    carbonEmissions: 22.2,
    idleTime: 118,
    avgFuelPrice: 3.20,
    fuelStations: 26,
    maintenanceScore: 87
  },
  {
    vehicleId: 'VH006',
    make: 'International',
    model: 'LT Series',
    year: 2021,
    totalMiles: 17220,
    fuelConsumed: 2580,
    fuelCost: 8253,
    avgMPG: 6.7,
    fuelEfficiencyRating: 'Fair',
    carbonEmissions: 27.5,
    idleTime: 178,
    avgFuelPrice: 3.20,
    fuelStations: 33,
    maintenanceScore: 75
  }
];

const monthlyFuelTrends = [
  { month: 'Jan', totalCost: 8420, gallons: 2632, avgPrice: 3.20, efficiency: 6.8, emissions: 28.1 },
  { month: 'Feb', totalCost: 9150, gallons: 2859, avgPrice: 3.20, efficiency: 6.9, emissions: 30.5 },
  { month: 'Mar', totalCost: 8890, gallons: 2778, avgPrice: 3.20, efficiency: 7.0, emissions: 29.7 },
  { month: 'Apr', totalCost: 9480, gallons: 2962, avgPrice: 3.20, efficiency: 6.8, emissions: 31.6 },
  { month: 'May', totalCost: 10250, gallons: 3203, avgPrice: 3.20, efficiency: 7.1, emissions: 34.2 },
  { month: 'Jun', totalCost: 11120, gallons: 3475, avgPrice: 3.20, efficiency: 7.0, emissions: 37.1 },
  { month: 'Jul', totalCost: 10850, gallons: 3391, avgPrice: 3.20, efficiency: 6.9, emissions: 36.2 },
  { month: 'Aug', totalCost: 9920, gallons: 3100, avgPrice: 3.20, efficiency: 7.2, emissions: 33.1 },
  { month: 'Sep', totalCost: 9650, gallons: 3016, avgPrice: 3.20, efficiency: 7.1, emissions: 32.2 },
  { month: 'Oct', totalCost: 10320, gallons: 3225, avgPrice: 3.20, efficiency: 6.9, emissions: 34.4 },
  { month: 'Nov', totalCost: 9780, gallons: 3056, avgPrice: 3.20, efficiency: 7.0, emissions: 32.6 },
  { month: 'Dec', totalCost: 8950, gallons: 2797, avgPrice: 3.20, efficiency: 7.3, emissions: 29.9 }
];

const fuelEfficiencyDistribution = [
  { category: 'Excellent (7.5+ MPG)', count: 1, percentage: 16.7, color: '#10B981' },
  { category: 'Good (7.0-7.4 MPG)', count: 3, percentage: 50.0, color: '#3B82F6' },
  { category: 'Fair (6.5-6.9 MPG)', count: 2, percentage: 33.3, color: '#F59E0B' },
  { category: 'Poor (<6.5 MPG)', count: 0, percentage: 0, color: '#EF4444' }
];

const fuelStationAnalysis = [
  { station: 'Shell', visits: 45, avgPrice: 3.18, totalSpent: 8940, discount: 5.2 },
  { station: 'BP', visits: 38, avgPrice: 3.22, totalSpent: 7650, discount: 3.1 },
  { station: 'Exxon', visits: 32, avgPrice: 3.20, totalSpent: 6800, discount: 2.8 },
  { station: 'Chevron', visits: 28, avgPrice: 3.24, totalSpent: 6120, discount: 1.9 },
  { station: 'Pilot', visits: 42, avgPrice: 3.19, totalSpent: 8380, discount: 4.7 },
  { station: 'TA/Petro', visits: 35, avgPrice: 3.21, totalSpent: 7420, discount: 3.5 }
];

const fuelMetrics = [
  { metric: 'Total Fuel Cost', value: '$115,766', change: '+8.2%', trend: 'up' },
  { metric: 'Fleet Average MPG', value: '7.0', change: '+2.9%', trend: 'up' },
  { metric: 'Carbon Emissions', value: '145.6 tons', change: '-1.8%', trend: 'down' },
  { metric: 'Fuel Efficiency Score', value: '78/100', change: '+5 points', trend: 'up' }
];

const routeEfficiencyData = [
  { route: 'Route A-1', distance: 285, fuelUsed: 42.5, mpg: 6.7, cost: 136, efficiency: 'Good' },
  { route: 'Route B-2', distance: 420, fuelUsed: 58.8, mpg: 7.1, cost: 188, efficiency: 'Excellent' },
  { route: 'Route C-3', distance: 195, fuelUsed: 31.2, mpg: 6.2, cost: 100, efficiency: 'Fair' },
  { route: 'Route D-4', distance: 360, fuelUsed: 48.6, mpg: 7.4, cost: 156, efficiency: 'Excellent' },
  { route: 'Route E-5', distance: 510, fuelUsed: 73.9, mpg: 6.9, cost: 236, efficiency: 'Good' }
];

const idleTimeAnalysis = [
  { vehicle: 'VH001', idleHours: 124, idleCost: 248, idlePercentage: 8.2, reduction: 'Medium' },
  { vehicle: 'VH002', idleHours: 156, idleCost: 312, idlePercentage: 10.4, reduction: 'High' },
  { vehicle: 'VH003', idleHours: 89, idleCost: 178, idlePercentage: 5.9, reduction: 'Low' },
  { vehicle: 'VH004', idleHours: 142, idleCost: 284, idlePercentage: 9.5, reduction: 'High' },
  { vehicle: 'VH005', idleHours: 118, idleCost: 236, idlePercentage: 7.8, reduction: 'Medium' },
  { vehicle: 'VH006', idleHours: 178, idleCost: 356, idlePercentage: 11.8, reduction: 'Critical' }
];

export default function FuelAnalysisReport({ isModal = true, onClose }: FuelAnalysisReportProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const downloadAsCSV = () => {
    try {
      const csvRows = [
        ['Fuel Analysis Report'],
        ['Report Period', 'January 2025 - July 2025'],
        ['Generated', new Date().toLocaleDateString()],
        ['Generated By', 'TMS Pro Analytics System'],
        [],
        ['Executive Summary'],
        ['Total Vehicles', vehicleFuelData.length],
        ['Total Fuel Cost', fuelMetrics[0].value],
        ['Fleet Average MPG', fuelMetrics[1].value],
        ['Total Carbon Emissions', fuelMetrics[2].value],
        ['Fuel Efficiency Score', fuelMetrics[3].value],
        [],
        ['Vehicle Fuel Performance'],
        ['Vehicle ID', 'Make', 'Model', 'Year', 'Total Miles', 'Fuel Consumed (gal)', 'Fuel Cost ($)', 'Avg MPG', 'Efficiency Rating', 'Carbon Emissions (tons)', 'Idle Time (hrs)', 'Avg Fuel Price', 'Fuel Stations', 'Maintenance Score'],
        ...vehicleFuelData.map(vehicle => [
          vehicle.vehicleId,
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.totalMiles,
          vehicle.fuelConsumed,
          vehicle.fuelCost,
          vehicle.avgMPG,
          vehicle.fuelEfficiencyRating,
          vehicle.carbonEmissions,
          vehicle.idleTime,
          vehicle.avgFuelPrice,
          vehicle.fuelStations,
          vehicle.maintenanceScore
        ]),
        [],
        ['Monthly Fuel Trends'],
        ['Month', 'Total Cost ($)', 'Gallons Consumed', 'Avg Price ($/gal)', 'Fleet Efficiency (MPG)', 'Carbon Emissions (tons)'],
        ...monthlyFuelTrends.map(row => [row.month, row.totalCost, row.gallons, row.avgPrice, row.efficiency, row.emissions]),
        [],
        ['Fuel Station Analysis'],
        ['Station', 'Visits', 'Avg Price ($/gal)', 'Total Spent ($)', 'Discount (%)'],
        ...fuelStationAnalysis.map(station => [station.station, station.visits, station.avgPrice, station.totalSpent, station.discount]),
        [],
        ['Route Efficiency Analysis'],
        ['Route', 'Distance (miles)', 'Fuel Used (gal)', 'MPG', 'Cost ($)', 'Efficiency Rating'],
        ...routeEfficiencyData.map(route => [route.route, route.distance, route.fuelUsed, route.mpg, route.cost, route.efficiency]),
        [],
        ['Idle Time Analysis'],
        ['Vehicle', 'Idle Hours', 'Idle Cost ($)', 'Idle Percentage (%)', 'Reduction Priority'],
        ...idleTimeAnalysis.map(idle => [idle.vehicle, idle.idleHours, idle.idleCost, idle.idlePercentage, idle.reduction])
      ];

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fuel-analysis-report-${new Date().toISOString().split('T')[0]}.csv`;
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
        title: 'Fuel Analysis Report - TMS Pro',
        text: 'Fuel Analysis Report generated by TMS Pro Analytics System. This report provides comprehensive fuel consumption analysis, efficiency metrics, cost optimization opportunities, and environmental impact assessment for fleet management.',
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
        reportType: 'Fuel Analysis Report',
        generatedDate: new Date().toISOString(),
        generatedBy: 'TMS Pro Analytics System',
        period: 'January 2025 - July 2025',
        version: '1.0.0',
        summary: {
          totalVehicles: vehicleFuelData.length,
          totalFuelCost: vehicleFuelData.reduce((sum, vehicle) => sum + vehicle.fuelCost, 0),
          totalGallonsConsumed: vehicleFuelData.reduce((sum, vehicle) => sum + vehicle.fuelConsumed, 0),
          totalMilesDriven: vehicleFuelData.reduce((sum, vehicle) => sum + vehicle.totalMiles, 0),
          fleetAverageMPG: vehicleFuelData.reduce((sum, vehicle) => sum + vehicle.avgMPG, 0) / vehicleFuelData.length,
          totalCarbonEmissions: vehicleFuelData.reduce((sum, vehicle) => sum + vehicle.carbonEmissions, 0),
          totalIdleTime: vehicleFuelData.reduce((sum, vehicle) => sum + vehicle.idleTime, 0),
          totalIdleCost: idleTimeAnalysis.reduce((sum, idle) => sum + idle.idleCost, 0),
          avgFuelPrice: 3.20,
          fuelEfficiencyScore: 78
        },
        vehicleFuelPerformance: vehicleFuelData.map(vehicle => ({
          ...vehicle,
          fuelCostPerMile: Math.round((vehicle.fuelCost / vehicle.totalMiles) * 100) / 100,
          fuelEfficiencyIndex: Math.round((vehicle.avgMPG / 8.0) * 100),
          carbonFootprintPerMile: Math.round((vehicle.carbonEmissions / vehicle.totalMiles) * 1000) / 1000,
          idleCostImpact: idleTimeAnalysis.find(idle => idle.vehicle === vehicle.vehicleId)?.idleCost || 0,
          optimizationPotential: vehicle.avgMPG < 7.0 ? 'High' : vehicle.avgMPG < 7.5 ? 'Medium' : 'Low'
        })),
        monthlyTrends: monthlyFuelTrends.map(month => ({
          ...month,
          costPerGallon: month.totalCost / month.gallons,
          costPerMile: Math.round((month.totalCost / (month.efficiency * month.gallons)) * 100) / 100,
          emissionsPerGallon: Math.round((month.emissions / month.gallons) * 100) / 100
        })),
        fuelStationAnalysis: fuelStationAnalysis.map(station => ({
          ...station,
          costEffectiveness: Math.round((100 - ((station.avgPrice - 3.18) / 3.18 * 100)) * 10) / 10,
          recommendationScore: Math.round((station.discount * 2 + (100 - ((station.avgPrice - 3.18) / 3.18 * 100))) * 10) / 10
        })),
        routeEfficiency: routeEfficiencyData.map(route => ({
          ...route,
          costPerMile: Math.round((route.cost / route.distance) * 100) / 100,
          fuelCostEfficiency: Math.round((route.mpg / (route.cost / route.distance)) * 100) / 100,
          optimizationScore: route.mpg > 7.0 ? 'Excellent' : route.mpg > 6.5 ? 'Good' : 'Needs Improvement'
        })),
        idleTimeAnalysis: idleTimeAnalysis.map(idle => ({
          ...idle,
          annualizedIdleCost: Math.round(idle.idleCost * 12),
          potentialSavings: Math.round(idle.idleCost * 0.3), // 30% reduction potential
          priorityScore: idle.idlePercentage > 10 ? 'Critical' : idle.idlePercentage > 8 ? 'High' : idle.idlePercentage > 6 ? 'Medium' : 'Low'
        })),
        insights: {
          topPerformer: vehicleFuelData.reduce((best, vehicle) => vehicle.avgMPG > best.avgMPG ? vehicle : best),
          worstPerformer: vehicleFuelData.reduce((worst, vehicle) => vehicle.avgMPG < worst.avgMPG ? vehicle : worst),
          mostEfficientRoute: routeEfficiencyData.reduce((best, route) => route.mpg > best.mpg ? route : best),
          highestIdleVehicle: idleTimeAnalysis.reduce((highest, idle) => idle.idlePercentage > highest.idlePercentage ? idle : highest),
          bestFuelStation: fuelStationAnalysis.reduce((best, station) => (station.avgPrice + (station.discount * -0.01)) < (best.avgPrice + (best.discount * -0.01)) ? station : best),
          fuelTrend: 'Fleet efficiency improved by 2.9% year-over-year',
          costTrend: 'Fuel costs increased 8.2% due to price volatility',
          emissionTrend: 'Carbon emissions reduced by 1.8% through efficiency improvements'
        },
        recommendations: [
          'Implement driver training program focusing on fuel-efficient driving techniques',
          'Reduce idle time for VH006 and VH002 to save $668 annually',
          'Prioritize Shell and Pilot stations for best fuel prices and discounts',
          'Consider route optimization for Route C-3 to improve 6.2 MPG efficiency',
          'Implement real-time fuel monitoring and driver feedback systems',
          'Schedule maintenance for vehicles with below-average efficiency ratings',
          'Negotiate corporate fuel discounts with preferred station networks'
        ],
        metadata: {
          totalDataPoints: vehicleFuelData.length + monthlyFuelTrends.length + fuelStationAnalysis.length + routeEfficiencyData.length,
          analysisDepth: 'Comprehensive',
          confidenceLevel: '95.8%',
          lastUpdated: new Date().toISOString(),
          fuelPriceSource: 'National Average Diesel Prices',
          emissionCalculationStandard: 'EPA SmartWay',
          potentialAnnualSavings: '$12,450 through optimization initiatives'
        }
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `fuel-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
      
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
            <h1 className="text-3xl font-bold text-gray-900">Fuel Analysis Report</h1>
            <p className="text-lg text-gray-600 mt-2">Comprehensive Fuel Consumption & Efficiency Analytics</p>
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500">
              <span>Report Period: January 2025 - July 2025</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>Generated By: TMS Pro Analytics System</span>
              <span>Report ID: FAR-2025-001</span>
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
          {fuelMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? (metric.metric.includes('Cost') ? 'text-red-600' : 'text-green-600') : 'text-green-600'}`}>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fuel Performance Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Fleet average improved to 7.0 MPG (+2.9% YoY)
                </li>
                <li className="flex items-center">
                  <FireIcon className="w-4 h-4 text-orange-500 mr-2" />
                  Total fuel cost: $115,766 (+8.2% due to price increases)
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Carbon emissions reduced by 1.8% through efficiency
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  $1,614 annual idle time cost across fleet
                </li>
                <li className="flex items-center">
                  <ChartBarIcon className="w-4 h-4 text-blue-500 mr-2" />
                  Fuel efficiency score: 78/100 (+5 points improvement)
                </li>
                <li className="flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-green-500 mr-2" />
                  Potential annual savings: $12,450 through optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Fuel Performance Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Fuel Performance</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Individual Vehicle Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg MPG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idle Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleFuelData.map((vehicle, index) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.totalMiles.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.fuelConsumed} gal</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vehicle.fuelCost.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${vehicle.avgMPG >= 7.5 ? 'text-green-600' : vehicle.avgMPG >= 7.0 ? 'text-blue-600' : vehicle.avgMPG >= 6.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {vehicle.avgMPG}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.fuelEfficiencyRating === 'Excellent' ? 'bg-green-100 text-green-800' :
                        vehicle.fuelEfficiencyRating === 'Good' ? 'bg-blue-100 text-blue-800' :
                        vehicle.fuelEfficiencyRating === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.fuelEfficiencyRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.carbonEmissions} tons</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.idleTime} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fuel Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Fuel Cost & Consumption Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyFuelTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="totalCost" fill="#3B82F6" name="Total Cost ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2} name="Efficiency (MPG)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Efficiency Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelEfficiencyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {fuelEfficiencyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, props.payload.category]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Station Cost Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fuelStationAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="station" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [name === 'avgPrice' ? `$${value}/gal` : `$${value}`, name === 'avgPrice' ? 'Avg Price' : 'Total Spent']} />
                  <Bar dataKey="totalSpent" fill="#8B5CF6" name="totalSpent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Carbon Emissions Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFuelTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} tons`, 'Carbon Emissions']} />
                  <Area type="monotone" dataKey="emissions" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Route Efficiency Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Efficiency Analysis</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Route Fuel Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MPG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routeEfficiencyData.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{route.route}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.distance} mi</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.fuelUsed} gal</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${route.mpg >= 7.0 ? 'text-green-600' : route.mpg >= 6.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {route.mpg}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${route.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.efficiency === 'Excellent' ? 'bg-green-100 text-green-800' :
                        route.efficiency === 'Good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {route.efficiency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Idle Time Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Idle Time Analysis</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Idle Time Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idle Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idle Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idle %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reduction Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {idleTimeAnalysis.map((idle, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{idle.vehicle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idle.idleHours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${idle.idleCost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${idle.idlePercentage >= 10 ? 'text-red-600' : idle.idlePercentage >= 8 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {idle.idlePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        idle.reduction === 'Critical' ? 'bg-red-100 text-red-800' :
                        idle.reduction === 'High' ? 'bg-yellow-100 text-yellow-800' :
                        idle.reduction === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {idle.reduction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimization Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Cost Optimization Opportunities
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Reduce idle time for VH006 and VH002 to save $668 annually</li>
              <li>• Prioritize Shell and Pilot stations for 4-5% fuel discounts</li>
              <li>• Implement driver training program for fuel-efficient techniques</li>
              <li>• Negotiate corporate discounts with preferred station networks</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <FireIcon className="w-5 h-5 mr-2" />
              Efficiency Improvements
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Optimize Route C-3 to improve from 6.2 MPG efficiency</li>
              <li>• Schedule maintenance for vehicles with Fair efficiency ratings</li>
              <li>• Implement real-time fuel monitoring and driver feedback</li>
              <li>• Consider route optimization software for better planning</li>
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
