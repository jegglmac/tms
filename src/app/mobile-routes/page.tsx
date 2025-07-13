export default function QuickRouteOptimizer() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🗺️ Quick Route Optimizer
          </h1>
          <p className="text-gray-600">
            Mobile-optimized route planning and optimization
          </p>
        </div>

        {/* Current Routes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Routes</h2>
          
          <div className="space-y-4">
            {/* Route 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Downtown Express</h3>
                  <p className="text-sm text-gray-600">John Smith • TMS-001</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Optimized
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">45.2</p>
                  <p className="text-xs text-gray-600">Miles</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">4h 15m</p>
                  <p className="text-xs text-gray-600">Time</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">$67.80</p>
                  <p className="text-xs text-gray-600">Fuel</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">6 stops • 94.5% efficiency</span>
                  <button className="text-blue-600 font-medium">View Details</button>
                </div>
              </div>
            </div>

            {/* Route 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Suburban Circuit</h3>
                  <p className="text-sm text-gray-600">Maria Garcia • TMS-015</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                  Needs Optimization
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">62.8</p>
                  <p className="text-xs text-gray-600">Miles</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">5h 45m</p>
                  <p className="text-xs text-gray-600">Time</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">$94.20</p>
                  <p className="text-xs text-gray-600">Fuel</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">8 stops • 91.2% efficiency</span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">
                    Optimize Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 text-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🚛</div>
              <p className="font-medium">New Route</p>
              <p className="text-xs opacity-90">Create route</p>
            </button>
            
            <button className="bg-green-600 text-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="font-medium">Optimize All</p>
              <p className="text-xs opacity-90">Bulk optimize</p>
            </button>
            
            <button className="bg-purple-600 text-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium">Analytics</p>
              <p className="text-xs opacity-90">View reports</p>
            </button>
            
            <button className="bg-orange-600 text-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🗺️</div>
              <p className="font-medium">Live Map</p>
              <p className="text-xs opacity-90">Track routes</p>
            </button>
          </div>
        </div>

        {/* Optimization Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Savings</h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">$245</p>
              <p className="text-xs text-gray-600">Fuel Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">3.2h</p>
              <p className="text-xs text-gray-600">Time Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">185</p>
              <p className="text-xs text-gray-600">Miles Saved</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            <a 
              href="/route-optimizer"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-center"
            >
              Full Route Optimizer
            </a>
            <a 
              href="/"
              className="block w-full bg-gray-600 text-white py-3 rounded-lg font-medium text-center"
            >
              Back to TMS Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
