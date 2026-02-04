// utils/servicesLoader.js
// Utility to load services from JSON files

/**
 * Load all services from the main services data file
 * @returns {Promise<Array>} Array of all services
 */
export const loadAllServices = async () => {
  try {
    const response = await fetch('/services/servicesData.json');
    if (!response.ok) {
      throw new Error('Failed to load services data');
    }
    const data = await response.json();
    
    // Return services as-is - image paths are already correct in the JSON
    return data.services;
  } catch (error) {
    console.error('Error loading services:', error);
    return [];
  }
};

/**
 * Load services based on component-specific service IDs
 * @param {string} componentFile - Name of the component JSON file (e.g., 'topDeals.json')
 * @returns {Promise<Array>} Array of filtered services
 */
export const loadServicesByComponent = async (componentFile) => {
  try {
    // Load the component's service IDs
    const idsResponse = await fetch(`/services/${componentFile}`);
    if (!idsResponse.ok) {
      throw new Error(`Failed to load ${componentFile}`);
    }
    const idsData = await idsResponse.json();
    
    // Load all services
    const allServices = await loadAllServices();
    
    // Filter services based on IDs and maintain order
    const filteredServices = idsData.serviceIds
      .map(id => allServices.find(service => service.id === id))
      .filter(service => service !== undefined);
    
    return filteredServices;
  } catch (error) {
    console.error(`Error loading services for ${componentFile}:`, error);
    return [];
  }
};

/**
 * Load services by category
 * @param {string} category - Category name (e.g., 'residential', 'commercial')
 * @returns {Promise<Array>} Array of services in that category
 */
export const loadServicesByCategory = async (category) => {
  try {
    const allServices = await loadAllServices();
    return allServices.filter(service => service.category === category);
  } catch (error) {
    console.error(`Error loading services for category ${category}:`, error);
    return [];
  }
};

/**
 * Load services by subcategory
 * @param {string} subCategory - Subcategory name (e.g., 'kitchen', 'bedroom')
 * @returns {Promise<Array>} Array of services in that subcategory
 */
export const loadServicesBySubCategory = async (subCategory) => {
  try {
    const allServices = await loadAllServices();
    return allServices.filter(service => service.subCategory === subCategory);
  } catch (error) {
    console.error(`Error loading services for subcategory ${subCategory}:`, error);
    return [];
  }
};

/**
 * Get a single service by ID
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object|null>} Service object or null if not found
 */
export const getServiceById = async (serviceId) => {
  try {
    const allServices = await loadAllServices();
    return allServices.find(service => service.id === serviceId) || null;
  } catch (error) {
    console.error(`Error loading service ${serviceId}:`, error);
    return null;
  }
};

/**
 * Search services by title or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching services
 */
export const searchServices = async (searchTerm) => {
  try {
    const allServices = await loadAllServices();
    const term = searchTerm.toLowerCase();
    
    return allServices.filter(service => 
      service.title.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching services:', error);
    return [];
  }
};