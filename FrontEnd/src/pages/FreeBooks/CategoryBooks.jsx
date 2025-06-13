import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../Home/Navbar';
import freeBooksAPI from '../../services/api/freeBooksAPI';
import '@styles/freebooks.css';

export default function CategoryBooks() {
  const { category, subcategory } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch books by category and subcategory
  useEffect(() => {
    const fetchCategoryBooks = async () => {
      if (!category) return;
      
      setLoading(true);
      try {
        const booksData = await freeBooksAPI.getBooksByCategory(category, subcategory);
        setBooks(booksData || []);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${subcategory ? subcategory : category} books:`, err);
        setError(`Failed to load ${subcategory ? subcategory : category} books. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBooks();
  }, [category, subcategory]);

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

  // Get display title
  const displayTitle = subcategory ? subcategory : category;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {displayTitle} Books
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse and download free {displayTitle.toLowerCase()} books from multiple sources
          </p>
        </div>
        
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/books')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Free Books
          </button>
        </div>
        
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
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No books found for {displayTitle}.</p>
          </div>
        )}
        
        {/* Books grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
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
                    {book.category && book.category !== 'Uncategorized' && book.category !== displayTitle && (
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
      </div>
    </div>
  );
} 