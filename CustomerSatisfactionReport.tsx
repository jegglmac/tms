'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  DocumentIcon,
  TableCellsIcon,
  CodeBracketIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon,
  CalendarDaysIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
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
  ComposedChart,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface CustomerSatisfactionReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock customer satisfaction data
const customerFeedbackData = [
  {
    customerId: 'CUST001',
    customerName: 'ABC Manufacturing',
    shipmentId: 'SH-2025-001',
    rating: 5,
    deliveryRating: 5,
    communicationRating: 4,
    driverRating: 5,
    overallSatisfaction: 4.7,
    feedback: 'Excellent service! Driver was professional and delivery was on time.',
    responseDate: '2025-07-10',
    category: 'Excellent',
    issueResolved: true,
    responseTime: 2,
    npsScore: 9,
    repeatCustomer: true,
    serviceType: 'Standard Delivery'
  },
  {
    customerId: 'CUST002',
    customerName: 'XYZ Logistics',
    shipmentId: 'SH-2025-002',
    rating: 3,
    deliveryRating: 2,
    communicationRating: 4,
    driverRating: 4,
    overallSatisfaction: 3.2,
    feedback: 'Delivery was delayed by 2 hours. Better communication needed.',
    responseDate: '2025-07-09',
    category: 'Fair',
    issueResolved: true,
    responseTime: 24,
    npsScore: 6,
    repeatCustomer: true,
    serviceType: 'Express Delivery'
  },
  {
    customerId: 'CUST003',
    customerName: 'Global Supply Co',
    shipmentId: 'SH-2025-003',
    rating: 4,
    deliveryRating: 4,
    communicationRating: 5,
    driverRating: 4,
    overallSatisfaction: 4.2,
    feedback: 'Good service overall. Driver was courteous and helpful.',
    responseDate: '2025-07-08',
    category: 'Good',
    issueResolved: true,
    responseTime: 4,
    npsScore: 8,
    repeatCustomer: false,
    serviceType: 'Standard Delivery'
  },
  {
    customerId: 'CUST004',
    customerName: 'Tech Solutions Inc',
    shipmentId: 'SH-2025-004',
    rating: 2,
    deliveryRating: 2,
    communicationRating: 3,
    driverRating: 3,
    overallSatisfaction: 2.5,
    feedback: 'Package was damaged during transport. Need better handling.',
    responseDate: '2025-07-07',
    category: 'Poor',
    issueResolved: false,
    responseTime: 48,
    npsScore: 4,
    repeatCustomer: true,
    serviceType: 'Fragile Handling'
  },
  {
    customerId: 'CUST005',
    customerName: 'Retail Partners Ltd',
    shipmentId: 'SH-2025-005',
    rating: 5,
    deliveryRating: 5,
    communicationRating: 5,
    driverRating: 5,
    overallSatisfaction: 5.0,
    feedback: 'Outstanding service! Everything was perfect from start to finish.',
    responseDate: '2025-07-06',
    category: 'Excellent',
    issueResolved: true,
    responseTime: 1,
    npsScore: 10,
    repeatCustomer: true,
    serviceType: 'Premium Service'
  },
  {
    customerId: 'CUST006',
    customerName: 'Industrial Corp',
    shipmentId: 'SH-2025-006',
    rating: 4,
    deliveryRating: 4,
    communicationRating: 3,
    driverRating: 4,
    overallSatisfaction: 3.8,
    feedback: 'Delivery was good but could improve communication updates.',
    responseDate: '2025-07-05',
    category: 'Good',
    issueResolved: true,
    responseTime: 6,
    npsScore: 7,
    repeatCustomer: false,
    serviceType: 'Standard Delivery'
  }
];

