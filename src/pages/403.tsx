// src/pages/403.tsx
export default function ForbiddenPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            403 - Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Return Home
          </a>
        </div>
      </div>
    )
  }