import apiClient from "./Api";

// In-memory cache for services (5 minutes TTL)
let servicesCache = null;
let servicesCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Transform backend service data to frontend format
 *
 * ACTUAL backend shape:
 * {
 *   id: 3,
 *   title: "Residential Construction",
 *   description: "...",
 *   price: 45000,      // 0 means "Get Quote"
 *   discount: 36,      // percentage, 0 means no discount
 *   imgUrl: null,      // camelCase, NOT img_url
 *   category: { id, name, description }  // may be present
 * }
 */
const transformService = (backendService) => {
  // price: 0 or null → "Get Quote"
  const hasPrice = backendService.price && backendService.price > 0;

  // discount: 0 → no discount
  const discount = backendService.discount && backendService.discount > 0
    ? Number(backendService.discount)
    : null;

  // Raw original price (before discount)
  const originalPrice = hasPrice ? backendService.price : null;

  // Calculate actual discounted price
  // e.g. price=45000, discount=36 → discountedPrice = 45000 × (1 - 0.36) = 28800
  let discountedPrice = null;
  if (hasPrice && discount) {
    discountedPrice = Math.round(originalPrice * (1 - discount / 100));
  }

  // Display price — show discounted price if discount exists, else original, else "Get Quote!"
  const displayPrice = discountedPrice
    ? `₹${discountedPrice.toLocaleString('en-IN')}`
    : hasPrice
      ? `₹${originalPrice.toLocaleString('en-IN')}`
      : 'Get Quote!';

  // Image
  const imageUrl = backendService.imgUrl || backendService.img_url || null;

  // Category
  let categoryName = 'Unknown';
  if (backendService.category) {
    categoryName = typeof backendService.category === 'object'
      ? backendService.category.name
      : backendService.category;
  }
  const categoryId = backendService.category?.id || null;

  return {
    id:           String(backendService.id),
    title:        backendService.title,
    description:  backendService.description,

    // Discounted display price e.g. "₹28,800" or "Get Quote!"
    price:         displayPrice,

    // Raw original price (before discount) — used for strikethrough and savings calculation
    originalPrice: originalPrice,

    // Discount percentage — null when 0 so ProductCard hides the badge
    discount,

    image:        imageUrl,
    category:     categoryName,
    categoryId,
  };
};

export const getAllServices = async (forceRefresh = false) => {
  try {
    const now = Date.now();
    if (
      !forceRefresh &&
      servicesCache &&
      servicesCacheTime &&
      now - servicesCacheTime < CACHE_DURATION
    ) {
      console.log('📦 Using cached services');
      return servicesCache;
    }

    console.log('🌐 Fetching services from API...');
    const response = await apiClient.get('/api/public/services');
    const transformedServices = response.data.map(transformService);

    servicesCache = transformedServices;
    servicesCacheTime = now;

    console.log(`✅ Loaded ${transformedServices.length} services`);
    return transformedServices;
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    return [];
  }
};

export const getServiceById = async (id) => {
  try {
    const services = await getAllServices();
    const service = services.find(s => s.id === String(id));
    if (service) return service;

    const response = await apiClient.get(`/api/public/services/${id}`);
    return transformService(response.data);
  } catch (error) {
    console.error(`❌ Error fetching service ${id}:`, error);
    return null;
  }
};

export const searchServices = async (query) => {
  try {
    if (!query || query.trim() === '') return await getAllServices();

    const response = await apiClient.get('/api/public/services/search', {
      params: { query: query.trim() }
    });
    return response.data.map(transformService);
  } catch (error) {
    console.error('❌ Error searching services:', error);
    return [];
  }
};

export const getServicesWithDiscount = async (minDiscount = 30) => {
  try {
    const allServices = await getAllServices();
    const deals = allServices
      .filter(s => s.discount && s.discount >= minDiscount)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
    console.log(`✅ Found ${deals.length} services with ${minDiscount}%+ discount`);
    return deals;
  } catch (error) {
    console.error('❌ Error fetching discounted services:', error);
    return [];
  }
};

export const getServicesByIds = async (serviceIds) => {
  try {
    if (!serviceIds || serviceIds.length === 0) return [];
    const allServices = await getAllServices();
    return serviceIds
      .map(id => allServices.find(s => s.id === String(id)))
      .filter(Boolean);
  } catch (error) {
    console.error('❌ Error fetching services by IDs:', error);
    return [];
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(`/api/public/categories/${categoryId}/services`);
    return response.data.map(transformService);
  } catch (error) {
    console.error(`❌ Error fetching services for category ${categoryId}:`, error);
    return [];
  }
};

export const clearServicesCache = () => {
  servicesCache = null;
  servicesCacheTime = null;
  console.log('🗑️ Services cache cleared');
};

export const refreshAllData = async () => {
  clearServicesCache();
  return await getAllServices(true);
};

export const getUniqueCategoryNames = async () => {
  try {
    const services = await getAllServices();
    return [...new Set(services.map(s => s.category).filter(Boolean))];
  } catch (error) {
    console.error('❌ Error getting category names:', error);
    return [];
  }
};