const satisfactionTrends = [
  { month: 'Jan', avgRating: 4.2, npsScore: 72, responseTime: 18, issueResolution: 85 },
  { month: 'Feb', avgRating: 4.3, npsScore: 74, responseTime: 16, issueResolution: 87 },
  { month: 'Mar', avgRating: 4.1, npsScore: 69, responseTime: 20, issueResolution: 83 },
  { month: 'Apr', avgRating: 4.4, npsScore: 76, responseTime: 14, issueResolution: 89 },
  { month: 'May', avgRating: 4.5, npsScore: 78, responseTime: 12, issueResolution: 91 },
  { month: 'Jun', avgRating: 4.3, npsScore: 75, responseTime: 15, issueResolution: 88 },
  { month: 'Jul', avgRating: 4.0, npsScore: 71, responseTime: 17, issueResolution: 84 }
];

const satisfactionDistribution = [
  { category: 'Excellent (4.5-5.0)', count: 2, percentage: 33.3, color: '#10B981' },
  { category: 'Good (3.5-4.4)', count: 2, percentage: 33.3, color: '#3B82F6' },
  { category: 'Fair (2.5-3.4)', count: 1, percentage: 16.7, color: '#F59E0B' },
  { category: 'Poor (1.0-2.4)', count: 1, percentage: 16.7, color: '#EF4444' }
];

const serviceTypeAnalysis = [
  { service: 'Standard Delivery', avgRating: 4.3, totalFeedback: 3, satisfaction: 86 },
  { service: 'Express Delivery', avgRating: 3.2, totalFeedback: 1, satisfaction: 64 },
  { service: 'Premium Service', avgRating: 5.0, totalFeedback: 1, satisfaction: 100 },
  { service: 'Fragile Handling', avgRating: 2.5, totalFeedback: 1, satisfaction: 50 }
];

const npsAnalysis = [
  { category: 'Promoters (9-10)', count: 2, percentage: 33.3, color: '#10B981' },
  { category: 'Passives (7-8)', count: 2, percentage: 33.3, color: '#F59E0B' },
  { category: 'Detractors (0-6)', count: 2, percentage: 33.3, color: '#EF4444' }
];

const satisfactionMetrics = [
  { metric: 'Average Rating', value: '4.0/5.0', change: '-2.4%', trend: 'down' },
  { metric: 'NPS Score', value: '71', change: '-4 points', trend: 'down' },
  { metric: 'Response Time', value: '17 hours', change: '+13%', trend: 'up' },
  { metric: 'Issue Resolution', value: '84%', change: '-5%', trend: 'down' }
];

const commonIssues = [
  { issue: 'Delivery Delays', frequency: 28, impact: 'High', resolution: 'Schedule optimization' },
  { issue: 'Communication Gaps', frequency: 22, impact: 'Medium', resolution: 'Automated updates' },
  { issue: 'Package Damage', frequency: 15, impact: 'High', resolution: 'Improved handling' },
  { issue: 'Driver Behavior', frequency: 8, impact: 'Low', resolution: 'Training programs' },
  { issue: 'Billing Issues', frequency: 12, impact: 'Medium', resolution: 'System automation' }
];

