// Combined service file for interacting with multiple free book APIs

import dbooksAPI from './dbooksAPI';
import openLibraryAPI from './openLibraryAPI';

/**
 * Service to interact with multiple free books APIs
 */
const freeBooksAPI = {
  /**
   * Get recent free books from all sources
   * @returns {Promise<Array>} Array of books from all sources
   */
  async getRecentBooks() {
    try {
      // Get books from dbooks.org
      const dbooksResponse = await dbooksAPI.getRecentBooks();
      const dbooksBooks = dbooksAPI.transformBooksData(dbooksResponse);
      
      // Get books from Open Library (fiction as default)
      const openLibraryResponse = await openLibraryAPI.getBooksBySubject('fiction', { 
        limit: 10, 
        ebooks: true 
      });
      const openLibraryBooks = openLibraryAPI.transformBooksData(openLibraryResponse);
      
      // Combine the results
      return [...dbooksBooks, ...openLibraryBooks];
    } catch (error) {
      console.error('Error fetching recent books:', error);
      throw error;
    }
  },

  /**
   * Search for books by query term across all APIs
   * @param {string} query - The search query
   * @returns {Promise<Array>} Array of books matching the query
   */
  async searchBooks(query) {
    try {
      // Search in dbooks.org
      const dbooksResponse = await dbooksAPI.searchBooks(query);
      const dbooksBooks = dbooksAPI.transformBooksData(dbooksResponse);
      
      // Search in Open Library
      // Note: Open Library doesn't have a direct search by subject, so we'll use the subject that matches the query
      const sanitizedQuery = query.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const openLibraryResponse = await openLibraryAPI.getBooksBySubject(sanitizedQuery, { 
        limit: 20, 
        ebooks: true 
      }).catch(() => ({ works: [] })); // If subject doesn't exist, return empty results
      
      const openLibraryBooks = openLibraryAPI.transformBooksData(openLibraryResponse);
      
      // Combine the results
      return [...dbooksBooks, ...openLibraryBooks];
    } catch (error) {
      console.error('Error searching books:', error);
      // If one API fails, still return results from the other one
      try {
        const dbooksResponse = await dbooksAPI.searchBooks(query);
        return dbooksAPI.transformBooksData(dbooksResponse);
      } catch (err) {
        console.error('Fallback to dbooks.org also failed:', err);
        return [];
      }
    }
  },

  /**
   * Get books by category
   * @param {string} category - The main category (Fiction, Non-Fiction, etc.)
   * @param {string} subcategory - The subcategory (Fantasy, Science Fiction, etc.)
   * @param {Object} options - Optional parameters
   * @returns {Promise<Array>} Array of books in the category
   */
  async getBooksByCategory(category, subcategory, options = {}) {
    try {
      let books = [];
      
      // Convert category and subcategory to Open Library format
      const subjectKey = subcategory 
        ? subcategory.toLowerCase().replace(/[^a-z0-9_]/g, '_')
        : category.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      
      // Get books from Open Library
      const openLibraryResponse = await openLibraryAPI.getBooksBySubject(subjectKey, {
        limit: options.limit || 20,
        ebooks: true,
        offset: options.offset || 0
      }).catch(err => {
        console.error(`Error fetching from Open Library for ${subjectKey}:`, err);
        return { works: [] };
      });
      
      const openLibraryBooks = openLibraryAPI.transformBooksData(openLibraryResponse);
      
      // Search in dbooks.org using the subcategory as a search term
      const dbooksResponse = await dbooksAPI.searchBooks(
        subcategory || category
      ).catch(err => {
        console.error(`Error fetching from dbooks.org for ${subcategory || category}:`, err);
        return { books: [] };
      });
      
      const dbooksBooks = dbooksAPI.transformBooksData(dbooksResponse);
      
      // Combine the results
      books = [...openLibraryBooks, ...dbooksBooks];
      
      // Handle empty results
      if (books.length === 0) {
        // Try with just the main category from dbooks if subcategory returned no results
        if (subcategory) {
          const fallbackResponse = await dbooksAPI.searchBooks(category)
            .catch(() => ({ books: [] }));
          books = dbooksAPI.transformBooksData(fallbackResponse);
        }
      }
      
      return books;
    } catch (error) {
      console.error(`Error fetching books for category ${category}/${subcategory}:`, error);
      throw error;
    }
  },

  /**
   * Get book details from either API based on the book's source
   * @param {string} bookId - The ID of the book
   * @param {string} source - The source of the book (dbooks, openlibrary)
   * @returns {Promise<Object>} Object containing detailed book information
   */
  async getBookDetails(bookId, source) {
    if (source === 'openlibrary') {
      // For Open Library books, we redirect to the Open Library website
      return { 
        redirect: `https://openlibrary.org/works/${bookId}` 
      };
    } else {
      // For dbooks.org books, get the download link
      return await dbooksAPI.getBookDetails(bookId);
    }
  }
};

export default freeBooksAPI; 