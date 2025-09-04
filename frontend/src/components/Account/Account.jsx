import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'reports', name: 'Reports', icon: '📊' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: ['10K messages/month', 'Basic analytics', 'Email support', '3 data sources'],
      current: true
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      features: ['100K messages/month', 'Advanced analytics', 'Priority support', 'Unlimited sources', 'Custom reports'],
      current: false
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      features: ['Unlimited messages', 'White-label solution', '24/7 support', 'Custom integrations', 'Dedicated manager'],
      current: false
    }
  ];

  const recentReports = [
    { name: 'Weekly Sentiment Report', date: '2024-01-15', status: 'Ready', size: '2.4MB' },
    { name: 'Twitter Analysis Export', date: '2024-01-14', status: 'Ready', size: '1.8MB' },
    { name: 'Custom Data Analysis', date: '2024-01-12', status: 'Processing', size: '-' },
    { name: 'Monthly Summary', date: '2024-01-10', status: 'Ready', size: '3.2MB' }
  ];

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
            JD
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
            <p className="text-gray-600">john.doe@company.com</p>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              Pro Plan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="john.doe@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              defaultValue="TechCorp Inc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
            Save Changes
          </button>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">47.2K</div>
            <div className="text-sm text-gray-600">Messages Processed</div>
            <div className="text-xs text-blue-600 mt-1">47% of monthly limit</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Active Data Sources</div>
            <div className="text-xs text-green-600 mt-1">Unlimited on Pro plan</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
            <div className="text-sm text-gray-600">Reports Generated</div>
            <div className="text-xs text-purple-600 mt-1">This month</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Plan</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border-2 ${
                plan.current
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {plan.price}<span className="text-lg text-gray-600">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  plan.current
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Billing History</h3>
        <div className="space-y-4">
          {[
            { date: '2024-01-01', amount: '$99.00', status: 'Paid', invoice: 'INV-2024-001' },
            { date: '2023-12-01', amount: '$99.00', status: 'Paid', invoice: 'INV-2023-012' },
            { date: '2023-11-01', amount: '$99.00', status: 'Paid', invoice: 'INV-2023-011' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">{bill.invoice}</p>
                  <p className="text-sm text-gray-600">{bill.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{bill.amount}</p>
                <p className="text-sm text-green-600">{bill.status}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-8">
      {/* Report Generation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Sentiment Analysis Summary</option>
              <option>Data Source Performance</option>
              <option>Language Distribution</option>
              <option>Trend Analysis</option>
              <option>Custom Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom range</option>
            </select>
          </div>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
          Generate Report
        </button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports</h3>
        <div className="space-y-4">
          {recentReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-4">📊</div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    report.status === 'Ready' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {report.status}
                  </p>
                  <p className="text-sm text-gray-600">{report.size}</p>
                </div>
                {report.status === 'Ready' && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'billing':
        return renderBillingTab();
      case 'reports':
        return renderReportsTab();
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Security</h3>
            <p className="text-gray-600">Security settings coming soon...</p>
          </div>
        );
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Account{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manage your profile, billing, reports, and account settings in one place.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-lg mr-3">{tab.icon}</span>
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;