import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "@styles/home/navbar.css";
import { useAuthContext } from '@/context/AuthContext';
import api from '../../services/axiosConfig';

// Sample categories for mega menu - in production, fetch from API
const CATEGORIES = [
  {
    name: 'Fiction',
    subcategories: ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller']
  },
  {
    name: 'Non-Fiction',
    subcategories: ['Biography', 'History', 'Science', 'Self-Help', 'Business']
  },
  {
    name: 'Children',
    subcategories: ['Picture Books', 'Middle Grade', 'Young Adult', 'Educational', 'Activity Books']
  },
  {
    name: 'Academic',
    subcategories: ['Textbooks', 'Reference', 'Study Guides', 'Research Papers', 'Journals']
  }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState(CATEGORIES);
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories from API (optional)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Uncomment when category API is available
        // const response = await api.get('/products/categories');
        // if (response.data && response.data.categories) {
        //   setCategories(response.data.categories);
        // }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleMegaMenu = () => {
    setMegaMenuOpen(!megaMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/signin');
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-black/90 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[3.5rem]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <span className={` caveat text-2xl font-bold ${scrolled ? 'text-black' : 'text-white'}`}>BookStore</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <NavLink 
              to="/home" 
              className={({isActive}) => 
                `${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition ${isActive ? (scrolled ? 'font-medium text-black' : 'font-medium text-white') : ''}`
              }
            >
              Home
            </NavLink>
            
            {/* Categories with Mega Menu */}
            <div className="relative group">
              <button 
                onClick={toggleMegaMenu}
                onMouseEnter={() => setMegaMenuOpen(true)}
                className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition flex items-center`}
              >
                <span>Categories</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Mega Menu */}
              <div 
                className={`absolute left-0 mt-2 w-screen max-w-5xl bg-white rounded-md shadow-lg py-6 px-8 grid grid-cols-4 gap-8 z-50 transition-all duration-200 ${megaMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                {categories.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    <ul className="space-y-2">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <li key={subIndex}>
                          <a 
                            href={`/store?category=${category.name}&subcategory=${subcategory}`} 
                            className="text-gray-600 hover:text-blue-600 text-sm"
                          >
                            {subcategory}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href={`/store?category=${category.name}`} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All {category.name} →
                    </a>
                  </div>
                ))}
                
                {/* Featured section in mega menu */}
                <div className="col-span-4 mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Collections</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <a href="/store?featured=bestsellers" className="group">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/300x300/222/FFF?text=Bestsellers" alt="Bestsellers" className="w-full h-full object-center object-cover group-hover:opacity-75" />
                      </div>
                      <h3 className="mt-2 text-sm text-gray-700">Bestsellers</h3>
                    </a>
                    <a href="/store?featured=new-releases" className="group">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/300x300/222/FFF?text=New+Releases" alt="New Releases" className="w-full h-full object-center object-cover group-hover:opacity-75" />
                      </div>
                      <h3 className="mt-2 text-sm text-gray-700">New Releases</h3>
                    </a>
                    <a href="/books/category/Fiction" className="group">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/300x300/222/FFF?text=Fiction" alt="Fiction Books" className="w-full h-full object-center object-cover group-hover:opacity-75" />
                      </div>
                      <h3 className="mt-2 text-sm text-gray-700">Fiction Books</h3>
                    </a>
                    <a href="/books" className="group">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="https://placehold.co/300x300/228/FFF?text=Free+Books" alt="Free Books" className="w-full h-full object-center object-cover group-hover:opacity-75" />
                      </div>
                      <h3 className="mt-2 text-sm text-gray-700">Free Books</h3>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <NavLink 
              to="/store" 
              className={({isActive}) => 
                `${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition ${isActive ? (scrolled ? 'font-medium text-black' : 'font-medium text-white') : ''}`
              }
            >
              Store
            </NavLink>
            <NavLink 
              to="/books" 
              className={({isActive}) => 
                `${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition ${isActive ? (scrolled ? 'font-medium text-black' : 'font-medium text-white') : ''}`
              }
            >
              Free Books
            </NavLink>
            <NavLink 
              to="/feedback" 
              className={({isActive}) => 
                `${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition ${isActive ? (scrolled ? 'font-medium text-black' : 'font-medium text-white') : ''}`
              }
            >
              Feedback
            </NavLink>
          </nav>
          
          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={toggleSearch}
              className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  onClick={handleProfileClick}
                  className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition flex items-center`}
                >
                  <span className="mr-2">{user?.name?.split(' ')[0] || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <NavLink 
                to="/signin" 
                className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </NavLink>
            )}
            
            <NavLink 
              to="/cart" 
              className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition relative`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </NavLink>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <NavLink 
              to="/cart" 
              className={`${scrolled ? 'text-gray-800' : 'text-gray-300'} hover:${scrolled ? 'text-black' : 'text-white'} transition relative`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </NavLink>
            <button
              onClick={toggleNav}
              className={`${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`}
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Search bar - conditionally rendered */}
        {searchOpen && (
          <div className="py-3 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-lg">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/store"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Store
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Free Books
          </NavLink>
          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Feedback
          </NavLink>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

