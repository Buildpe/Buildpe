import { Calculator, Home, Ruler, IndianRupee, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export default function CostEstimator() {
  const [formData, setFormData] = useState({
    roomType: '',
    area: '',
    budget: '',
    style: ''
  });

  const [estimate, setEstimate] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const roomTypes = [
    { value: 'living-room', label: 'Living Room', multiplier: 1.2 },
    { value: 'bedroom', label: 'Bedroom', multiplier: 1.0 },
    { value: 'kitchen', label: 'Modular Kitchen', multiplier: 1.5 },
    { value: 'complete-home', label: 'Complete Home', multiplier: 1.1 },
    { value: 'bathroom', label: 'Bathroom', multiplier: 1.3 },
    { value: 'kids-room', label: 'Kids Room', multiplier: 1.1 }
  ];

  const budgetRanges = [
    { value: 'economy', label: 'Economy', baseRate: 1200 },
    { value: 'standard', label: 'Standard', baseRate: 1800 },
    { value: 'premium', label: 'Premium', baseRate: 2500 },
    { value: 'luxury', label: 'Luxury', baseRate: 3500 }
  ];

  const styles = [
    { value: 'modern', label: 'Modern' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'minimalist', label: 'Minimalist' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowResults(false);
  };

  const calculateEstimate = () => {
    const room = roomTypes.find(r => r.value === formData.roomType);
    const budget = budgetRanges.find(b => b.value === formData.budget);
    const area = parseFloat(formData.area);

    if (!room || !budget || !area || !formData.style) {
      alert('Please fill all fields');
      return;
    }

    const basePrice = area * budget.baseRate * room.multiplier;
    const minPrice = Math.floor(basePrice * 0.9);
    const maxPrice = Math.floor(basePrice * 1.1);

    setEstimate({
      min: minPrice,
      max: maxPrice,
      average: Math.floor((minPrice + maxPrice) / 2),
      perSqFt: Math.floor(budget.baseRate * room.multiplier),
      timeline: area < 100 ? '2-3 weeks' : area < 200 ? '4-6 weeks' : '6-8 weeks'
    });

    setShowResults(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="estimator-section">
      <div className="estimator-container">
        <div className="estimator-grid">
          {/* Left Column - Form */}
          <div className="form-column">
            <div className="form-header">
              <div className="header-icon">
                <Calculator size={28} />
              </div>
              <h2>Get Instant Cost Estimate</h2>
              <p>Calculate your interior project budget in seconds</p>
            </div>

            <div className="estimator-form">
              {/* Room Type */}
              <div className="form-group">
                <label>
                  <Home size={18} />
                  Select Room Type
                </label>
                <div className="radio-grid">
                  {roomTypes.map(room => (
                    <button
                      key={room.value}
                      type="button"
                      className={`radio-card ${formData.roomType === room.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('roomType', room.value)}
                    >
                      {formData.roomType === room.value && (
                        <Check className="check-icon" size={16} />
                      )}
                      {room.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Input */}
              <div className="form-group">
                <label>
                  <Ruler size={18} />
                  Carpet Area (sq. ft.)
                </label>
                <input
                  type="number"
                  placeholder="Enter area in square feet"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="input-field"
                  min="50"
                  max="5000"
                />
              </div>

              {/* Budget Range */}
              <div className="form-group">
                <label>
                  <IndianRupee size={18} />
                  Budget Range
                </label>
                <div className="select-grid">
                  {budgetRanges.map(budget => (
                    <button
                      key={budget.value}
                      type="button"
                      className={`select-card ${formData.budget === budget.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('budget', budget.value)}
                    >
                      <span className="budget-label">{budget.label}</span>
                      <span className="budget-rate">₹{budget.baseRate}/sq.ft</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Preference */}
              <div className="form-group">
                <label>Design Style</label>
                <select
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="select-field"
                >
                  <option value="">Choose a style</option>
                  {styles.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className="calculate-btn"
                onClick={calculateEstimate}
              >
                Calculate Estimate
                <ArrowRight size={20} />
              </button>

              <p className="disclaimer">
                * This is an approximate estimate. Final pricing may vary based on actual requirements and site conditions.
              </p>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="results-column">
            {!showResults ? (
              <div className="placeholder-state">
                <div className="placeholder-icon">
                  <Calculator size={64} />
                </div>
                <h3>Your Estimate Will Appear Here</h3>
                <p>Fill in the details on the left to get an instant cost estimate for your interior project</p>
                <div className="features-list">
                  <div className="feature">
                    <Check size={18} />
                    <span>Instant calculation</span>
                  </div>
                  <div className="feature">
                    <Check size={18} />
                    <span>No hidden charges</span>
                  </div>
                  <div className="feature">
                    <Check size={18} />
                    <span>Free consultation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="results-content">
                <div className="results-header">
                  <h3>Your Estimated Cost</h3>
                  <span className="estimate-badge">Instant Estimate</span>
                </div>

                <div className="price-display">
                  <div className="price-range">
                    <span className="price-label">Estimated Range</span>
                    <div className="price-value">
                      {formatPrice(estimate.min)} - {formatPrice(estimate.max)}
                    </div>
                  </div>
                  
                  <div className="average-price">
                    <span className="avg-label">Average Cost</span>
                    <div className="avg-value">{formatPrice(estimate.average)}</div>
                  </div>
                </div>

                <div className="breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Per Sq. Ft. Rate</span>
                    <span className="breakdown-value">₹{estimate.perSqFt}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Total Area</span>
                    <span className="breakdown-value">{formData.area} sq. ft.</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Est. Timeline</span>
                    <span className="breakdown-value">{estimate.timeline}</span>
                  </div>
                </div>

                <div className="whats-included">
                  <h4>What's Included:</h4>
                  <ul>
                    <li><Check size={16} /> Design & 3D visualization</li>
                    <li><Check size={16} /> Premium materials</li>
                    <li><Check size={16} /> Installation & labor</li>
                    <li><Check size={16} /> Hardware & fittings</li>
                    <li><Check size={16} /> 5-10 years warranty</li>
                  </ul>
                </div>

                <button className="consultation-btn">
                  Book Free Consultation
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .estimator-section {
          padding: 12px 16px;
          background: #fff;
        }

        .estimator-container {
          width: 100%;
          margin: 0 auto;
          border: 2px solid #d4d4d4;
          border-radius: 8px;
          padding: 24px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }

        .estimator-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .form-column,
        .results-column {
          background: #fff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .form-header h2 {
          font-size: 26px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .form-header p {
          font-size: 15px;
          color: #666;
          margin: 0;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .radio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .radio-card {
          position: relative;
          padding: 14px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        .radio-card:hover {
          border-color: #e74c3c;
          background: #fff5f4;
        }

        .radio-card.selected {
          border-color: #e74c3c;
          background: #e74c3c;
          color: #fff;
        }

        .check-icon {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #e74c3c;
          background: #fff5f4;
        }

        .select-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .select-card {
          padding: 14px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .select-card:hover {
          border-color: #e74c3c;
          background: #fff5f4;
        }

        .select-card.selected {
          border-color: #e74c3c;
          background: #e74c3c;
          color: #fff;
        }

        .budget-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .budget-rate {
          display: block;
          font-size: 12px;
          opacity: 0.8;
        }

        .select-field {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .select-field:focus {
          outline: none;
          border-color: #e74c3c;
        }

        .calculate-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-top: 32px;
        }

        .calculate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(231, 76, 60, 0.3);
        }

        .disclaimer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin: 16px 0 0 0;
          line-height: 1.5;
        }

        .placeholder-state {
          text-align: center;
          padding: 40px 20px;
        }

        .placeholder-icon {
          width: 100px;
          height: 100px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #ccc;
        }

        .placeholder-state h3 {
          font-size: 22px;
          color: #333;
          margin: 0 0 12px 0;
        }

        .placeholder-state p {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 32px 0;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 250px;
          margin: 0 auto;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #333;
          font-size: 14px;
        }

        .feature svg {
          color: #27ae60;
          flex-shrink: 0;
        }

        .results-content {
          animation: slideIn 0.4s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .results-header h3 {
          font-size: 22px;
          color: #1a1a1a;
          margin: 0;
        }

        .estimate-badge {
          background: #27ae60;
          color: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .price-display {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          padding: 30px;
          border-radius: 12px;
          color: #fff;
          margin-bottom: 24px;
        }

        .price-range {
          margin-bottom: 20px;
        }

        .price-label {
          font-size: 14px;
          opacity: 0.9;
          display: block;
          margin-bottom: 8px;
        }

        .price-value {
          font-size: 28px;
          font-weight: 700;
        }

        .average-price {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .avg-label {
          font-size: 13px;
          opacity: 0.9;
          display: block;
          margin-bottom: 6px;
        }

        .avg-value {
          font-size: 22px;
          font-weight: 600;
        }

        .breakdown {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .breakdown-item:last-child {
          border-bottom: none;
        }

        .breakdown-label {
          font-size: 14px;
          color: #666;
        }

        .breakdown-value {
          font-size: 15px;
          font-weight: 700;
          color: #333;
        }

        .whats-included {
          margin-bottom: 24px;
        }

        .whats-included h4 {
          font-size: 16px;
          margin: 0 0 12px 0;
          color: #333;
        }

        .whats-included ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .whats-included li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 14px;
          color: #555;
        }

        .whats-included li svg {
          color: #27ae60;
          flex-shrink: 0;
        }

        .consultation-btn {
          width: 100%;
          padding: 16px;
          background: #27ae60;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .consultation-btn:hover {
          background: #229954;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(39, 174, 96, 0.3);
        }

        @media (max-width: 968px) {
          .estimator-grid {
            grid-template-columns: 1fr;
          }

          .results-column {
            order: 2;
          }

          .form-column {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          .estimator-section {
            padding: 12px 12px;
          }

          .form-column,
          .results-column {
            padding: 24px;
          }

          .radio-grid,
          .select-grid {
            grid-template-columns: 1fr;
          }

          .form-header h2 {
            font-size: 22px;
          }

          .price-value {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}