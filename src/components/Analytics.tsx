'use client';

import React, { useState } from 'react';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter
} from 'recharts';
import FleetSummaryReport from '@/components/FleetSummaryReport';
import FinancialAnalysisReport from '@/components/FinancialAnalysisReport';
import DriverPerformanceReport from '@/components/DriverPerformanceReport';
import RouteOptimizationReport from '@/components/RouteOptimizationReport';
import MaintenanceScheduleReport from '@/components/MaintenanceScheduleReport';
import ComplianceStatusReport from '@/components/ComplianceStatusReport';
import FuelAnalysisReport from '@/components/FuelAnalysisReport';
import CustomerSatisfactionReport from '@/components/CustomerSatisfactionReport';

// Mock data for analytics
const monthlyFleetData = [
  { month: 'Jan', vehicles: 45, trips: 1200, revenue: 125000, costs: 95000 },
  { month: 'Feb', vehicles: 47, trips: 1350, revenue: 142000, costs: 98000 },
  { month: 'Mar', vehicles: 48, trips: 1450, revenue: 155000, costs: 102000 },
  { month: 'Apr', vehicles: 50, trips: 1580, revenue: 168000, costs: 108000 },
  { month: 'May', vehicles: 52, trips: 1620, revenue: 172000, costs: 112000 },
  { month: 'Jun', vehicles: 55, trips: 1750, revenue: 185000, costs: 118000 }
];

const performanceMetrics = [
  { name: 'Fleet Utilization', value: 87, color: '#10B981' },
  { name: 'On-Time Delivery', value: 94, color: '#3B82F6' },
  { name: 'Fuel Efficiency', value: 78, color: '#F59E0B' },
  { name: 'Driver Satisfaction', value: 91, color: '#8B5CF6' },
  { name: 'Customer Satisfaction', value: 96, color: '#EF4444' }
];

const costBreakdown = [
  { name: 'Fuel', value: 45, amount: 52000 },
  { name: 'Maintenance', value: 25, amount: 29000 },
  { name: 'Insurance', value: 15, amount: 17500 },
  { name: 'Driver Wages', value: 10, amount: 11600 },
  { name: 'Other', value: 5, amount: 5800 }
];

const driverPerformance = [
  { name: 'John Smith', trips: 45, onTime: 96, fuel: 8.2, safety: 98 },
  { name: 'Maria Garcia', trips: 52, onTime: 94, fuel: 7.8, safety: 100 },
  { name: 'David Johnson', trips: 38, onTime: 91, fuel: 8.5, safety: 95 },
  { name: 'Sarah Wilson', trips: 41, onTime: 98, fuel: 7.6, safety: 99 },
  { name: 'Michael Brown', trips: 47, onTime: 89, fuel: 8.9, safety: 92 }
];