export default function CustomerSatisfactionReport({ isModal = true, onClose }: CustomerSatisfactionReportProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const downloadAsCSV = () => {
    try {
      const csvRows = [
        ['Customer Satisfaction Report'],
        ['Report Period', 'January 2025 - July 2025'],
        ['Generated', new Date().toLocaleDateString()],
        ['Generated By', 'TMS Pro Analytics System'],
        [],
        ['Executive Summary'],
        ['Total Responses', customerFeedbackData.length],
        ['Average Rating', satisfactionMetrics[0].value],
        ['NPS Score', satisfactionMetrics[1].value],
        ['Avg Response Time', satisfactionMetrics[2].value],
        ['Issue Resolution Rate', satisfactionMetrics[3].value],
        [],
        ['Customer Feedback Data'],
        ['Customer ID', 'Customer Name', 'Shipment ID', 'Overall Rating', 'Delivery Rating', 'Communication Rating', 'Driver Rating', 'Overall Satisfaction', 'NPS Score', 'Category', 'Service Type', 'Issue Resolved', 'Response Time (hrs)', 'Repeat Customer', 'Feedback'],
        ...customerFeedbackData.map(feedback => [
          feedback.customerId,
          feedback.customerName,
          feedback.shipmentId,
          feedback.rating,
          feedback.deliveryRating,
          feedback.communicationRating,
          feedback.driverRating,
          feedback.overallSatisfaction,
          feedback.npsScore,
          feedback.category,
          feedback.serviceType,
          feedback.issueResolved ? 'Yes' : 'No',
          feedback.responseTime,
          feedback.repeatCustomer ? 'Yes' : 'No',
          feedback.feedback
        ]),
        [],
        ['Monthly Satisfaction Trends'],
        ['Month', 'Avg Rating', 'NPS Score', 'Response Time (hrs)', 'Issue Resolution (%)'],
        ...satisfactionTrends.map(row => [row.month, row.avgRating, row.npsScore, row.responseTime, row.issueResolution]),
        [],
        ['Service Type Analysis'],
        ['Service Type', 'Avg Rating', 'Total Feedback', 'Satisfaction (%)'],
        ...serviceTypeAnalysis.map(service => [service.service, service.avgRating, service.totalFeedback, service.satisfaction]),
        [],
        ['Common Issues Analysis'],
        ['Issue', 'Frequency', 'Impact Level', 'Recommended Resolution'],
        ...commonIssues.map(issue => [issue.issue, issue.frequency, issue.impact, issue.resolution]),
        [],
        ['NPS Distribution'],
        ['Category', 'Count', 'Percentage (%)'],
        ...npsAnalysis.map(nps => [nps.category, nps.count, nps.percentage])
      ];

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customer-satisfaction-report-${new Date().toISOString().split('T')[0]}.csv`;
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
        title: 'Customer Satisfaction Report - TMS Pro',
        text: 'Customer Satisfaction Report generated by TMS Pro Analytics System. This report provides comprehensive customer feedback analysis, NPS scoring, service quality metrics, and improvement recommendations for enhanced customer experience.',
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
        reportType: 'Customer Satisfaction Report',
        generatedDate: new Date().toISOString(),
        generatedBy: 'TMS Pro Analytics System',
        period: 'January 2025 - July 2025',
        version: '1.0.0',
        summary: {
          totalResponses: customerFeedbackData.length,
          averageRating: customerFeedbackData.reduce((sum, feedback) => sum + feedback.rating, 0) / customerFeedbackData.length,
          overallSatisfaction: customerFeedbackData.reduce((sum, feedback) => sum + feedback.overallSatisfaction, 0) / customerFeedbackData.length,
          npsScore: 71,
          averageResponseTime: customerFeedbackData.reduce((sum, feedback) => sum + feedback.responseTime, 0) / customerFeedbackData.length,
          issueResolutionRate: (customerFeedbackData.filter(feedback => feedback.issueResolved).length / customerFeedbackData.length) * 100,
          repeatCustomerRate: (customerFeedbackData.filter(feedback => feedback.repeatCustomer).length / customerFeedbackData.length) * 100,
          promotersCount: customerFeedbackData.filter(feedback => feedback.npsScore >= 9).length,
          passivesCount: customerFeedbackData.filter(feedback => feedback.npsScore >= 7 && feedback.npsScore <= 8).length,
          detractorsCount: customerFeedbackData.filter(feedback => feedback.npsScore <= 6).length
        },
        customerFeedback: customerFeedbackData.map(feedback => ({
          ...feedback,
          satisfactionLevel: feedback.overallSatisfaction >= 4.5 ? 'Excellent' : 
                           feedback.overallSatisfaction >= 3.5 ? 'Good' : 
                           feedback.overallSatisfaction >= 2.5 ? 'Fair' : 'Poor',
          npsCategory: feedback.npsScore >= 9 ? 'Promoter' : 
                      feedback.npsScore >= 7 ? 'Passive' : 'Detractor',
          urgencyLevel: feedback.rating <= 2 ? 'Critical' : 
                       feedback.rating <= 3 ? 'High' : 
                       feedback.rating <= 4 ? 'Medium' : 'Low',
          followUpRequired: !feedback.issueResolved || feedback.rating <= 3,
          customerRetentionRisk: feedback.npsScore <= 6 ? 'High' : 
                               feedback.npsScore <= 7 ? 'Medium' : 'Low'
        })),
        monthlyTrends: satisfactionTrends.map(month => ({
          ...month,
          satisfactionTrend: month.avgRating >= 4.5 ? 'Excellent' : 
                           month.avgRating >= 4.0 ? 'Good' : 
                           month.avgRating >= 3.5 ? 'Fair' : 'Poor',
          npsCategory: month.npsScore >= 70 ? 'Excellent' : 
                      month.npsScore >= 50 ? 'Good' : 
                      month.npsScore >= 30 ? 'Fair' : 'Poor',
          responseEfficiency: month.responseTime <= 12 ? 'Excellent' : 
                            month.responseTime <= 24 ? 'Good' : 
                            month.responseTime <= 48 ? 'Fair' : 'Poor'
        })),
        serviceTypeAnalysis: serviceTypeAnalysis.map(service => ({
          ...service,
          performanceLevel: service.satisfaction >= 90 ? 'Excellent' : 
                           service.satisfaction >= 80 ? 'Good' : 
                           service.satisfaction >= 70 ? 'Fair' : 'Poor',
          improvementPotential: service.satisfaction < 80 ? 'High' : 
                               service.satisfaction < 90 ? 'Medium' : 'Low',
          customerRetentionScore: Math.round((service.avgRating / 5) * 100)
        })),
        commonIssues: commonIssues.map(issue => ({
          ...issue,
          priorityLevel: issue.impact === 'High' && issue.frequency > 20 ? 'Critical' : 
                        issue.impact === 'High' || issue.frequency > 15 ? 'High' : 
                        issue.impact === 'Medium' || issue.frequency > 10 ? 'Medium' : 'Low',
          estimatedImpact: issue.frequency * (issue.impact === 'High' ? 3 : issue.impact === 'Medium' ? 2 : 1),
          resolutionTimeframe: issue.impact === 'High' ? 'Immediate' : 
                              issue.impact === 'Medium' ? '1-2 weeks' : '1 month'
        })),
        insights: {
          topPerformingService: serviceTypeAnalysis.reduce((best, service) => service.satisfaction > best.satisfaction ? service : best),
          mostCriticalIssue: commonIssues.reduce((critical, issue) => issue.frequency > critical.frequency ? issue : critical),
          bestMonth: satisfactionTrends.reduce((best, month) => month.avgRating > best.avgRating ? month : best),
          worstMonth: satisfactionTrends.reduce((worst, month) => month.avgRating < worst.avgRating ? month : worst),
          satisfactionTrend: 'Customer satisfaction decreased by 2.4% in recent period',
          npsTrend: 'NPS score declined by 4 points, indicating need for improvement',
          responseTimeTrend: 'Response time increased by 13%, impacting customer experience',
          resolutionTrend: 'Issue resolution rate decreased by 5%, requiring process optimization'
        },
        recommendations: [
          'Implement proactive communication system for delivery updates',
          'Enhance driver training programs focusing on customer service',
          'Develop automated response system to reduce response times',
          'Create customer feedback follow-up process for low ratings',
          'Establish service recovery protocols for delayed deliveries',
          'Implement quality control measures for package handling',
          'Develop customer retention program for at-risk accounts'
        ],
        metadata: {
          totalDataPoints: customerFeedbackData.length + satisfactionTrends.length + serviceTypeAnalysis.length + commonIssues.length,
          analysisDepth: 'Comprehensive',
          confidenceLevel: '92.5%',
          lastUpdated: new Date().toISOString(),
          feedbackCollectionMethod: 'Post-delivery surveys and customer interviews',
          responseRate: '78%',
          targetSatisfactionScore: '4.5/5.0',
          targetNPSScore: '80+',
          estimatedRevenueImpact: '$125,000 potential loss from unsatisfied customers'
        }
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `customer-satisfaction-report-${new Date().toISOString().split('T')[0]}.json`;
      
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const reportContent = (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Satisfaction Report</h1>
            <p className="text-lg text-gray-600 mt-2">Customer Feedback Analysis & Service Quality Metrics</p>
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500">
              <span>Report Period: January 2025 - July 2025</span>
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
          {satisfactionMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? (metric.metric.includes('Response Time') ? 'text-red-600' : 'text-green-600') : 'text-red-600'}`}>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Satisfaction Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <FaceSmileIcon className="w-4 h-4 text-green-500 mr-2" />
                  33% of customers are promoters (NPS 9-10)
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-blue-500 mr-2" />
                  84% issue resolution rate maintained
                </li>
                <li className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  Premium Service maintains perfect 5.0 rating
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-2" />
                  Delivery delays are the top customer concern
                </li>
                <li className="flex items-center">
                  <ClockIcon className="w-4 h-4 text-orange-500 mr-2" />
                  Response time increased to 17 hours average
                </li>
                <li className="flex items-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-purple-500 mr-2" />
                  Communication gaps need immediate attention
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Feedback Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Feedback Details</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Customer Responses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerFeedbackData.map((feedback, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{feedback.customerName}</div>
                          <div className="text-sm text-gray-500">{feedback.customerId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-900">{feedback.overallSatisfaction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${feedback.npsScore >= 9 ? 'text-green-600' : feedback.npsScore >= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {feedback.npsScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.serviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        feedback.category === 'Excellent' ? 'bg-green-100 text-green-800' :
                        feedback.category === 'Good' ? 'bg-blue-100 text-blue-800' :
                        feedback.category === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {feedback.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={feedback.feedback}>
                        {feedback.feedback}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Response: {feedback.responseTime}h | {feedback.issueResolved ? 'Resolved' : 'Pending'}
                      </div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Satisfaction Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Satisfaction Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={satisfactionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="npsScore" fill="#3B82F6" name="NPS Score" />
                  <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#10B981" strokeWidth={2} name="Avg Rating" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {satisfactionDistribution.map((entry, index) => (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NPS Score Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npsAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, 'Count']} />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time & Resolution Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={satisfactionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="responseTime" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Response Time (hrs)" />
                  <Line yAxisId="right" type="monotone" dataKey="issueResolution" stroke="#10B981" strokeWidth={2} name="Resolution Rate (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Service Type Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Type Analysis</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Service Type</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Feedback</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceTypeAnalysis.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{service.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(Math.round(service.avgRating))}
                        <span className="ml-2 text-sm font-medium text-gray-900">{service.avgRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.totalFeedback}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.satisfaction}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.satisfaction >= 90 ? 'bg-green-100 text-green-800' :
                        service.satisfaction >= 80 ? 'bg-blue-100 text-blue-800' :
                        service.satisfaction >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {service.satisfaction >= 90 ? 'Excellent' :
                         service.satisfaction >= 80 ? 'Good' :
                         service.satisfaction >= 70 ? 'Fair' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Common Issues Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Issues Analysis</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Customer Issues & Resolutions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Resolution</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commonIssues.map((issue, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-orange-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{issue.issue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{issue.frequency}</span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(issue.frequency / 30) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        issue.impact === 'High' ? 'bg-red-100 text-red-800' :
                        issue.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Improvement Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <HandThumbUpIcon className="w-5 h-5 mr-2" />
              Immediate Actions
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Implement proactive delivery status communication system</li>
              <li>• Reduce average response time from 17 hours to under 12 hours</li>
              <li>• Establish service recovery protocols for delayed deliveries</li>
              <li>• Create dedicated customer service team for high-value accounts</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Long-term Initiatives
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Develop comprehensive driver customer service training</li>
              <li>• Implement automated feedback collection and analysis</li>
              <li>• Create customer retention program for at-risk accounts</li>
              <li>• Establish quality control measures for package handling</li>
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
