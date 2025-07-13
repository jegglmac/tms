'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
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
  ComposedChart
} from 'recharts';

interface FinancialAnalysisReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

// Mock financial data
const monthlyFinancialData = [
  { 
    month: 'Jan 2025', 
    revenue: 285000, 
    expenses: 195000, 
    profit: 90000, 
    margin: 31.6,
    trips: 1420,
    avgTripValue: 200.7
  },
  { 
    month: 'Feb 2025', 
    revenue: 312000, 
    expenses: 208000, 
    profit: 104000, 
    margin: 33.3,
    trips: 1580,
    avgTripValue: 197.5
  },
  { 
    month: 'Mar 2025', 
    revenue: 345000, 
    expenses: 225000, 
    profit: 120000, 
    margin: 34.8,
    trips: 1650,
    avgTripValue: 209.1
  },
  { 
    month: 'Apr 2025', 
    revenue: 368000, 
    expenses: 238000, 
    profit: 130000, 
    margin: 35.3,
    trips: 1720,
    avgTripValue: 214.0
  },
  { 
    month: 'May 2025', 
    revenue: 395000, 
    expenses: 255000, 
    profit: 140000, 
    margin: 35.4,
    trips: 1850,
    avgTripValue: 213.5
  },
  { 
    month: 'Jun 2025', 
    revenue: 412000, 
    expenses: 268000, 
    profit: 144000, 
    margin: 35.0,
    trips: 1920,
    avgTripValue: 214.6
  }
];

const expenseBreakdown = [
  { category: 'Fuel', amount: 98500, percentage: 36.8, color: '#EF4444' },
  { category: 'Driver Wages', amount: 72000, percentage: 26.9, color: '#3B82F6' },
  { category: 'Vehicle Maintenance', amount: 45000, percentage: 16.8, color: '#10B981' },
  { category: 'Insurance', amount: 28000, percentage: 10.4, color: '#F59E0B' },
  { category: 'Vehicle Depreciation', amount: 15000, percentage: 5.6, color: '#8B5CF6' },
  { category: 'Other Operating', amount: 9500, percentage: 3.5, color: '#EC4899' }
];

const revenueStreams = [
  { service: 'Long Haul Transport', revenue: 185000, percentage: 44.9, trips: 680, avgValue: 272.1 },
  { service: 'Local Delivery', revenue: 98000, percentage: 23.8, trips: 890, avgValue: 110.1 },
  { service: 'Express Shipping', revenue: 72000, percentage: 17.5, trips: 245, avgValue: 293.9 },
  { service: 'Special Freight', revenue: 42000, percentage: 10.2, trips: 85, avgValue: 494.1 },
  { service: 'Emergency Transport', revenue: 15000, percentage: 3.6, trips: 20, avgValue: 750.0 }
];

const kpiMetrics = [
  { 
    title: 'Total Revenue', 
    value: '$2,117,000', 
    change: '+15.2%', 
    trend: 'up',
    description: 'YTD Revenue Growth'
  },
  { 
    title: 'Net Profit', 
    value: '$728,000', 
    change: '+18.5%', 
    trend: 'up',
    description: 'YTD Profit Growth'
  },
  { 
    title: 'Profit Margin', 
    value: '34.4%', 
    change: '+2.1%', 
    trend: 'up',
    description: 'Average Margin'
  },
  { 
    title: 'ROI', 
    value: '24.8%', 
    change: '+3.2%', 
    trend: 'up',
    description: 'Return on Investment'
  },
  { 
    title: 'Cost per Mile', 
    value: '$1.85', 
    change: '-$0.08', 
    trend: 'down',
    description: 'Operating Efficiency'
  },
  { 
    title: 'Revenue per Vehicle', 
    value: '$38,491', 
    change: '+$2,150', 
    trend: 'up',
    description: 'Fleet Productivity'
  }
];

const quarterlySummary = [
  { quarter: 'Q1 2025', revenue: 942000, expenses: 628000, profit: 314000, margin: 33.3 },
  { quarter: 'Q2 2025', revenue: 1175000, expenses: 761000, profit: 414000, margin: 35.2 },
  { quarter: 'Q3 2024', revenue: 890000, expenses: 612000, profit: 278000, margin: 31.2 },
  { quarter: 'Q4 2024', revenue: 965000, expenses: 658000, profit: 307000, margin: 31.8 }
];

