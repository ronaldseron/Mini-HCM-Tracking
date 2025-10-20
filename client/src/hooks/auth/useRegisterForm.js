import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const useRegisterForm = (register) => { 
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { name, email, password } = formData;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setSkipMeFetch } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setSkipMeFetch(true);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        setSkipMeFetch(false);
        
        if (result.data.role === 'employee') {
          navigate('/users/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError('Registration failed. Please try again.');
      }

    } finally {
      setLoading(false);
    }
    
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword
  };
};

export default useRegisterForm;