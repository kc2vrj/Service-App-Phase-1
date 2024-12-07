export default function Custom404() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Return Home
          </a>
        </div>
      </div>
    );
  }