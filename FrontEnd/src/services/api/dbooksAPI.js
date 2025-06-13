// Service file for interacting with the dbooks.org API

const DBOOKS_API_BASE = 'https://www.dbooks.org/api';

/**
 * Service to interact with the dbooks.org API
 */
const dbooksAPI = {
  /**
   * Get recently added books
   * @returns {Promise<Object>} Object containing books data
   */
  async getRecentBooks() {
    try {
      const response = await fetch(`${DBOOKS_API_BASE}/recent`);
      if (!response.ok) throw new Error('Failed to fetch recent books');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent books:', error);
      throw error;
    }
  },

  /**
   * Search for books by query term
   * @param {string} query - The search query
   * @returns {Promise<Object>} Object containing books matching the query
   */
  async searchBooks(query) {
    if (!query) throw new Error('Search query is required');
    
    try {
      const response = await fetch(`${DBOOKS_API_BASE}/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search books');
      return await response.json();
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific book
   * @param {string} bookId - The ID of the book
   * @returns {Promise<Object>} Object containing detailed book information
   */
  async getBookDetails(bookId) {
    if (!bookId) throw new Error('Book ID is required');
    
    try {
      const response = await fetch(`${DBOOKS_API_BASE}/book/${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch book details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  },

  /**
   * Helper method to transform dbooks.org book data to match our application format
   * @param {Object} dbooksData - Book data from dbooks.org API
   * @returns {Array} Transformed book data matching our app format
   */
  transformBooksData(dbooksData) {
    if (!dbooksData || !dbooksData.books) return [];
    
    return dbooksData.books.map(book => ({
      _id: book.id,
      name: book.title,
      subtitle: book.subtitle || '',
      author: book.authors,
      image: book.image,
      description: book.description || 'No description available',
      category: book.subtitle ? book.subtitle.split(':')[0] : 'Uncategorized',
      price: 0,
      isFree: true,
      language: 'English',
      driveLink: book.url, // Use URL for viewing on dbooks.org
      downloadLink: book.download || book.url // Use download link if available
    }));
  }
};

export default dbooksAPI; 