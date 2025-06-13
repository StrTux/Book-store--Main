import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Home/Navbar';
import freeBooksAPI from '../../services/api/freeBooksAPI';
import '@styles/freebooks.css';

export default function FreeBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();

  // Fetch recent books from multiple APIs
  useEffect(() => {
    const fetchRecentBooks = async () => {
      setLoading(true);
      try {
        const combinedBooks = await freeBooksAPI.getRecentBooks();
        setBooks(combinedBooks || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching recent books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  // Get unique categories from books
  const categories = ['All', ...new Set(books.map(book => book.category))].filter(Boolean);

  // Filter books by search term and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === '' || 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle book search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await freeBooksAPI.searchBooks(searchQuery);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.error("Error searching books:", err);
      setError("Failed to search books. Please try again later.");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear search results and go back to recent books
  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
  };

  // Handle book download/open
  const handleOpenBook = async (book) => {
    try {
      // Determine which API to use based on the book source
      const source = book._id.startsWith('OL') ? 'openlibrary' : 'dbooks';
      const bookDetails = await freeBooksAPI.getBookDetails(book._id, source);
      
      if (bookDetails.redirect) {
        window.open(bookDetails.redirect, '_blank');
      } else if (bookDetails && bookDetails.download) {
        window.open(bookDetails.download, '_blank');
      } else {
        window.open(book.driveLink, '_blank');
      }
    } catch (err) {
      console.error("Error getting book download link:", err);
      // Fallback to the book URL if download link is unavailable
      window.open(book.driveLink, '_blank');
    }
  };

  // Navigate to category page
  const navigateToCategory = (category, subcategory = null) => {
    const path = subcategory 
      ? `/books/category/${category}/${subcategory}` 
      : `/books/category/${category}`;
    navigate(path);
  };

  // Determine which books to display: search results or filtered recent books
  const displayBooks = searchResults || filteredBooks;

  // Main category definitions
  const mainCategories = [
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Free Books Library
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse and download free books from multiple sources
          </p>
        </div>
        
        {/* Main Categories */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
                <ul className="space-y-2">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex}>
                      <button 
                        onClick={() => navigateToCategory(category.name, subcategory)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {subcategory}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigateToCategory(category.name)}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All {category.name} →
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Search form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search books by topic (e.g., python, javascript, cooking)..."
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-10 py-3 border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search Books
            </button>
            
            {searchResults && (
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Search
              </button>
            )}
          </form>
        </div>
        
        {/* Filter section (only shown for recent books) */}
        {!searchResults && (
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Filter displayed books by title, author, or description..."
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-10 py-3 border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="sm:w-64">
              <select
                className="block w-full py-3 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Search results title */}
        {searchResults && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Search Results for "{searchQuery}" 
              <span className="text-gray-500 ml-2">
                ({searchResults.length} books found)
              </span>
            </h2>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md inline-block">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
        
        {/* No results */}
        {!loading && !error && displayBooks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No books found matching your criteria.</p>
          </div>
        )}
        
        {/* Books grid */}
        {!loading && !error && displayBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayBooks.map(book => (
              <div key={book._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-56 overflow-hidden">
                  {book.image ? (
                    <img 
                      src={book.image} 
                      alt={book.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x800/DDDDDD/999999/png?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {book.name}
                    </h3>
                    {book.subtitle && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        {book.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      by {book.author}
                    </p>
                  </div>
                  
                  <div className="mt-3">
                    {book.category && book.category !== 'Uncategorized' && (
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {book.category}
                      </span>
                    )}
                    {book.has_fulltext && (
                      <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-700 mr-2 mb-2">
                        Full Text
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => handleOpenBook(book)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* How it works section */}
        <div className="mt-20 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Page</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Browse by category or search</h3>
                <p className="text-gray-600">Browse books by category or use the search bar to find books on specific topics.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Click "Download Book"</h3>
                <p className="text-gray-600">This will take you to the download page or file directly.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Save the book</h3>
                <p className="text-gray-600">Download and save the book to your device for offline reading.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
