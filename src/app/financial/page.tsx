'use client';

import React from 'react';
import MobileNav from '@/components/MobileNav';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function FinancialPage() {
  // Sample financial data
  const financialMetrics = [
    {
      title: 'Revenue Today',
      value: '$12,450',
      change: '+8.2%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'text-green-600'
    },
    {
      title: 'Operating Costs',
      value: '$8,230',
      change: '-3.1%',
      trend: 'down',
      icon: ArrowTrendingDownIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Profit Margin',
      value: '33.9%',
      change: '+2.4%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Fuel Costs',
      value: '$2,890',
      change: '+1.8%',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'text-orange-600'
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'Revenue', description: 'Delivery completed - TMS-001', amount: '+$245', time: '2 min ago' },
    { id: 2, type: 'Fuel', description: 'Fuel purchase - Station #42', amount: '-$68', time: '15 min ago' },
    { id: 3, type: 'Revenue', description: 'Delivery completed - TMS-015', amount: '+$189', time: '22 min ago' },
    { id: 4, type: 'Maintenance', description: 'Oil change - TMS-023', amount: '-$45', time: '1 hour ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav currentPage="/financial" />
      
      <div className="pb-20 md:pb-0 p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-sm text-gray-600">Revenue & cost analysis</p>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {financialMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      transaction.type === 'Revenue' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'Fuel' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type}
                    </span>
                    <span className="text-xs text-gray-500">{transaction.time}</span>
                  </div>
                  <p className="text-sm text-gray-900">{transaction.description}</p>
                </div>
                <div className={`font-bold ${
                  transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$342K</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$89K</p>
              <p className="text-sm text-gray-600">Net Profit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">26.1%</p>
              <p className="text-sm text-gray-600">Margin</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">1,247</p>
              <p className="text-sm text-gray-600">Deliveries</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Reports</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Daily Revenue Report</span>
              </div>
              <span className="text-sm text-gray-500">Download PDF</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Cost Analysis</span>
              </div>
              <span className="text-sm text-gray-500">View Details</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Profit & Loss</span>
              </div>
              <span className="text-sm text-gray-500">Monthly P&L</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
