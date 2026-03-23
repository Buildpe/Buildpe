import apiClient from "./Api";

/**
 * Category API Service
 * Handles all category-related API calls
 * 
 * BACKEND RESPONSE STRUCTURE:
 * {
 *   id: 1,
 *   name: "Construction",
 *   description: "Construction services category"
 * }
 */

// In-memory cache for categories (5 minutes TTL)
let categoriesCache = null;
let categoriesCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all categories from backend
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (categoriesCache && categoriesCacheTime && (now - categoriesCacheTime < CACHE_DURATION)) {
      console.log('📦 Using cached categories');
      return categoriesCache;
    }

    console.log('🌐 Fetching categories from API...');
    const response = await apiClient.get('/api/public/categories');
    
    const categories = response.data;
    
    // Update cache
    categoriesCache = categories;
    categoriesCacheTime = now;
    
    console.log(`✅ Loaded ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    console.error('Error details:', error.response?.data || error.message);
    // Return empty array on error
    return [];
  }
};

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object|null>} Category object or null
 */
export const getCategoryById = async (id) => {
  try {
    // First try to get from cached categories
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.id === Number(id));
    
    if (category) {
      console.log(`📦 Found category ${id} in cache`);
      return category;
    }

    // If not in cache, fetch from API
    console.log(`🌐 Fetching category ${id} from API...`);
    const response = await apiClient.get(`/api/public/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching category ${id}:`, error);
    return null;
  }
};

/**
 * Get services by category ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<Array>} Array of service objects for this category
 */
export const getServicesByCategory = async (categoryId) => {
  try {
    console.log(`🌐 Fetching services for category ${categoryId}...`);
    const response = await apiClient.get(`/api/public/categories/${categoryId}/services`);
    
    console.log(`✅ Found ${response.data.length} services in category ${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching services for category ${categoryId}:`, error);
    return [];
  }
};

/**
 * Get category names for display in filters
 * @returns {Promise<Array<string>>} Array of category names
 */
export const getCategoryNames = async () => {
  try {
    const categories = await getAllCategories();
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error('❌ Error getting category names:', error);
    return [];
  }
};

/**
 * Clear categories cache (useful for manual refresh)
 */
export const clearCategoriesCache = () => {
  categoriesCache = null;
  categoriesCacheTime = null;
  console.log('🗑️ Categories cache cleared');
};

/**
 * Get unique category names from services (helper for filtering)
 * Used when you already have services loaded and want to extract categories
 * @param {Array} services - Array of services
 * @returns {Array<string>} Array of unique category names
 */
export const getUniqueCategoryNames = (services) => {
  if (!services || services.length === 0) {
    return [];
  }
  
  const categoryNames = services
    .map(service => service.category)
    .filter(Boolean); // Remove null/undefined
  
  return [...new Set(categoryNames)]; // Remove duplicates
};