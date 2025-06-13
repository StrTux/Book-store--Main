import React, { useState } from 'react';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const initialState = {
    name: book?.name || '',
    author: book?.author || '',
    description: book?.description || '',
    price: book?.price || '',
    category: book?.category || '',
    language: book?.language || '',
    image: '',
    driveLink: book?.driveLink || '',
    isFree: book?.isFree || false,
    pages: book?.pages || '',
    publishedDate: book?.publishedDate ? new Date(book.publishedDate).toISOString().split('T')[0] : '',
    isFeatured: book?.isFeatured || false
  };

  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(book?.image || '');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, image: reader.result }));
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.language) newErrors.language = 'Language is required';
    
    // Price is required only if book is not free
    if (!formData.isFree && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Price is required for non-free books';
    }
    
    // Require image for new books
    if (!book && !formData.image) {
      newErrors.image = 'Cover image is required';
    }
    
    // If it's a free book, require a drive link
    if (formData.isFree && !formData.driveLink) {
      newErrors.driveLink = 'Drive link is required for free books';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Don't send image if it's not changed (for updates)
    const dataToSubmit = { ...formData };
    if (book && formData.image === '') {
      delete dataToSubmit.image;
    }

    onSubmit(dataToSubmit);
  };

  // Categories for dropdown selection
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Technology',
    'Science',
    'Children'
  ];

  // Languages for dropdown selection
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Chinese',
    'Japanese',
    'Hindi',
    'Arabic',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Punjabi'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{book ? 'Edit Book' : 'Add New Book'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          {/* Author */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>
          
          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          {/* Language */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Language *</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.language ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Language</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
          </div>
          
          {/* Is Free Checkbox */}
          <div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isFree"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="isFree" className="ml-2 text-gray-700">This is a free book</label>
            </div>
          </div>
          
          {/* Price (only if not free) */}
          {!formData.isFree && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">Price ($) *</label>
              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          )}
          
          {/* Drive Link (required for free books) */}
          {formData.isFree && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">Google Drive Link *</label>
              <input
                type="text"
                name="driveLink"
                value={formData.driveLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/..."
                className={`w-full p-2 border rounded ${errors.driveLink ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.driveLink && <p className="text-red-500 text-sm mt-1">{errors.driveLink}</p>}
            </div>
          )}
          
          {/* Number of Pages */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Number of Pages</label>
            <input
              type="number"
              name="pages"
              min="1"
              value={formData.pages}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Published Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Published Date</label>
            <input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Is Featured Checkbox */}
          <div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="isFeatured" className="ml-2 text-gray-700">Feature this book on homepage</label>
            </div>
          </div>
          
          {/* Cover Image Upload */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Cover Image {!book && '*'}</label>
            <div className="flex items-start space-x-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`p-2 border rounded ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                <p className="text-sm text-gray-500 mt-1">Max size: 2MB. Recommended: 600x800px</p>
              </div>
              
              {imagePreview && (
                <div className="w-24 h-32 overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {book ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm; 