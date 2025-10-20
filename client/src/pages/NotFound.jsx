import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-green-100 to-white text-gray-800">
      <h1 className="text-8xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center px-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-accent text-white rounded-xl shadow hover:bg-green-500 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
