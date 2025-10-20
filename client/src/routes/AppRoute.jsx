import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import EmployeeRoute from './EmployeeRoute';
import AdminRoute from './AdminRoute';
import NotFound from '../pages/NotFound';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import Records from '../pages/employee/Records';
import History from '../pages/employee/History';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ReportPage from '../pages/admin/Reports';

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Employee Routes */}
      <Route
        path="/users/dashboard"
        element={
          <EmployeeRoute>
            <EmployeeDashboard />
          </EmployeeRoute>
        }
      />
      <Route
        path="/users/records"
        element={
          <EmployeeRoute>
            <Records />
          </EmployeeRoute>
        }
      />
      <Route
        path="/users/history"
        element={
          <EmployeeRoute>
            <History />
          </EmployeeRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><ReportPage /></AdminRoute>} />

      {/* Fallback */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoute;
