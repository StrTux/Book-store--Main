import React from 'react';

const priceRanges = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $20', min: 10, max: 20 },
  { label: '$20 - $30', min: 20, max: 30 },
  { label: 'Over $30', min: 30, max: Infinity }
];

export const StoreSidebar = ({ 
  onCategoryFilter, 
  onPriceFilter, 
  selectedCategories, 
  priceRange,
  categories = [] // Default to empty array if not provided
}) => {
  const handleCategoryChange = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoryFilter(newSelectedCategories);
  };

  const handlePriceRangeChange = (range) => {
    onPriceFilter(range);
  };

  return (
    <div className="mt-4 w-64 bg-white p-16 shadow-lg rounded-lg space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Categories</h3>
        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={category} className="text-gray-700">
                  {category}
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No categories available</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <div key={range.label} className="flex items-center">
              <input
                type="radio"
                id={range.label}
                name="priceRange"
                checked={
                  priceRange.min === range.min && 
                  priceRange.max === range.max
                }
                onChange={() => handlePriceRangeChange(range)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={range.label} className="text-gray-700">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Additional Filters</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="freeBooks"
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="freeBooks" className="text-gray-700">
              Free Books
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredBooks"
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featuredBooks" className="text-gray-700">
              Featured Books
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}; 