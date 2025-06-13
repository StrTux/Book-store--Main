import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    freeBooks: 0,
    featuredBooks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products/admin/all', {
        withCredentials: true,
      });
      
      const books = response.data.products || [];
      const freeBooks = books.filter(book => book.isFree).length;
      const featuredBooks = books.filter(book => book.isFeatured).length;
      
      setStats({
        totalBooks: books.length,
        totalUsers: 0, // You would fetch this from a users endpoint
        freeBooks,
        featuredBooks
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">BookStore Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center text-gray-600 focus:outline-none">
                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-2 text-sm font-medium">Admin User</span>
                <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Back to Site
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                <h2 className="text-xl font-semibold">Admin Panel</h2>
              </div>
              <nav className="py-4">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center w-full px-6 py-3 text-left hover:bg-gray-100 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center w-full px-6 py-3 text-left hover:bg-gray-100 ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4" />
                  </svg>
                  Products
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center w-full px-6 py-3 text-left hover:bg-gray-100 ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Orders
                </button>
                <button 
                  onClick={() => setActiveTab('customers')}
                  className={`flex items-center w-full px-6 py-3 text-left hover:bg-gray-100 ${activeTab === 'customers' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Customers
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center w-full px-6 py-3 text-left hover:bg-gray-100 ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:ml-8">
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-gray-500 text-sm">Total Books</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalBooks}</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-gray-500 text-sm">Featured Books</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.featuredBooks}</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-gray-500 text-sm">Free Books</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.freeBooks}</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-gray-500 text-sm">Users</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                      <div className="space-y-3">
                        <button 
                          onClick={() => setActiveTab('products')}
                          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md flex justify-between items-center"
                        >
                          <span>Manage Products</span>
                          <span className="text-gray-400">→</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab('orders')}
                          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md flex justify-between items-center"
                        >
                          <span>View Orders</span>
                          <span className="text-gray-400">→</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab('customers')}
                          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md flex justify-between items-center"
                        >
                          <span>Manage Customers</span>
                          <span className="text-gray-400">→</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'products' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Product Management</h1>
                <p className="text-gray-600">Add new product or manage existing products.</p>
                <div className="mt-4">
                  <button 
                    onClick={() => window.location.href = '/admin/products/new'}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Add New Product
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Order Management</h1>
                <p className="text-gray-600">This feature is coming soon.</p>
              </div>
            )}
            
            {activeTab === 'customers' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Customer Management</h1>
                <p className="text-gray-600">This feature is coming soon.</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>
                <p className="text-gray-600">This feature is coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 