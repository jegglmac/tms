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
  ShieldCheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentIcon,
  TableCellsIcon,
  CodeBracketIcon,
  TruckIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UserIcon,
  ScaleIcon
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
  RadialBarChart,
  RadialBar
} from 'recharts';

interface ComplianceStatusReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock compliance data
const complianceData = [
  {
    vehicleId: 'VH001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2022,
    dotInspection: '2024-11-15',
    dotExpiry: '2025-11-15',
    daysUntilExpiry: 127,
    registration: '2024-12-01',
    regExpiry: '2025-12-01',
    regDaysUntil: 143,
    insurance: '2024-10-20',
    insExpiry: '2025-10-20',
    insDaysUntil: 101,
    emissions: '2024-09-15',
    emissionsExpiry: '2025-09-15',
    emissionsDaysUntil: 66,
    overallStatus: 'Compliant',
    criticalIssues: 0
  },
  {
    vehicleId: 'VH002',
    make: 'Peterbilt',
    model: '579',
    year: 2021,
    dotInspection: '2024-08-10',
    dotExpiry: '2025-08-10',
    daysUntilExpiry: 29,
    registration: '2024-11-20',
    regExpiry: '2025-11-20',
    regDaysUntil: 132,
    insurance: '2024-12-15',
    insExpiry: '2025-12-15',
    insDaysUntil: 157,
    emissions: '2024-07-20',
    emissionsExpiry: '2025-07-20',
    emissionsDaysUntil: 9,
    overallStatus: 'Warning',
    criticalIssues: 2
  },
  {
    vehicleId: 'VH003',
    make: 'Kenworth',
    model: 'T680',
    year: 2023,
    dotInspection: '2024-12-05',
    dotExpiry: '2025-12-05',
    daysUntilExpiry: 147,
    registration: '2024-10-15',
    regExpiry: '2025-10-15',
    regDaysUntil: 96,
    insurance: '2024-11-30',
    insExpiry: '2025-11-30',
    insDaysUntil: 142,
    emissions: '2024-06-30',
    emissionsExpiry: '2025-06-30',
    emissionsDaysUntil: -12,
    overallStatus: 'Non-Compliant',
    criticalIssues: 1
  },
  {
    vehicleId: 'VH004',
    make: 'Volvo',
    model: 'VNL',
    year: 2020,
    dotInspection: '2024-10-25',
    dotExpiry: '2025-10-25',
    daysUntilExpiry: 106,
    registration: '2024-11-10',
    regExpiry: '2025-11-10',
    regDaysUntil: 122,
    insurance: '2024-12-20',
    insExpiry: '2025-12-20',
    insDaysUntil: 162,
    emissions: '2024-09-05',
    emissionsExpiry: '2025-09-05',
    emissionsDaysUntil: 56,
    overallStatus: 'Compliant',
    criticalIssues: 0
  },
  {
    vehicleId: 'VH005',
    make: 'Mack',
    model: 'Anthem',
    year: 2022,
    dotInspection: '2024-11-01',
    dotExpiry: '2025-11-01',
    daysUntilExpiry: 113,
    registration: '2024-12-10',
    regExpiry: '2025-12-10',
    regDaysUntil: 152,
    insurance: '2024-10-30',
    insExpiry: '2025-10-30',
    insDaysUntil: 111,
    emissions: '2024-08-20',
    emissionsExpiry: '2025-08-20',
    emissionsDaysUntil: 40,
    overallStatus: 'Compliant',
    criticalIssues: 0
  },
  {
    vehicleId: 'VH006',
    make: 'International',
    model: 'LT Series',
    year: 2021,
    dotInspection: '2024-07-15',
    dotExpiry: '2025-07-15',
    daysUntilExpiry: 4,
    registration: '2024-11-25',
    regExpiry: '2025-11-25',
    regDaysUntil: 137,
    insurance: '2024-12-01',
    insExpiry: '2025-12-01',
    insDaysUntil: 143,
    emissions: '2024-10-10',
    emissionsExpiry: '2025-10-10',
    emissionsDaysUntil: 91,
    overallStatus: 'Critical',
    criticalIssues: 1
  }
];

