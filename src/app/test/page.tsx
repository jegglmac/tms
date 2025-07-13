export default function NetworkTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Connection Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your TMS mobile connection is working correctly.
          </p>
          <div className="space-y-3">
            <a 
              href="/"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              Go to Main TMS
            </a>
            <a 
              href="/mobile-test"
              className="block w-full bg-green-600 text-white py-3 rounded-lg font-medium"
            >
              Mobile Tracking Test
            </a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Connection Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Server:</span>
              <span className="font-mono">192.168.0.14:3003</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
