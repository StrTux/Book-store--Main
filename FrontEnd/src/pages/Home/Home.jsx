import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./main.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import api from '../../services/axiosConfig';
import { handleApiError } from '../../utils/errorHandler';
import { shouldUseFallback, checkServerStatus } from '../../utils/serverStatus';

// Fallback data in case API calls fail
const FALLBACK_DATA = {
  featuredBooks: [
    {
      _id: 'fallback1',
      name: 'The Great Adventure',
      author: 'John Smith',
      image: 'https://placehold.co/600x800/333/FFF?text=Book+Cover',
      price: 19.99,
      isFree: false
    },
    {
      _id: 'fallback2',
      name: 'Understanding JavaScript',
      author: 'Sarah Johnson',
      image: 'https://placehold.co/600x800/228/FFF?text=JS+Book',
      price: 29.99,
      isFree: false
    },
    {
      _id: 'fallback3',
      name: 'Cooking Basics',
      author: 'Chef Mike',
      image: 'https://placehold.co/600x800/822/FFF?text=Cooking',
      price: 15.99,
      isFree: false
    },
    {
      _id: 'fallback4',
      name: 'Free Guide to Gardening',
      author: 'Green Thumb',
      image: 'https://placehold.co/600x800/282/FFF?text=Gardening',
      price: 0,
      isFree: true
    }
  ],
  categories: [
    {
      name: 'Fiction',
      description: 'Explore our collection of fiction books.',
      image: 'https://placehold.co/600x400/DDDDDD/999999/png?text=Fiction'
    },
    {
      name: 'Technology',
      description: 'Explore our collection of technology books.',
      image: 'https://placehold.co/600x400/DDDDDD/999999/png?text=Technology'
    },
    {
      name: 'Cooking',
      description: 'Explore our collection of cooking books.',
      image: 'https://placehold.co/600x400/DDDDDD/999999/png?text=Cooking'
    }
  ]
};