const driverComplianceData = [
  {
    driverId: 'DRV001',
    name: 'John Martinez',
    cdlExpiry: '2026-03-15',
    cdlDaysUntil: 247,
    medicalExpiry: '2025-09-20',
    medicalDaysUntil: 71,
    hazmatExpiry: '2025-12-10',
    hazmatDaysUntil: 152,
    backgroundCheck: '2024-06-01',
    backgroundDaysUntil: 330,
    trainingStatus: 'Complete',
    overallStatus: 'Compliant',
    violations: 0
  },
  {
    driverId: 'DRV002',
    name: 'Sarah Chen',
    cdlExpiry: '2025-11-30',
    cdlDaysUntil: 142,
    medicalExpiry: '2025-08-15',
    medicalDaysUntil: 35,
    hazmatExpiry: '2026-01-20',
    hazmatDaysUntil: 193,
    backgroundCheck: '2024-04-15',
    backgroundDaysUntil: 283,
    trainingStatus: 'Complete',
    overallStatus: 'Warning',
    violations: 1
  },
  {
    driverId: 'DRV003',
    name: 'Michael Rodriguez',
    cdlExpiry: '2026-01-10',
    cdlDaysUntil: 183,
    medicalExpiry: '2025-07-25',
    medicalDaysUntil: 14,
    hazmatExpiry: 'N/A',
    hazmatDaysUntil: 0,
    backgroundCheck: '2024-05-20',
    backgroundDaysUntil: 318,
    trainingStatus: 'Pending',
    overallStatus: 'Warning',
    violations: 2
  },
  {
    driverId: 'DRV004',
    name: 'Emily Johnson',
    cdlExpiry: '2026-05-20',
    cdlDaysUntil: 313,
    medicalExpiry: '2025-10-30',
    medicalDaysUntil: 111,
    hazmatExpiry: '2025-08-30',
    hazmatDaysUntil: 50,
    backgroundCheck: '2024-07-01',
    backgroundDaysUntil: 355,
    trainingStatus: 'Complete',
    overallStatus: 'Compliant',
    violations: 0
  }
];

const complianceMetrics = [
  { metric: 'Fleet Compliance Rate', value: '67%', change: '-16%', trend: 'down' },
  { metric: 'Critical Issues', value: '3', change: '+50%', trend: 'up' },
  { metric: 'Expiring Certifications', value: '8', change: '+33%', trend: 'up' },
  { metric: 'Driver Compliance Rate', value: '75%', change: '-12%', trend: 'down' }
];

const complianceStatusDistribution = [
  { status: 'Compliant', count: 3, percentage: 50, color: '#10B981' },
  { status: 'Warning', count: 1, percentage: 16.7, color: '#F59E0B' },
  { status: 'Critical', count: 1, percentage: 16.7, color: '#EF4444' },
  { status: 'Non-Compliant', count: 1, percentage: 16.7, color: '#7C2D12' }
];

const expirationTrends = [
  { month: 'Jan', expiring: 2, expired: 0, total: 24 },
  { month: 'Feb', expiring: 3, expired: 1, total: 24 },
  { month: 'Mar', expiring: 1, expired: 0, total: 24 },
  { month: 'Apr', expiring: 4, expired: 2, total: 24 },
  { month: 'May', expiring: 2, expired: 1, total: 24 },
  { month: 'Jun', expiring: 5, expired: 1, total: 24 },
  { month: 'Jul', expiring: 8, expired: 0, total: 24 },
  { month: 'Aug', expiring: 3, expired: 1, total: 24 },
  { month: 'Sep', expiring: 6, expired: 2, total: 24 },
  { month: 'Oct', expiring: 4, expired: 0, total: 24 },
  { month: 'Nov', expiring: 7, expired: 3, total: 24 },
  { month: 'Dec', expiring: 5, expired: 1, total: 24 }
];

const certificationTypes = [
  { type: 'DOT Inspection', count: 6, compliant: 5, color: '#3B82F6' },
  { type: 'Vehicle Registration', count: 6, compliant: 6, color: '#10B981' },
  { type: 'Insurance', count: 6, compliant: 6, color: '#8B5CF6' },
  { type: 'Emissions', count: 6, compliant: 4, color: '#F59E0B' },
  { type: 'CDL License', count: 4, compliant: 4, color: '#EF4444' },
  { type: 'Medical Certificate', count: 4, compliant: 3, color: '#06B6D4' }
];

