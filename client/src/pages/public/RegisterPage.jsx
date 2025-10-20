import RegisterForm from '../../components/auth/RegisterForm';
import useRegisterForm from '../../hooks/auth/useRegisterForm';
import { register } from '../../services/authService';

const RegisterPage = () => {
  const {
    formData,
    error,
    loading,
    showPassword,
    toggleShowPassword,
    handleSubmit,
    handleChange
  } = useRegisterForm(register);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join HCM Time Tracking to manage your work hours efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm
          formData={formData}
          error={error}
          loading={loading}
          showPassword={showPassword}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          toggleShowPassword={toggleShowPassword}
        />
      </div>
    </div>
  );
};

export default RegisterPage