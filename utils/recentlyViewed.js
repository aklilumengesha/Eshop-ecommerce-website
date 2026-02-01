// Recently Viewed Products Utility
// Manages localStorage for tracking user's browsing history
// Maximum 12 products, most recent first

const STORAGE_KEY = 'recentlyViewed';
const MAX_PRODUCTS = 12;

/**
 * Get all recently viewed products from localStorage
 * @returns {Array} Array of product objects
 */
export const getRecentlyViewed = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recently viewed:', error);
    return [];
  }
};

/**
 * Add a product to recently viewed list
 * If product already exists, move it to the top
 * Maintains maximum of 12 products
 * @param {Object} product - Product object to add
 */
export const addToRecentlyViewed = (product) => {
  if (typeof window === 'undefined') return;
  
  try {
    let recentlyViewed = getRecentlyViewed();
    
    // Remove product if it already exists (to move it to top)
    recentlyViewed = recentlyViewed.filter(
      (item) => item.slug !== product.slug
    );
    
    // Add product to the beginning of the array
    recentlyViewed.unshift({
      _id: product._id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      brand: product.brand,
      category: product.category,
      rating: product.rating,
      numReviews: product.numReviews,
      countInStock: product.countInStock,
      viewedAt: new Date().toISOString(),
    });
    
    // Keep only the most recent MAX_PRODUCTS items
    if (recentlyViewed.length > MAX_PRODUCTS) {
      recentlyViewed = recentlyViewed.slice(0, MAX_PRODUCTS);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error saving recently viewed:', error);
  }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewed = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};

/**
 * Remove a specific product from recently viewed
 * @param {string} slug - Product slug to remove
 */
export const removeFromRecentlyViewed = (slug) => {
  if (typeof window === 'undefined') return;
  
  try {
    let recentlyViewed = getRecentlyViewed();
    recentlyViewed = recentlyViewed.filter((item) => item.slug !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error removing from recently viewed:', error);
  }
};
