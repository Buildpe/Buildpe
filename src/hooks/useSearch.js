import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for search functionality
 * Handles search queries, filtering, and navigation
 */
export const useSearch = (servicesData) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  // Extract unique categories from services
  const categories = useMemo(() => {
    if (!servicesData?.services) return [];
    return [...new Set(servicesData.services.map(s => s.category))];
  }, [servicesData]);

  // Filter and get search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !servicesData?.services) {
      return { services: [], categories: [], total: 0 };
    }

    const query = searchQuery.toLowerCase().trim();
    
    // Filter services
    const matchedServices = servicesData.services.filter(service => {
      const titleMatch = service.title?.toLowerCase().includes(query);
      const descMatch = service.description?.toLowerCase().includes(query);
      const categoryMatch = service.category?.toLowerCase().includes(query);
      return titleMatch || descMatch || categoryMatch;
    });

    // Filter categories
    const matchedCategories = categories.filter(cat => 
      cat.toLowerCase().includes(query)
    );

    // Limit results for dropdown (5 services + 3 categories max)
    const limitedServices = matchedServices.slice(0, 5);
    const limitedCategories = matchedCategories.slice(0, 3);

    return {
      services: limitedServices,
      categories: limitedCategories,
      total: matchedServices.length + matchedCategories.length,
      allServicesCount: matchedServices.length,
      allCategoriesCount: matchedCategories.length
    };
  }, [searchQuery, servicesData, categories]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;

    const totalItems = searchResults.categories.length + searchResults.services.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : totalItems - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleItemSelect(selectedIndex);
        } else {
          handleViewAllResults();
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle item selection
  const handleItemSelect = (index) => {
    const totalCategories = searchResults.categories.length;
    
    if (index < totalCategories) {
      // Category selected
      const category = searchResults.categories[index];
      navigateToCategory(category);
    } else {
      // Service selected
      const service = searchResults.services[index - totalCategories];
      navigateToService(service);
    }
  };

  // Navigate to category
  const navigateToCategory = (category) => {
    navigate('/services', { state: { selectedCategory: category } });
    closeSearch();
  };

  // Navigate to service detail (you may need to adjust this based on your routing)
  const navigateToService = (service) => {
    // Option 1: Navigate to services page with the service highlighted
    navigate('/services', { state: { highlightServiceId: service.id } });
    
    // Option 2: If you have a service detail page
    // navigate(`/services/${service.id}`);
    
    closeSearch();
  };

  // Handle "View All Results" click
  const handleViewAllResults = () => {
    // Navigate to services page with search query
    navigate('/services', { state: { searchQuery: searchQuery } });
    closeSearch();
  };

  // Close search dropdown
  const closeSearch = () => {
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    setSearchQuery('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return {
    searchQuery,
    isDropdownOpen,
    selectedIndex,
    searchResults,
    handleSearchChange,
    handleKeyDown,
    handleItemSelect,
    navigateToCategory,
    navigateToService,
    handleViewAllResults,
    closeSearch,
    setIsDropdownOpen
  };
};

export default useSearch;