export default function ComplianceStatusReport({ isModal = true, onClose }: ComplianceStatusReportProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const downloadAsCSV = () => {
    try {
      const csvRows = [
        ['Compliance Status Report'],
        ['Report Period', 'Current Status as of July 2025'],
        ['Generated', new Date().toLocaleDateString()],
        ['Generated By', 'TMS Pro Analytics System'],
        [],
        ['Executive Summary'],
        ['Total Vehicles', complianceData.length],
        ['Fleet Compliance Rate', complianceMetrics[0].value],
        ['Critical Issues', complianceMetrics[1].value],
        ['Expiring Certifications', complianceMetrics[2].value],
        ['Driver Compliance Rate', complianceMetrics[3].value],
        [],
        ['Vehicle Compliance Status'],
        ['Vehicle ID', 'Make', 'Model', 'Year', 'DOT Inspection', 'DOT Expiry', 'Days Until DOT', 'Registration', 'Reg Expiry', 'Days Until Reg', 'Insurance', 'Ins Expiry', 'Days Until Ins', 'Emissions', 'Emissions Expiry', 'Days Until Emissions', 'Overall Status', 'Critical Issues'],
        ...complianceData.map(vehicle => [
          vehicle.vehicleId,
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.dotInspection,
          vehicle.dotExpiry,
          vehicle.daysUntilExpiry,
          vehicle.registration,
          vehicle.regExpiry,
          vehicle.regDaysUntil,
          vehicle.insurance,
          vehicle.insExpiry,
          vehicle.insDaysUntil,
          vehicle.emissions,
          vehicle.emissionsExpiry,
          vehicle.emissionsDaysUntil,
          vehicle.overallStatus,
          vehicle.criticalIssues
        ]),
        [],
        ['Driver Compliance Status'],
        ['Driver ID', 'Name', 'CDL Expiry', 'Days Until CDL', 'Medical Expiry', 'Days Until Medical', 'HAZMAT Expiry', 'Days Until HAZMAT', 'Background Check', 'Days Until Background', 'Training Status', 'Overall Status', 'Violations'],
        ...driverComplianceData.map(driver => [
          driver.driverId,
          driver.name,
          driver.cdlExpiry,
          driver.cdlDaysUntil,
          driver.medicalExpiry,
          driver.medicalDaysUntil,
          driver.hazmatExpiry,
          driver.hazmatDaysUntil,
          driver.backgroundCheck,
          driver.backgroundDaysUntil,
          driver.trainingStatus,
          driver.overallStatus,
          driver.violations
        ]),
        [],
        ['Compliance Status Distribution'],
        ['Status', 'Count', 'Percentage %'],
        ...complianceStatusDistribution.map(status => [status.status, status.count, status.percentage]),
        [],
        ['Certification Types Compliance'],
        ['Certification Type', 'Total Count', 'Compliant Count', 'Compliance Rate %'],
        ...certificationTypes.map(cert => [cert.type, cert.count, cert.compliant, Math.round((cert.compliant / cert.count) * 100)])
      ];

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compliance-status-report-${new Date().toISOString().split('T')[0]}.csv`;
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
        title: 'Compliance Status Report - TMS Pro',
        text: 'Compliance Status Report generated by TMS Pro Analytics System. This report provides comprehensive compliance tracking for vehicles and drivers, including certifications, inspections, and regulatory requirements.',
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
        reportType: 'Compliance Status Report',
        generatedDate: new Date().toISOString(),
        generatedBy: 'TMS Pro Analytics System',
        period: 'Current Status as of July 2025',
        version: '1.0.0',
        summary: {
          totalVehicles: complianceData.length,
          totalDrivers: driverComplianceData.length,
          fleetComplianceRate: complianceMetrics[0].value,
          driverComplianceRate: complianceMetrics[3].value,
          criticalIssues: parseInt(complianceMetrics[1].value),
          expiringCertifications: parseInt(complianceMetrics[2].value),
          compliantVehicles: complianceData.filter(v => v.overallStatus === 'Compliant').length,
          nonCompliantVehicles: complianceData.filter(v => v.overallStatus !== 'Compliant').length,
          compliantDrivers: driverComplianceData.filter(d => d.overallStatus === 'Compliant').length
        },
        vehicleCompliance: complianceData.map(vehicle => ({
          ...vehicle,
          complianceScore: Math.round(((vehicle.daysUntilExpiry > 30 ? 1 : 0) + 
                                     (vehicle.regDaysUntil > 30 ? 1 : 0) + 
                                     (vehicle.insDaysUntil > 30 ? 1 : 0) + 
                                     (vehicle.emissionsDaysUntil > 0 ? 1 : 0)) / 4 * 100),
          urgentActions: [
            ...(vehicle.daysUntilExpiry <= 30 ? ['DOT Inspection due soon'] : []),
            ...(vehicle.regDaysUntil <= 30 ? ['Registration renewal required'] : []),
            ...(vehicle.insDaysUntil <= 30 ? ['Insurance renewal needed'] : []),
            ...(vehicle.emissionsDaysUntil <= 0 ? ['Emissions testing overdue'] : [])
          ]
        })),
        driverCompliance: driverComplianceData.map(driver => ({
          ...driver,
          complianceScore: Math.round(((driver.cdlDaysUntil > 30 ? 1 : 0) + 
                                     (driver.medicalDaysUntil > 0 ? 1 : 0) + 
                                     (driver.hazmatDaysUntil > 0 || driver.hazmatExpiry === 'N/A' ? 1 : 0) + 
                                     (driver.backgroundDaysUntil > 0 ? 1 : 0)) / 4 * 100),
          urgentActions: [
            ...(driver.cdlDaysUntil <= 30 ? ['CDL renewal required'] : []),
            ...(driver.medicalDaysUntil <= 30 ? ['Medical certificate renewal needed'] : []),
            ...(driver.hazmatDaysUntil <= 30 && driver.hazmatExpiry !== 'N/A' ? ['HAZMAT certification renewal'] : []),
            ...(driver.trainingStatus === 'Pending' ? ['Complete required training'] : [])
          ]
        })),
        complianceStatusDistribution: complianceStatusDistribution,
        expirationTrends: expirationTrends,
        certificationTypes: certificationTypes.map(cert => ({
          ...cert,
          complianceRate: Math.round((cert.compliant / cert.count) * 100)
        })),
        insights: {
          criticalFindings: [
            'VH003 emissions testing is 12 days overdue',
            'VH006 DOT inspection expires in 4 days',
            'Michael Rodriguez medical certificate expires in 14 days',
            'Sarah Chen medical certificate expires in 35 days'
          ],
          complianceTrend: 'Fleet compliance rate decreased by 16% from previous period',
          riskAssessment: 'Medium risk - multiple certifications expiring within 30 days',
          costImplications: 'Estimated $15,000 in potential fines if issues not addressed'
        },
        recommendations: [
          'Immediately schedule emissions testing for VH003',
          'Schedule DOT inspection for VH006 within 3 days',
          'Set up automated compliance reminder system',
          'Implement 60-day advance notification for all certifications',
          'Conduct quarterly compliance audits',
          'Establish preferred vendor relationships for certifications'
        ],
        metadata: {
          totalDataPoints: complianceData.length + driverComplianceData.length + certificationTypes.length,
          analysisDepth: 'Comprehensive',
          confidenceLevel: '98.5%',
          lastUpdated: new Date().toISOString(),
          complianceFramework: 'DOT/FMCSA Standards',
          auditTrail: 'Full audit trail maintained for all compliance records'
        }
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `compliance-status-report-${new Date().toISOString().split('T')[0]}.json`;
      
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
            <h1 className="text-3xl font-bold text-gray-900">Compliance Status Report</h1>
            <p className="text-lg text-gray-600 mt-2">Regulatory Compliance & Certification Tracking</p>
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500">
              <span>Report Period: Current Status as of July 2025</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>Generated By: TMS Pro Analytics System</span>
              <span>Report ID: CSR-2025-001</span>
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
          {complianceMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? 'text-red-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-2" />
                  3 vehicles with critical compliance issues
                </li>
                <li className="flex items-center">
                  <ClockIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  8 certifications expiring within 60 days
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  50% of fleet in full compliance
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <ScaleIcon className="w-4 h-4 text-blue-500 mr-2" />
                  DOT/FMCSA regulatory framework compliance
                </li>
                <li className="flex items-center">
                  <DocumentTextIcon className="w-4 h-4 text-purple-500 mr-2" />
                  Full audit trail maintained for all records
                </li>
                <li className="flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 text-orange-500 mr-2" />
                  Estimated $15,000 potential fines if unaddressed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Compliance Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Compliance Status</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Fleet Certification Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOT Inspection</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complianceData.map((vehicle, index) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.dotExpiry}</div>
                      <div className={`text-xs ${vehicle.daysUntilExpiry <= 30 ? 'text-red-600' : vehicle.daysUntilExpiry <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {vehicle.daysUntilExpiry <= 0 ? `${Math.abs(vehicle.daysUntilExpiry)} days overdue` : `${vehicle.daysUntilExpiry} days left`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.regExpiry}</div>
                      <div className={`text-xs ${vehicle.regDaysUntil <= 30 ? 'text-red-600' : vehicle.regDaysUntil <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {vehicle.regDaysUntil} days left
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.insExpiry}</div>
                      <div className={`text-xs ${vehicle.insDaysUntil <= 30 ? 'text-red-600' : vehicle.insDaysUntil <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {vehicle.insDaysUntil} days left
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.emissionsExpiry}</div>
                      <div className={`text-xs ${vehicle.emissionsDaysUntil <= 0 ? 'text-red-600' : vehicle.emissionsDaysUntil <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {vehicle.emissionsDaysUntil <= 0 ? `${Math.abs(vehicle.emissionsDaysUntil)} days overdue` : `${vehicle.emissionsDaysUntil} days left`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.overallStatus === 'Compliant' ? 'bg-green-100 text-green-800' :
                        vehicle.overallStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                        vehicle.overallStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.overallStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${vehicle.criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {vehicle.criticalIssues}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Driver Compliance Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Driver Compliance Status</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Driver Certification Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CDL License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Cert</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HAZMAT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {driverComplianceData.map((driver, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.driverId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.cdlExpiry}</div>
                      <div className={`text-xs ${driver.cdlDaysUntil <= 30 ? 'text-red-600' : driver.cdlDaysUntil <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {driver.cdlDaysUntil} days left
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.medicalExpiry}</div>
                      <div className={`text-xs ${driver.medicalDaysUntil <= 30 ? 'text-red-600' : driver.medicalDaysUntil <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {driver.medicalDaysUntil} days left
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.hazmatExpiry}</div>
                      {driver.hazmatExpiry !== 'N/A' && (
                        <div className={`text-xs ${driver.hazmatDaysUntil <= 30 ? 'text-red-600' : driver.hazmatDaysUntil <= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {driver.hazmatDaysUntil} days left
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        driver.trainingStatus === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.trainingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        driver.overallStatus === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.overallStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${driver.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {driver.violations}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {complianceStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification Compliance Rates</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={certificationTypes} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="type" type="category" width={120} />
                  <Tooltip formatter={(value) => [`${value}`, 'Compliant Certifications']} />
                  <Bar dataKey="compliant" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expiration Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expirationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="expiring" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Expiring" />
                <Area type="monotone" dataKey="expired" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Expired" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Critical Actions Required</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Immediate Actions
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li>• VH003 emissions testing is 12 days overdue - schedule immediately</li>
              <li>• VH006 DOT inspection expires in 4 days - urgent scheduling required</li>
              <li>• Michael Rodriguez medical certificate expires in 14 days</li>
              <li>• Sarah Chen medical certificate expires in 35 days</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Preventive Measures
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Set up automated 60-day advance notifications</li>
              <li>• Implement quarterly compliance audits</li>
              <li>• Establish preferred vendor relationships</li>
              <li>• Create compliance dashboard for real-time monitoring</li>
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
