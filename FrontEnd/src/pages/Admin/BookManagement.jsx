import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import BookForm from './BookForm';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products/admin/all', {
        withCredentials: true,
      });
      setBooks(response.data.products || []);
      setError('');
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
      });
      setBooks(books.filter(book => book._id !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again.');
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      if (selectedBook) {
        // Update existing book
        await axios.put(`http://localhost:5000/api/products/${selectedBook._id}`, bookData, {
          withCredentials: true,
        });
      } else {
        // Create new book
        await axios.post('http://localhost:5000/api/products', bookData, {
          withCredentials: true,
        });
      }
      
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      console.error('Error saving book:', err);
      setError('Failed to save book. Please try again.');
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/featured`, {}, {
        withCredentials: true,
      });
      
      setBooks(books.map(book => 
        book._id === id ? { ...book, isFeatured: !currentStatus } : book
      ));
    } catch (err) {
      console.error('Error toggling featured status:', err);
      setError('Failed to update featured status. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedBook(null);
  };

  if (!isAuthenticated) {
    return <div className="p-8 text-center">Please log in with admin credentials to access this page.</div>;
  }

  return (
    <div className="book-management p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Book Management</h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={handleAddNew}
        >
          Add New Book
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm ? (
        <BookForm 
          book={selectedBook} 
          onSubmit={handleFormSubmit} 
          onCancel={handleCancel} 
        />
      ) : (
        <>
          {loading ? (
            <div className="text-center py-8">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No books found. Add your first book!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Author</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Featured</th>
                    <th className="py-3 px-4 text-left">Free</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {book.image ? (
                          <img 
                            src={book.image} 
                            alt={book.name} 
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4">{book.name}</td>
                      <td className="py-2 px-4">{book.author}</td>
                      <td className="py-2 px-4">{book.category}</td>
                      <td className="py-2 px-4">{book.isFree ? 'Free' : `$${book.price.toFixed(2)}`}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleToggleFeatured(book._id, book.isFeatured)}
                          className={`px-2 py-1 rounded ${book.isFeatured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {book.isFeatured ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded ${book.isFree ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {book.isFree ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookManagement; 