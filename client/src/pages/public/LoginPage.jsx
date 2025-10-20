import LoginForm from '../../components/auth/LoginForm';
import { useLoginForm } from '../../hooks/auth/useLoginForm';
import { login } from '../../services/authService';

const LoginPage = () => {
  const {
    formData,
    error,
    loading,
    showPassword,
    toggleShowPassword,
    handleSubmit,
    handleChange
  } = useLoginForm(login);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to continue to HCM Time Tracking
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm
          formData={formData}
          error={error}
          loading={loading}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default LoginPage