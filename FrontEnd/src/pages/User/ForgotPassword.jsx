import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { handleApiError } from '../../utils/errorHandler';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // Call the API endpoint to send password reset email
      const response = await api.post('/auth/forgot-password', { email });
      
      setMessage(response.data.message || 'Reset link sent to your email address');
      setIsEmailSent(true);
    } catch (err) {
      const errorDetails = handleApiError(err, 'forgot-password');
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 caveat">BookStore</h2>
            <p className="mt-2 text-sm text-gray-600">
              {isEmailSent ? 'Check your email' : 'Reset your password'}
            </p>
          </div>
          
          {isEmailSent ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <p className="text-green-700">{message}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                If you don't see the email, check your spam folder.
              </p>
              <Link
                to="/signin"
                className="block w-full py-3 px-4 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Sign In
              </Link>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setMessage('');
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800"
              >
                Try with a different email
              </button>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email address"
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
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
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

export default ForgotPassword; 