const FinancialAnalysisReport: React.FC<FinancialAnalysisReportProps> = ({ 
  isModal = false, 
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
      title: 'Financial Analysis Report - TMS',
      text: 'Comprehensive financial analysis report for our transport management system.',
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

  const handleScheduleReport = (frequency: string) => {
    // In a real application, this would make an API call to schedule the report
    showNotification(`Annual report scheduled for ${frequency} generation`);
    setShowScheduleMenu(false);
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
      ['Financial Analysis Report'],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['Monthly Financial Data'],
      ['Month', 'Revenue', 'Expenses', 'Profit', 'Margin %', 'Trips', 'Avg Trip Value'],
      ...monthlyFinancialData.map(row => [
        row.month,
        row.revenue,
        row.expenses,
        row.profit,
        row.margin,
        row.trips,
        row.avgTripValue
      ]),
      [''],
      ['Expense Breakdown'],
      ['Category', 'Amount', 'Percentage'],
      ...expenseBreakdown.map(row => [row.category, row.amount, `${row.percentage}%`]),
      [''],
      ['Revenue Streams'],
      ['Service', 'Revenue', 'Percentage', 'Trips', 'Avg Value'],
      ...revenueStreams.map(row => [
        row.service,
        row.revenue,
        `${row.percentage}%`,
        row.trips,
        row.avgValue
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-analysis-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('CSV export completed');
  };

  const exportToJSON = () => {
    const jsonData = {
      reportTitle: 'Financial Analysis Report',
      generatedDate: new Date().toISOString(),
      reportPeriod: 'January - June 2025',
      summary: {
        totalRevenue: 2117000,
        totalExpenses: 1389000,
        netProfit: 728000,
        averageMargin: 34.4
      },
      monthlyData: monthlyFinancialData,
      expenseBreakdown,
      revenueStreams,
      kpiMetrics,
      quarterlySummary,
      insights: [
        'Revenue growth of 15.2% year-to-date demonstrates strong market position',
        'Profit margin improvement of 2.1% indicates operational efficiency gains',
        'Long haul transport remains the primary revenue driver at 44.9%',
        'Fuel costs represent the largest expense category at 36.8%'
      ]
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('JSON export completed');
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
                <ChartBarIcon className="w-8 h-8 mr-3 text-blue-600" />
                Financial Analysis Report
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive financial performance analysis</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Period: January - June 2025
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

              {/* Schedule Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowScheduleMenu(!showScheduleMenu)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BellIcon className="w-4 h-4 mr-2" />
                  Schedule Annual Report
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                </button>
                
                {showScheduleMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleScheduleReport('monthly')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Monthly Generation
                      </button>
                      <button
                        onClick={() => handleScheduleReport('quarterly')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Quarterly Generation
                      </button>
                      <button
                        onClick={() => handleScheduleReport('annually')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Annual Generation
                      </button>
                      <button
                        onClick={() => handleScheduleReport('custom')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Custom Schedule
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpiMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                    </div>
                    <div className={`flex items-center ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
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
          </div>

          {/* Revenue and Profit Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Expenses Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyFinancialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Margin Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyFinancialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Profit Margin']} />
                  <Area type="monotone" dataKey="margin" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown and Revenue Streams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({category, percentage}) => `${category}: ${percentage}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {expenseBreakdown.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: expense.color }}
                      ></div>
                      <span className="text-gray-700">{expense.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${expense.amount.toLocaleString()}</span>
                      <span className="text-gray-500 ml-2">({expense.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Service Type</h3>
              <div className="space-y-4">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{stream.service}</h4>
                        <p className="text-sm text-gray-600">{stream.trips} trips</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${stream.revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{stream.percentage}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Average per trip:</span>
                      <span className="font-medium">${stream.avgValue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stream.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quarterly Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quarterly Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlySummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                <Bar dataKey="profit" fill="#10B981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Financial Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Financial Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Trip Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyFinancialData.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${month.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${month.expenses.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ${month.profit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          month.margin >= 35 ? 'bg-green-100 text-green-800' :
                          month.margin >= 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {month.margin}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.trips.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${month.avgTripValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Key Financial Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">Positive Trends</h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Revenue growth of 15.2% year-to-date</li>
                    <li>• Profit margin improvement of 2.1%</li>
                    <li>• Strong ROI at 24.8%</li>
                    <li>• Cost per mile reduction of $0.08</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">Opportunities</h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Fuel cost optimization initiatives</li>
                    <li>• Expansion of express shipping services</li>
                    <li>• Fleet utilization improvements</li>
                    <li>• Route optimization for efficiency gains</li>
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

export default FinancialAnalysisReport;
