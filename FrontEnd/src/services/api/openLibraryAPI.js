// Service file for interacting with the Open Library API

const OPEN_LIBRARY_API_BASE = 'https://openlibrary.org';

/**
 * Service to interact with the Open Library API
 */
const openLibraryAPI = {
  /**
   * Get books by subject
   * @param {string} subject - The subject to fetch books for
   * @param {Object} options - Optional parameters
   * @param {boolean} options.ebooks - Whether to only include books with ebooks available
   * @param {string} options.published_in - Date range filter (e.g., "2000-2010")
   * @param {boolean} options.details - Whether to include additional details
   * @param {number} options.limit - Maximum number of books to return
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Object>} Object containing books data
   */
  async getBooksBySubject(subject, options = {}) {
    try {
      const { ebooks, published_in, details, limit, offset } = options;
      
      let url = `${OPEN_LIBRARY_API_BASE}/subjects/${subject}.json`;
      
      // Build query parameters
      const params = new URLSearchParams();
      if (ebooks !== undefined) params.append('ebooks', ebooks);
      if (published_in) params.append('published_in', published_in);
      if (details !== undefined) params.append('details', details);
      if (limit) params.append('limit', limit);
      if (offset) params.append('offset', offset);
      
      // Add query parameters to URL if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${subject} books`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${subject} books:`, error);
      throw error;
    }
  },

  /**
   * Helper method to transform Open Library book data to match our application format
   * @param {Object} openLibraryData - Book data from Open Library API
   * @returns {Array} Transformed book data matching our app format
   */
  transformBooksData(openLibraryData) {
    if (!openLibraryData || !openLibraryData.works) return [];
    
    return openLibraryData.works.map(book => {
      const cover_id = book.cover_id || '';
      const cover_url = cover_id 
        ? `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg` 
        : '';
      
      // Get author name(s)
      const authors = book.authors 
        ? book.authors.map(author => author.name).join(', ')
        : 'Unknown Author';

      return {
        _id: book.key.replace('/works/', ''),
        name: book.title,
        subtitle: '',
        author: authors,
        image: cover_url,
        description: book.description || 'No description available',
        category: openLibraryData.name || 'Uncategorized',
        price: 0,
        isFree: true,
        language: 'English',
        driveLink: `https://openlibrary.org${book.key}`,
        downloadLink: book.has_fulltext ? `https://openlibrary.org${book.key}/ebooks` : `https://openlibrary.org${book.key}`,
        ia: book.ia || null, // Internet Archive ID
        has_fulltext: book.has_fulltext || false
      };
    });
  }
};

export default openLibraryAPI; 