const routeEfficiency = [
  { route: 'Route A', distance: 120, time: 3.2, fuel: 15.4, cost: 85 },
  { route: 'Route B', distance: 95, time: 2.8, fuel: 12.8, cost: 72 },
  { route: 'Route C', distance: 150, time: 4.1, fuel: 18.9, cost: 105 },
  { route: 'Route D', distance: 75, time: 2.1, fuel: 9.5, cost: 58 },
  { route: 'Route E', distance: 200, time: 5.5, fuel: 25.2, cost: 142 }
];

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [selectedReport, setSelectedReport] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFleetSummary, setShowFleetSummary] = useState(false);
  const [showFinancialAnalysis, setShowFinancialAnalysis] = useState(false);
  const [showDriverPerformance, setShowDriverPerformance] = useState(false);
  const [showRouteOptimization, setShowRouteOptimization] = useState(false);
  const [showMaintenanceSchedule, setShowMaintenanceSchedule] = useState(false);
  const [showComplianceStatus, setShowComplianceStatus] = useState(false);
  const [showFuelAnalysis, setShowFuelAnalysis] = useState(false);
  const [showCustomerSatisfaction, setShowCustomerSatisfaction] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'fleet', name: 'Fleet Analytics', icon: TruckIcon },
    { id: 'financial', name: 'Financial', icon: CurrencyDollarIcon },
    { id: 'performance', name: 'Performance', icon: ArrowTrendingUpIcon },
    { id: 'reports', name: 'Reports', icon: DocumentArrowDownIcon },
  ];

  const reportTypes = [
    { id: 'fleet-summary', name: 'Fleet Summary Report', description: 'Comprehensive fleet overview with key metrics' },
    { id: 'financial-analysis', name: 'Financial Analysis Report', description: 'Revenue, costs, and profitability analysis' },
    { id: 'driver-performance', name: 'Driver Performance Report', description: 'Individual driver metrics and rankings' },
    { id: 'route-optimization', name: 'Route Optimization Report', description: 'Route efficiency and optimization opportunities' },
    { id: 'maintenance-schedule', name: 'Maintenance Schedule Report', description: 'Upcoming and overdue maintenance items' },
    { id: 'compliance-status', name: 'Compliance Status Report', description: 'Regulatory compliance and certification status' },
    { id: 'fuel-analysis', name: 'Fuel Analysis Report', description: 'Fuel consumption patterns and efficiency metrics' },
    { id: 'customer-satisfaction', name: 'Customer Satisfaction Report', description: 'Customer feedback and service quality metrics' }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$1,847,500',
      change: '+12.5%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      title: 'Active Vehicles',
      value: '55',
      change: '+3 this month',
      changeType: 'increase',
      icon: TruckIcon,
      color: 'blue'
    },
    {
      title: 'Total Trips',
      value: '8,950',
      change: '+8.2%',
      changeType: 'increase',
      icon: MapPinIcon,
      color: 'purple'
    },
    {
      title: 'On-Time Rate',
      value: '94.2%',
      change: '+1.8%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'Avg Fuel Cost',
      value: '$3.45/gal',
      change: '-$0.12',
      changeType: 'decrease',
      icon: ArrowTrendingDownIcon,
      color: 'green'
    },
    {
      title: 'Driver Utilization',
      value: '87.3%',
      change: '+2.1%',
      changeType: 'increase',
      icon: UserIcon,
      color: 'blue'
    }
  ];

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getChangeColor = (changeType: string, type: string) => {
    if (type === 'decrease' && changeType === 'decrease') return 'text-green-600';
    if (type === 'increase' && changeType === 'increase') return 'text-green-600';
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive fleet analytics and business intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="custom">Custom range</option>
            </select>
            
            {/* Generate Report Button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpiCards.map((kpi, index) => {
              const ChangeIcon = getChangeIcon(kpi.changeType);
              return (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{kpi.title}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-lg font-semibold text-gray-900">{kpi.value}</div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(kpi.changeType, kpi.color)}`}>
                              <ChangeIcon className="self-center flex-shrink-0 h-4 w-4" />
                              <span className="ml-1">{kpi.change}</span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyFleetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart data={performanceMetrics} innerRadius="20%" outerRadius="80%">
                  <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fleet Utilization and Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet Utilization */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fleet Utilization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyFleetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({name, value}) => `${name}: $${(value || 0).toLocaleString()}`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Analytics Tab */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Performance */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Performance Trends</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyFleetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="vehicles" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="trips" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Route Efficiency */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Route Efficiency Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {routeEfficiency.map((route, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.route}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.distance} mi</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.time} hrs</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            route.fuel < 15 ? 'bg-green-100 text-green-800' : 
                            route.fuel < 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {route.fuel} mpg
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Costs */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Operating Costs</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyFleetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#10B981" />
                  <Bar dataKey="costs" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Profitability Trend */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profitability Trend</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyFleetData.map(item => ({
                  ...item,
                  profit: item.revenue - item.costs,
                  margin: ((item.revenue - item.costs) / item.revenue * 100).toFixed(1)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'profit' ? `$${value.toLocaleString()}` : `${value}%`,
                    name === 'profit' ? 'Profit' : 'Margin'
                  ]} />
                  <Area type="monotone" dataKey="profit" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Profit</dt>
                      <dd className="text-lg font-semibold text-gray-900">$315,500</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Profit Margin</dt>
                      <dd className="text-lg font-semibold text-gray-900">17.1%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TruckIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenue per Vehicle</dt>
                      <dd className="text-lg font-semibold text-gray-900">$33,591</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Cost per Mile</dt>
                      <dd className="text-lg font-semibold text-gray-900">$1.85</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Driver Performance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Safety Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {driverPerformance.map((driver, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.trips}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.onTime}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.fuel} mpg</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.safety}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          driver.onTime >= 95 ? 'bg-green-100 text-green-800' : 
                          driver.onTime >= 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {driver.onTime >= 95 ? 'Excellent' : driver.onTime >= 90 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver Performance Scatter */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Performance Matrix</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={driverPerformance}>
                  <CartesianGrid />
                  <XAxis dataKey="onTime" name="On-Time %" />
                  <YAxis dataKey="fuel" name="Fuel Efficiency" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Drivers" dataKey="safety" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Trends */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <button 
                        onClick={() => {
                          if (report.id === 'fleet-summary') {
                            setShowFleetSummary(true);
                          } else if (report.id === 'financial-analysis') {
                            setShowFinancialAnalysis(true);
                          } else if (report.id === 'driver-performance') {
                            setShowDriverPerformance(true);
                          } else if (report.id === 'route-optimization') {
                            setShowRouteOptimization(true);
                          } else if (report.id === 'maintenance-schedule') {
                            setShowMaintenanceSchedule(true);
                          } else if (report.id === 'compliance-status') {
                            setShowComplianceStatus(true);
                          } else if (report.id === 'fuel-analysis') {
                            setShowFuelAnalysis(true);
                          } else if (report.id === 'customer-satisfaction') {
                            setShowCustomerSatisfaction(true);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Report"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        title="Download Report"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => {
                        if (report.id === 'fleet-summary') {
                          setShowFleetSummary(true);
                        } else if (report.id === 'financial-analysis') {
                          setShowFinancialAnalysis(true);
                        } else if (report.id === 'driver-performance') {
                          setShowDriverPerformance(true);
                        } else if (report.id === 'route-optimization') {
                          setShowRouteOptimization(true);
                        } else if (report.id === 'maintenance-schedule') {
                          setShowMaintenanceSchedule(true);
                        } else if (report.id === 'compliance-status') {
                          setShowComplianceStatus(true);
                        } else if (report.id === 'fuel-analysis') {
                          setShowFuelAnalysis(true);
                        } else if (report.id === 'customer-satisfaction') {
                          setShowCustomerSatisfaction(true);
                        }
                      }}
                      className="flex-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                    >
                      Generate
                    </button>
                    <button className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generate Custom Report</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Report Type</label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select report type</option>
                    {reportTypes.map((report) => (
                      <option key={report.id} value={report.id}>{report.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Range</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Format</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="format" value="pdf" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">PDF Document</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="format" value="excel" className="mr-2" />
                      <span className="text-sm text-gray-700">Excel Spreadsheet</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="format" value="csv" className="mr-2" />
                      <span className="text-sm text-gray-700">CSV Data</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle generate report logic here
                    setShowReportModal(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Summary Report Modal */}
      {showFleetSummary && (
        <FleetSummaryReport 
          isModal={true} 
          onClose={() => setShowFleetSummary(false)} 
        />
      )}

      {/* Financial Analysis Report Modal */}
      {showFinancialAnalysis && (
        <FinancialAnalysisReport 
          isModal={true} 
          onClose={() => setShowFinancialAnalysis(false)} 
        />
      )}

      {/* Driver Performance Report Modal */}
      {showDriverPerformance && (
        <DriverPerformanceReport 
          isModal={true} 
          onClose={() => setShowDriverPerformance(false)} 
        />
      )}

      {/* Route Optimization Report Modal */}
      {showRouteOptimization && (
        <RouteOptimizationReport 
          isModal={true} 
          onClose={() => setShowRouteOptimization(false)} 
        />
      )}

      {/* Maintenance Schedule Report Modal */}
      {showMaintenanceSchedule && (
        <MaintenanceScheduleReport 
          isModal={true} 
          onClose={() => setShowMaintenanceSchedule(false)} 
        />
      )}

      {/* Compliance Status Report Modal */}
      {showComplianceStatus && (
        <ComplianceStatusReport 
          isModal={true} 
          onClose={() => setShowComplianceStatus(false)} 
        />
      )}

      {/* Fuel Analysis Report Modal */}
      {showFuelAnalysis && (
        <FuelAnalysisReport 
          isModal={true} 
          onClose={() => setShowFuelAnalysis(false)} 
        />
      )}

      {/* Customer Satisfaction Report Modal */}
      {showCustomerSatisfaction && (
        <CustomerSatisfactionReport 
          isModal={true} 
          onClose={() => setShowCustomerSatisfaction(false)} 
        />
      )}
    </div>
  );
}
