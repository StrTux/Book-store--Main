import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import axios from 'axios';
import '@styles/admin.css';
import BookManagement from './BookManagement';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    freeBooks: 0,
    featuredBooks: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);
  
  const fetchStats = async () => {
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
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Admin Access Required</h2>
          <p className="mb-4">Please log in with admin credentials to access this page.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'dashboard' ? 'bg-gray-100 border-b-2 border-blue-600' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'books' ? 'bg-gray-100 border-b-2 border-blue-600' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              Manage Books
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'dashboard' ? (
              <>
                <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Books</h3>
                    <p className="text-3xl font-semibold">{stats.totalBooks}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Featured Books</h3>
                    <p className="text-3xl font-semibold">{stats.featuredBooks}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Free Books</h3>
                    <p className="text-3xl font-semibold">{stats.freeBooks}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-semibold">{stats.totalUsers}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('books')}
                        className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md flex justify-between items-center"
                      >
                        <span>Manage Books</span>
                        <span className="text-gray-400">→</span>
                      </button>
                      
                      <button 
                        className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md flex justify-between items-center"
                      >
                        <span>View User Activity</span>
                        <span className="text-gray-400">→</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold mb-4">Admin Account</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-medium">{user?.name || 'Admin User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || 'admin@example.com'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Role: Administrator</p>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </>
            ) : activeTab === 'books' ? (
              <BookManagement />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 