export default function Home() {
  const [newReleases, setNewReleases] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    // Fetch featured books and categories
    async function fetchData() {
      try {
        setLoading(true);
        
        // Check server status first
        const isServerUp = await checkServerStatus();
        setServerStatus(isServerUp);
        
        if (!isServerUp) {
          console.log('Server is down or unreachable, using fallback data');
          setNewReleases(FALLBACK_DATA.featuredBooks);
          setFeaturedCategories(FALLBACK_DATA.categories);
          setError("Server is currently unavailable. Showing fallback data.");
          setLoading(false);
          return;
        }
        
        // Try the debug endpoint first to verify server connectivity
        try {
          const debugResponse = await api.get('/debug');
          console.log('Server connection successful', debugResponse.status);
        } catch (debugError) {
          console.error('Server connection failed:', debugError);
          // If debug endpoint fails, use fallback data
          setNewReleases(FALLBACK_DATA.featuredBooks);
          setFeaturedCategories(FALLBACK_DATA.categories);
          setError("Server connection error. Showing fallback data.");
          setLoading(false);
          return;
        }
        
        // First try the test endpoint to check if products routes are working
        try {
          const testResponse = await api.get('/products/test');
          console.log('Test endpoint successful:', testResponse.data);
        } catch (testError) {
          console.error('Test endpoint failed:', testError);
          // If test endpoint fails, use fallback data
          setNewReleases(FALLBACK_DATA.featuredBooks);
          setFeaturedCategories(FALLBACK_DATA.categories);
          setError("Product API not available. Showing fallback data.");
          setLoading(false);
          return;
        }
        
        // Now try the actual featured products endpoint with a shorter timeout
        try {
          const featuredResponse = await api.get('/products/featured', { timeout: 3000 });
          setNewReleases(featuredResponse.data.featuredBooks || []);
        } catch (featuredError) {
          console.error("Error fetching featured books:", featuredError);
          // Use fallback data if API call fails
          setNewReleases(FALLBACK_DATA.featuredBooks);
        }
        
        // Try to fetch all books to extract categories with a shorter timeout
        try {
          const allBooksResponse = await api.get('/products', { timeout: 3000 });
          const books = allBooksResponse.data.products || [];
          
          // Get unique categories
          const categories = [...new Set(books.map(book => book.category))].filter(Boolean);
          
          if (categories.length > 0) {
            // Get books for top 3 categories (or fewer if less than 3 categories)
            const topCategories = categories.slice(0, 3).map(category => {
              const categoryBooks = books.filter(book => book.category === category);
              return {
                name: category,
                description: `Explore our collection of ${category} books.`,
                image: categoryBooks[0]?.image || `https://placehold.co/600x400/DDDDDD/999999/png?text=${category}`
              };
            });
            setFeaturedCategories(topCategories);
          } else {
            // Use fallback categories if no categories found
            setFeaturedCategories(FALLBACK_DATA.categories);
          }
        } catch (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          // Use fallback categories if API call fails
          setFeaturedCategories(FALLBACK_DATA.categories);
        }
        
        setError(null);
      } catch (err) {
        const errorDetails = handleApiError(err, 'Home component');
        console.error("Error fetching data:", errorDetails);
        
        // Set error message based on error type
        if (err.code === 'ECONNABORTED') {
          setError("Request timed out. Showing fallback data.");
        } else if (err.response && err.response.status) {
          setError(`Server error (${err.response.status}). Showing fallback data.`);
        } else {
          setError("Could not fetch data. Showing fallback data.");
        }
        
        // Set fallback data
        setNewReleases(FALLBACK_DATA.featuredBooks);
        setFeaturedCategories(FALLBACK_DATA.categories);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <h1 className="dancing-script text-5xl md:text-6xl font-semibold mb-4">
            BookStore Pro
          </h1>
          <p className="text-[1rem] md:text-[1rem] mb-8">
            The most advanced collection of books.
          </p>
          <div className="space-x-4">
            <a
              href="/store"
              className="bg-black text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition border border-white"
            >
              Browse Now
            </a>
            <a
              href="#learn-more"
              className="text-blue-400 px-6 py-3 text-[1rem] font-medium"
            >
              Learn more &gt;
            </a>
          </div>

          <div>
            <img
              src="https://res.cloudinary.com/drwpjxlfs/image/upload/v1742476355/coffee-2151200_qkheae.jpg"
              alt="Featured Book"
              className="mt-12 max-w-4xl w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="dancing-script text-4xl font-semibold text-center mb-12">
            Featured Collections
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : featuredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {featuredCategories.map((category, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-auto md:h-[27rem] w-full md:w-[23rem] mx-auto"
                >
                  <img
                    src={category.image}
                    alt={`${category.name} Books`}
                    className="w-full h-48 md:h-[15rem] object-cover"
                  />
                  <div className="p-4 md:p-6">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                      {category.description}
                    </p>
                    <a
                      href={`/store?category=${category.name}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                    >
                      Explore {category.name} &gt;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Releases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="dancing-script text-4xl font-semibold text-center mb-2">
            New Releases
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Our latest additions to the bookstore
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : newReleases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured books available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newReleases.slice(0, 4).map((book) => (
                <div key={book._id} className="group">
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img
                      src={book.image || "https://placehold.co/600x800/DDDDDD/999999/png?text=No+Image"}
                      alt={book.name}
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm md:text-base">{book.name}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2">{book.author}</p>
                  <p className="text-blue-600 font-medium text-sm md:text-base">{book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/store"
              className="inline-block px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
            >
              View All New Releases
            </a>
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="m-4 rounded-lg bg-gradient-to-r from-[#000000] to-[#442177] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="poppins-regular text-3xl md:text-4xl font-bold mb-6">
            Join Our Membership Program
          </h2>
          <p className="poppins-regular text-xl mb-8 max-w-3xl mx-auto">
            Get exclusive access to special discounts, early releases, and free
            delivery on all orders.
          </p>
          <a
            href="#join"
            className="inline-block bg-white text-indigo-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Join Now
          </a>
        </div>
      </section>

      {/* Server Status Indicator - only visible in development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
            serverStatus === true 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : serverStatus === false 
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-gray-100 text-gray-800 border border-gray-300'
          }`}>
            {serverStatus === true 
              ? '✅ Server Online' 
              : serverStatus === false 
                ? '❌ Server Offline (Fallback Mode)' 
                : '⏳ Checking Server Status...'}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          {/* Top Section with Logo and Newsletter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold">BookStore</h2>
              <p className="text-gray-400 mt-2 max-w-md">Your destination for literary treasures and intellectual discovery. Find your next favorite story with us.</p>
            </div>
            
            <div className="w-full md:w-auto md:min-w-[350px]">
              <h3 className="text-lg font-semibold mb-3">Join Our Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 w-full text-black rounded-l-md focus:outline-none"
                />
                <button className="bg-white text-black hover:bg-gray-200 px-4 py-3 rounded-r-md font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-800 w-full my-8"></div>
          
          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/store"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="/store"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Non-Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="/store"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Children
                  </a>
                </li>
                <li>
                  <a
                    href="/store"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Bestsellers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#shipping"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#track-order"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Track Order
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <p className="text-gray-400 mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-white hover:text-black p-3 rounded-full text-white transition-colors"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-white hover:text-black p-3 rounded-full text-white transition-colors"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-white hover:text-black p-3 rounded-full text-white transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-white hover:text-black p-3 rounded-full text-white transition-colors"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
