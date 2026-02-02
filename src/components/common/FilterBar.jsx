import React, { useState } from 'react';
import { SlidersHorizontal, X, Grid3x3, List, ChevronDown, IndianRupee, Percent, CheckCircle } from 'lucide-react';

const FilterBar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSortChange,
  sortBy,
  totalResults,
  onFilterChange,
  activeFilters 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('category'); // 'category', 'price', 'discount'

  // Local filter states
  const [tempFilters, setTempFilters] = useState({
    category: selectedCategory,
    priceRange: activeFilters?.priceRange || 'all',
    discountRange: activeFilters?.discountRange || 'all',
    availability: activeFilters?.availability || 'all'
  });

  const sortOptions = [
    { value: 'default', label: 'Recomends' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'discount-high', label: 'Best Discounts' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices', min: 0, max: Infinity },
    { value: '0-25000', label: 'Under ₹25,000', min: 0, max: 25000 },
    { value: '25000-50000', label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { value: '100000-250000', label: '₹1,00,000 - ₹2,50,000', min: 100000, max: 250000 },
    { value: '250000+', label: 'Above ₹2,50,000', min: 250000, max: Infinity },
  ];

  const discountRanges = [
    { value: 'all', label: 'All Discounts' },
    { value: '30+', label: '30% or more', min: 30 },
    { value: '40+', label: '40% or more', min: 40 },
    { value: '50+', label: '50% or more', min: 50 },
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'fixed-price', label: 'Fixed Price Only' },
    { value: 'quote', label: 'Get Quote Services' },
    { value: 'discounted', label: 'On Sale' },
  ];

  const handleApplyFilters = () => {
    onCategoryChange(tempFilters.category);
    if (onFilterChange) {
      onFilterChange({
        priceRange: tempFilters.priceRange,
        discountRange: tempFilters.discountRange,
        availability: tempFilters.availability
      });
    }
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'All',
      priceRange: 'all',
      discountRange: 'all',
      availability: 'all'
    };
    setTempFilters(resetFilters);
    onCategoryChange('All');
    if (onFilterChange) {
      onFilterChange({
        priceRange: 'all',
        discountRange: 'all',
        availability: 'all'
      });
    }
  };

  const countActiveFilters = () => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (activeFilters?.priceRange && activeFilters.priceRange !== 'all') count++;
    if (activeFilters?.discountRange && activeFilters.discountRange !== 'all') count++;
    if (activeFilters?.availability && activeFilters.availability !== 'all') count++;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  return (
    <>
      <div className="filter-bar-wrapper">
        <div className="filter-bar">
          {/* Left Section - Results Count & Active Filters */}
          <div className="filter-left">
            <div className="results-info">
              <span className="results-count">{totalResults}</span>
              <span className="results-text">
                {totalResults === 1 ? 'Service' : 'Services'}
              </span>
            </div>
            
            {/* Active Filter Chips */}
            <div className="active-filters">
              {selectedCategory !== 'All' && (
                <div className="active-filter-chip">
                  <span>{selectedCategory}</span>
                  <button 
                    onClick={() => {
                      onCategoryChange('All');
                      setTempFilters(prev => ({ ...prev, category: 'All' }));
                    }}
                    className="clear-filter-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {activeFilters?.priceRange && activeFilters.priceRange !== 'all' && (
                <div className="active-filter-chip">
                  <IndianRupee size={12} />
                  <span>{priceRanges.find(r => r.value === activeFilters.priceRange)?.label}</span>
                  <button 
                    onClick={() => {
                      if (onFilterChange) {
                        onFilterChange({ ...activeFilters, priceRange: 'all' });
                      }
                    }}
                    className="clear-filter-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {activeFilters?.discountRange && activeFilters.discountRange !== 'all' && (
                <div className="active-filter-chip">
                  <Percent size={12} />
                  <span>{discountRanges.find(r => r.value === activeFilters.discountRange)?.label}</span>
                  <button 
                    onClick={() => {
                      if (onFilterChange) {
                        onFilterChange({ ...activeFilters, discountRange: 'all' });
                      }
                    }}
                    className="clear-filter-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {activeFilters?.availability && activeFilters.availability !== 'all' && (
                <div className="active-filter-chip">
                  <span>{availabilityOptions.find(o => o.value === activeFilters.availability)?.label}</span>
                  <button 
                    onClick={() => {
                      if (onFilterChange) {
                        onFilterChange({ ...activeFilters, availability: 'all' });
                      }
                    }}
                    className="clear-filter-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="filter-right">
            {/* All Filters Button */}
            <button 
              className="filter-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
              <ChevronDown 
                size={16} 
                className={`chevron ${isFilterOpen ? 'rotated' : ''}`}
              />
            </button>

            {/* Sort Dropdown */}
            <div className="sort-container">
              <select 
                value={sortBy} 
                onChange={(e) => onSortChange(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid3x3 size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Comprehensive Filter Panel */}
        {isFilterOpen && (
          <>
            <div className="filter-backdrop" onClick={() => setIsFilterOpen(false)} />
            <div className="filter-panel">
              <div className="filter-panel-header">
                <h3>All Filters</h3>
                <div className="header-actions">
                  <button onClick={handleResetFilters} className="reset-btn">
                    Reset All
                  </button>
                  <button onClick={() => setIsFilterOpen(false)} className="close-panel-btn">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeTab === 'category' ? 'active' : ''}`}
                  onClick={() => setActiveTab('category')}
                >
                  Category
                </button>
                <button 
                  className={`filter-tab ${activeTab === 'price' ? 'active' : ''}`}
                  onClick={() => setActiveTab('price')}
                >
                  <IndianRupee size={14} />
                  Price Range
                </button>
                <button 
                  className={`filter-tab ${activeTab === 'discount' ? 'active' : ''}`}
                  onClick={() => setActiveTab('discount')}
                >
                  <Percent size={14} />
                  Discount
                </button>
                <button 
                  className={`filter-tab ${activeTab === 'availability' ? 'active' : ''}`}
                  onClick={() => setActiveTab('availability')}
                >
                  <CheckCircle size={14} />
                  Availability
                </button>
              </div>

              {/* Filter Content */}
              <div className="filter-content">
                {/* Category Filter */}
                {activeTab === 'category' && (
                  <div className="filter-section">
                    <div className="category-grid">
                      <button
                        className={`category-card ${tempFilters.category === 'All' ? 'active' : ''}`}
                        onClick={() => setTempFilters(prev => ({ ...prev, category: 'All' }))}
                      >
                        <div className="category-icon">
                          <span className="icon-text">All</span>
                        </div>
                        <span className="category-name">All Services</span>
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`category-card ${tempFilters.category === category ? 'active' : ''}`}
                          onClick={() => setTempFilters(prev => ({ ...prev, category }))}
                        >
                          <div className="category-icon">
                            <span className="icon-text">{category.charAt(0)}</span>
                          </div>
                          <span className="category-name">{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                {activeTab === 'price' && (
                  <div className="filter-section">
                    <div className="option-list">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          className={`option-item ${tempFilters.priceRange === range.value ? 'active' : ''}`}
                          onClick={() => setTempFilters(prev => ({ ...prev, priceRange: range.value }))}
                        >
                          <span className="option-radio">
                            {tempFilters.priceRange === range.value && <span className="radio-dot" />}
                          </span>
                          <span className="option-label">{range.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discount Filter */}
                {activeTab === 'discount' && (
                  <div className="filter-section">
                    <div className="option-list">
                      {discountRanges.map((range) => (
                        <button
                          key={range.value}
                          className={`option-item ${tempFilters.discountRange === range.value ? 'active' : ''}`}
                          onClick={() => setTempFilters(prev => ({ ...prev, discountRange: range.value }))}
                        >
                          <span className="option-radio">
                            {tempFilters.discountRange === range.value && <span className="radio-dot" />}
                          </span>
                          <span className="option-label">{range.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability Filter */}
                {activeTab === 'availability' && (
                  <div className="filter-section">
                    <div className="option-list">
                      {availabilityOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`option-item ${tempFilters.availability === option.value ? 'active' : ''}`}
                          onClick={() => setTempFilters(prev => ({ ...prev, availability: option.value }))}
                        >
                          <span className="option-radio">
                            {tempFilters.availability === option.value && <span className="radio-dot" />}
                          </span>
                          <span className="option-label">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <div className="filter-actions">
                <button onClick={handleApplyFilters} className="apply-btn">
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .filter-bar-wrapper {
          position: sticky;
          top: 60px;
          z-index: 100;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .filter-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          flex-wrap: wrap;
        }

        .results-info {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .results-count {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .results-text {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .active-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .active-filter-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.1) 0%, rgba(248, 156, 28, 0.1) 100%);
          border: 1px solid #EC1940;
          border-radius: 20px;
          font-size: 12px;
          color: #EC1940;
          font-weight: 500;
        }

        .clear-filter-btn {
          background: none;
          border: none;
          color: #EC1940;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .clear-filter-btn:hover {
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
        }

        .filter-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .filter-btn:hover {
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.05) 0%, rgba(248, 156, 28, 0.05) 100%);
          border-color: #EC1940;
          color: #EC1940;
        }

        .chevron {
          transition: transform 0.2s;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        .filter-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          font-size: 11px;
          font-weight: 700;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(236, 25, 64, 0.3);
        }

        .sort-container {
          position: relative;
        }

        .sort-select {
          padding: 10px 36px 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: all 0.2s;
          min-width: 160px;
        }

        .sort-select:hover {
          border-color: #EC1940;
          background-color: rgba(236, 25, 64, 0.05);
        }

        .sort-select:focus {
          outline: none;
          border-color: #EC1940;
          box-shadow: 0 0 0 3px rgba(236, 25, 64, 0.1);
        }

        .view-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f3f4f6;
          padding: 4px;
          border-radius: 8px;
        }

        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .view-btn:hover {
          color: #374151;
        }

        .view-btn.active {
          background: white;
          color: #EC1940;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filter-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 99;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 0;
          max-width: 1400px;
          margin: 0 auto;
          animation: slideDown 0.25s ease;
          z-index: 101;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          max-height: 70vh;
          overflow-y: auto;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .filter-panel-header h3 {
          font-size: 18px;
          font-weight: 600;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reset-btn {
          background: none;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          border-color: #EC1940;
          color: #EC1940;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.05) 0%, rgba(248, 156, 28, 0.05) 100%);
        }

        .close-panel-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .close-panel-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .filter-tabs {
          display: flex;
          gap: 0;
          padding: 0 24px;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
          position: sticky;
          top: 61px;
          background: white;
          z-index: 1;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 14px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .filter-tab:hover {
          color: #374151;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.03) 0%, rgba(248, 156, 28, 0.03) 100%);
        }

        .filter-tab.active {
          color: #EC1940;
          border-bottom-color: #EC1940;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.05) 0%, rgba(248, 156, 28, 0.05) 100%);
        }

        .filter-content {
          padding: 24px;
          min-height: 300px;
        }

        .filter-section {
          animation: fadeIn 0.3s ease;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
        }

        .category-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .category-card:hover {
          border-color: #EC1940;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.03) 0%, rgba(248, 156, 28, 0.03) 100%);
          transform: translateY(-2px);
        }

        .category-card.active {
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.1) 0%, rgba(248, 156, 28, 0.1) 100%);
          border-color: #EC1940;
          box-shadow: 0 0 0 3px rgba(236, 25, 64, 0.1);
        }

        .category-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .category-card.active .category-icon {
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          box-shadow: 0 4px 12px rgba(236, 25, 64, 0.3);
        }

        .icon-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .category-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          line-height: 1.3;
        }

        .category-card.active .category-name {
          color: #EC1940;
          font-weight: 600;
        }

        .option-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 600px;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .option-item:hover {
          border-color: #EC1940;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.03) 0%, rgba(248, 156, 28, 0.03) 100%);
        }

        .option-item.active {
          border-color: #EC1940;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.1) 0%, rgba(248, 156, 28, 0.1) 100%);
        }

        .option-radio {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .option-item.active .option-radio {
          border-color: #EC1940;
        }

        .radio-dot {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          border-radius: 50%;
        }

        .option-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .option-item.active .option-label {
          color: #EC1940;
          font-weight: 600;
        }

        .filter-actions {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .apply-btn {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(236, 25, 64, 0.3);
        }

        .apply-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(236, 25, 64, 0.4);
        }

        .apply-btn:active {
          transform: translateY(0);
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .view-toggle {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .filter-bar {
            flex-wrap: wrap;
            padding: 12px 16px;
            gap: 10px;
          }

          .filter-left {
            width: 100%;
            order: 1;
          }

          .filter-right {
            width: 100%;
            order: 2;
          }

          .filter-btn {
            flex: 1;
            justify-content: center;
          }

          .sort-container {
            flex: 1;
          }

          .sort-select {
            width: 100%;
            min-width: unset;
          }

          .results-count {
            font-size: 20px;
          }

          .results-text {
            font-size: 13px;
          }

          .filter-panel {
            max-height: 80vh;
          }

          .filter-panel-header {
            padding: 16px;
          }

          .filter-tabs {
            padding: 0 16px;
          }

          .filter-tab {
            padding: 12px 16px;
            font-size: 13px;
          }

          .filter-content {
            padding: 16px;
          }

          .category-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
          }

          .category-card {
            padding: 12px 8px;
          }

          .category-icon {
            width: 40px;
            height: 40px;
          }

          .icon-text {
            font-size: 18px;
          }

          .category-name {
            font-size: 12px;
          }

          .option-item {
            padding: 12px 14px;
          }

          .filter-actions {
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default FilterBar;