import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from '@/pages/Home';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
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
                    href="#fiction"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="#non-fiction"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Non-Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="#children"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Children
                  </a>
                </li>
                <li>
                  <a
                    href="#bestsellers"
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
};

export default MainLayout; 