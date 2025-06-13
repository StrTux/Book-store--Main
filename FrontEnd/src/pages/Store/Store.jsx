// This implementation fetches books from Open Library Subjects API instead of your own `/products` endpoint.
// It overrides the `fetchBooks()` logic accordingly.

import React, { useState, useEffect } from "react";
import { MainLayout } from '@components/layout';
import { StoreSidebar } from '@components/Store/StoreSidebar';
import '@styles/store.css';

const SUBJECTS = [
  'fiction', 'fantasy', 'science_fiction', 'mystery', 'romance', 'thriller',
  'biography', 'history', 'science', 'self_help', 'business',
  'picture_books', 'middle_grade', 'young_adult', 'educational', 'activity_books',
  'textbooks', 'reference', 'study_guides', 'research_papers', 'journals'
];

export default function Store() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooksFromSubjects();
  }, []);

  const fetchBooksFromSubjects = async () => {
    setIsLoading(true);
    const allBooks = [];
    try {
      for (const subject of SUBJECTS) {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=10`);
        const data = await res.json();
        if (data.works) {
          const booksFromSubject = data.works.map(work => ({
            _id: work.key,
            name: work.title,
            author: work.authors?.[0]?.name || 'Unknown Author',
            category: subject.replace('_', ' ').toUpperCase(),
            image: work.cover_id
              ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
              : 'https://placehold.co/600x800/DDDDDD/999999/png?text=No+Cover',
            price: 0,
            isFree: true
          }));
          allBooks.push(...booksFromSubject);
        }
      }
      setBooks(allBooks);
    } catch (err) {
      console.error("Error fetching Open Library books:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = books.filter(book => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category);
      const matchesPrice = book.price >= priceRange.min && (priceRange.max === Infinity || book.price <= priceRange.max);
      return matchesCategory && matchesPrice;
    });
    setFilteredBooks(filtered);
  }, [books, selectedCategories, priceRange]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <MainLayout>
      <div className="relative flex">
        <button onClick={toggleSidebar} className="mt-24 -ml-4 fixed z-50 top-4 left-4 bg-black text-white p-2 rounded-md">
          {isSidebarOpen ? '⇤' : '⇥'}
        </button>

        {isSidebarOpen && (
          <div className="fixed left-0 z-40 w-64 bg-white shadow-lg">
            <StoreSidebar
              onCategoryFilter={setSelectedCategories}
              onPriceFilter={setPriceRange}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              categories={[...new Set(books.map(book => book.category))].filter(Boolean)}
            />
          </div>
        )}

        <div className={`w-full ${isSidebarOpen ? 'ml-64' : ''} transition-all duration-300`}>
          <div className="max-w-screen-xl mx-auto pt-[4rem] px-8 py-8">
            <h1 className="dancing-script text-center mb-8 text-3xl font-bold text-gray-800">Book Store</h1>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">No books found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[9rem]">
                {filteredBooks.map((book) => (
                  <div key={book._id} className="w-[20rem] bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                    <img src={book.image} alt={book.name} className="w-full h-72 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{book.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                    <p className="text-blue-600 font-bold text-xl mb-4">Free</p>
                    <a href={`https://openlibrary.org${book._id}`} target="_blank" rel="noopener noreferrer" className="border border-black bg-white text-black py-3 px-4 rounded-md hover:bg-gray-300 text-center">
                      Read on Open Library
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}