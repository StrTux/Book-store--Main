import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { handleApiError } from '../../utils/errorHandler';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token and userId from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const userId = queryParams.get('id');
  
  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !userId) {
        setTokenValid(false);
        setError('Invalid reset link. Please request a new password reset.');
        return;
      }
      
      try {
        await api.get(`/auth/validate-reset-token?token=${token}&id=${userId}`);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        const errorDetails = handleApiError(err, 'validate-token');
        setError(errorDetails.message || 'Invalid or expired token. Please request a new password reset.');
      }
    };
    
    validateToken();
  }, [token, userId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // Call the API endpoint to reset password
      const response = await api.post('/auth/reset-password', {
        userId,
        token,
        newPassword: password
      });
      
      setMessage(response.data.message || 'Password has been reset successfully');
      setResetComplete(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
      
    } catch (err) {
      const errorDetails = handleApiError(err, 'reset-password');
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 caveat">BookStore</h2>
              <p className="mt-2 text-sm text-gray-600">Password Reset Error</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
            
            <Link
              to="/forgot-password"
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Request New Reset Link
            </Link>
            
            <div className="text-center mt-4">
              <Link to="/signin" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 caveat">BookStore</h2>
            <p className="mt-2 text-sm text-gray-600">
              {resetComplete ? 'Password Reset Complete' : 'Create a New Password'}
            </p>
          </div>
          
          {resetComplete ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <p className="text-green-700">{message}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your password has been reset successfully. You will be redirected to the login page in a moment.
              </p>
              <Link
                to="/signin"
                className="block w-full py-3 px-4 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {message}
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter new password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
              
              <div className="text-sm text-center">
                <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 