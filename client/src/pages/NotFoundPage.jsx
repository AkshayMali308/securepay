import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div className="text-center">
      <p className="text-8xl font-black text-blue-600 mb-2">404</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Page not found
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
