import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/common/FilterBar';
import ServicesList from '../components/services/ServicesList';
import { getAllCategories, getServicesByCategory } from '../Services/Categoryapi';

export default function Services() {
  const location = useLocation();

  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: get all categories
        const loadedCategories = await getAllCategories();
        setCategories(loadedCategories);

        // Step 2: for each category fetch its services and tag with category name
        const serviceArrays = await Promise.all(
          loadedCategories.map(async (cat) => {
            const services = await getServicesByCategory(cat.id);
            return services.map((svc) => ({
              id: String(svc.id),
              title: svc.title,
              description: svc.description,
              price: svc.price && svc.price > 0
                ? `₹${svc.price.toLocaleString('en-IN')}`
                : 'Get Quote!',
              originalPrice: svc.price && svc.price > 0 ? svc.price : null,
              discount: svc.discount && svc.discount > 0 ? svc.discount : null,
              image: svc.imgUrl || svc.img_url || null,
              category: cat.name,
              categoryId: cat.id,
            }));
          })
        );

        // Step 3: flatten + deduplicate by id
        const seen = new Set();
        const merged = serviceArrays.flat().filter((svc) => {
          if (seen.has(svc.id)) return false;
          seen.add(svc.id);
          return true;
        });

        setAllServices(merged);
        setFilteredServices(merged);
        console.log(`✅ Loaded ${merged.length} services across ${loadedCategories.length} categories`);
      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ── Handle navigation state ───────────────────────────────────────────────
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
      setSearchQuery('');
    }

    if (location.state?.highlightServiceId) {
      setHighlightServiceId(location.state.highlightServiceId);
      setSearchQuery('');
      setTimeout(() => {
        const el = document.getElementById(`service-${location.state.highlightServiceId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      setTimeout(() => setHighlightServiceId(null), 3000);
    }

    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      setSelectedCategory('All');
    }
  }, [location.state]);

  // ── Apply filters ─────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...allServices];

    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (selectedCategory !== 'All') {
      result = result.filter(s => s.category === selectedCategory);
    }

    // 3. Price range
    if (activeFilters.priceRange !== 'all') {
      const ranges = {
        '0-25000':       { min: 0,      max: 25000 },
        '25000-50000':   { min: 25000,  max: 50000 },
        '50000-100000':  { min: 50000,  max: 100000 },
        '100000-250000': { min: 100000, max: 250000 },
        '250000+':       { min: 250000, max: Infinity },
      };
      const range = ranges[activeFilters.priceRange];
      if (range) {
        result = result.filter(s =>
          s.originalPrice && s.originalPrice >= range.min && s.originalPrice <= range.max
        );
      }
    }

    // 4. Discount
    if (activeFilters.discountRange !== 'all') {
      const min = { '30+': 30, '40+': 40, '50+': 50 }[activeFilters.discountRange];
      if (min) result = result.filter(s => s.discount && s.discount >= min);
    }

    // 5. Availability
    if (activeFilters.availability !== 'all') {
      switch (activeFilters.availability) {
        case 'fixed-price':
          result = result.filter(s => s.originalPrice && s.originalPrice > 0); break;
        case 'quote':
          result = result.filter(s => !s.originalPrice); break;
        case 'discounted':
          result = result.filter(s => s.discount && s.discount > 0); break;
        default: break;
      }
    }

    // 6. Sort
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => (a.originalPrice || Infinity) - (b.originalPrice || Infinity)); break;
      case 'price-high-low':
        result.sort((a, b) => (b.originalPrice || 0) - (a.originalPrice || 0)); break;
      case 'discount-high':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title)); break;
      default: break;
    }

    setFilteredServices(result);
  }, [allServices, selectedCategory, activeFilters, sortBy, searchQuery]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={centerStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading services...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={pageStyle}>
        <div style={centerStyle}>
          <p style={{ color: '#dc2626', fontSize: '1.125rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={retryBtnStyle}>Retry</button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <FilterBar
        categories={categories.map(c => c.name)}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => { setSelectedCategory(cat); setSearchQuery(''); }}
        onFilterChange={setActiveFilters}
        onSortChange={setSortBy}
        sortBy={sortBy}
        totalResults={filteredServices.length}
        activeFilters={activeFilters}
        searchQuery={searchQuery}
      />
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <ServicesList services={filteredServices} highlightServiceId={highlightServiceId} />
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' };
const spinnerStyle = { width: '50px', height: '50px', border: '5px solid #f3f4f6', borderTop: '5px solid #EC1940', borderRadius: '50%', animation: 'spin 1s linear infinite' };
const retryBtnStyle = { padding: '0.75rem 2rem', background: '#EC1940', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' };
