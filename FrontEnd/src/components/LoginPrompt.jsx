import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = () => {
  const { showLoginPrompt, closeLoginPrompt, login } = useAuthContext();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!showLoginPrompt) return null;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(credentials);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    closeLoginPrompt();
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Please Login</h2>
          <button 
            onClick={closeLoginPrompt}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <p className="mb-4 text-gray-600">
          To enhance your experience, please log in to your account.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="prompt-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="prompt-email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="prompt-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="prompt-password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              type="button"
              onClick={goToSignup}
              className="w-full py-2 px-4 border border-black text-black rounded-md hover:bg-gray-100"
            >
              Sign Up
            </button>
            
            <button
              type="button"
              onClick={closeLoginPrompt}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-800"
            >
              Continue Browsing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPrompt; 