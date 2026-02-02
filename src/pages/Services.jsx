import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/common/FilterBar';
import ServicesList from '../components/services/ServicesList';
import servicesData from '../../public/services/servicesData.json';

export default function Services() {
  const location = useLocation();
  const [services, setServices] = useState(servicesData.services);
  const [filteredServices, setFilteredServices] = useState(servicesData.services);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 'all',
    discountRange: 'all',
    availability: 'all'
  });
  const [highlightServiceId, setHighlightServiceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories on mount
  useEffect(() => {
    const uniqueCategories = [...new Set(servicesData.services.map(s => s.category))];
    setCategories(uniqueCategories);
  }, []);

  // Handle navigation state (category selection, search query, or service highlighting)
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
      setSearchQuery('');
    }
    
    if (location.state?.highlightServiceId) {
      setHighlightServiceId(location.state.highlightServiceId);
      setSearchQuery('');
      
      // Scroll to service after a short delay
      setTimeout(() => {
        const element = document.getElementById(`service-${location.state.highlightServiceId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightServiceId(null);
      }, 3000);
    }

    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      setSelectedCategory('All');
    }
  }, [location.state]);

  // Apply all filters
  useEffect(() => {
    let result = [...services];

    // 1. Filter by search query (if present)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(service => {
        const titleMatch = service.title?.toLowerCase().includes(query);
        const descMatch = service.description?.toLowerCase().includes(query);
        const categoryMatch = service.category?.toLowerCase().includes(query);
        return titleMatch || descMatch || categoryMatch;
      });
    }

    // 2. Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(service => service.category === selectedCategory);
    }

    // 3. Filter by price range
    if (activeFilters.priceRange !== 'all') {
      const priceRanges = {
        '0-25000': { min: 0, max: 25000 },
        '25000-50000': { min: 25000, max: 50000 },
        '50000-100000': { min: 50000, max: 100000 },
        '100000-250000': { min: 100000, max: 250000 },
        '250000+': { min: 250000, max: Infinity },
      };

      const range = priceRanges[activeFilters.priceRange];
      if (range) {
        result = result.filter(service => {
          const price = service.originalPrice;
          if (!price) return false;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // 4. Filter by discount range
    if (activeFilters.discountRange !== 'all') {
      const discountRanges = {
        '30+': 30,
        '40+': 40,
        '50+': 50,
      };

      const minDiscount = discountRanges[activeFilters.discountRange];
      if (minDiscount) {
        result = result.filter(service => {
          return service.discount && service.discount >= minDiscount;
        });
      }
    }

    // 5. Filter by availability
    if (activeFilters.availability !== 'all') {
      switch (activeFilters.availability) {
        case 'fixed-price':
          result = result.filter(service => service.originalPrice !== null);
          break;
        case 'quote':
          result = result.filter(service => service.originalPrice === null);
          break;
        case 'discounted':
          result = result.filter(service => service.discount && service.discount > 0);
          break;
        default:
          break;
      }
    }

    // 6. Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => {
          const priceA = a.originalPrice || Infinity;
          const priceB = b.originalPrice || Infinity;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        result.sort((a, b) => {
          const priceA = a.originalPrice || 0;
          const priceB = b.originalPrice || 0;
          return priceB - priceA;
        });
        break;
      case 'discount-high':
        result.sort((a, b) => {
          const discountA = a.discount || 0;
          const discountB = b.discount || 0;
          return discountB - discountA;
        });
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredServices(result);
  }, [services, selectedCategory, activeFilters, sortBy, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  return (
    <div className="services-page">
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortBy={sortBy}
        totalResults={filteredServices.length}
        activeFilters={activeFilters}
        searchQuery={searchQuery}
      />
      
      <div className="services-content">
        <ServicesList 
          services={filteredServices} 
          highlightServiceId={highlightServiceId}
        />
      </div>

      <style jsx>{`
        .services-page {
          min-height: 100vh;
          background: #f9fafb;
        }

        .services-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .services-page {
            background: #ffffff;
          }
        }
      `}</style>
    </div>
  );
}