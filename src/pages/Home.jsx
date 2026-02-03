import HeroSlider from '../components/home/Heroslider';
import CategoryNav from '../components/common/Categorynav';
import TopDeals from '../components/home/TopDeals';
import BestDealOfDay from '../components/common/BestDealofday';
import CostEstimator from '../components/home/Costestimator';
import TestimonialSlider from '../components/home/TestimonialSlider';
import FAQSection from '../components/home/Faqsection';
import PartnerBrands from '../components/home/Partnerbrands';
import BlogSection from '../components/home/Blogsection';

export default function Home() {
  return (
    <div>
      <CategoryNav />
      
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Main Content Area - Matching HeroSlider padding */}
      <div className="home-wrapper">
        <div className="home-container">
          <div className="home-layout">
            {/* Main Content Column */}
            <div className="main-content">
              <TopDeals />
            </div>

            {/* Sidebar Column */}
            <aside className="sidebar">
              <BestDealOfDay />
            </aside>
          </div>
        </div>
      </div>

      {/* Cost Calculator/Estimator Widget */}
      <CostEstimator />

      {/* Customer Testimonials Video Slider */}
      <TestimonialSlider />

      {/* Partner Brands Carousel */}
      <PartnerBrands />

      {/* FAQ Section */}
      <FAQSection />

      {/* Blog/Tips Section */}
      <BlogSection />

      {/* Inline styles matching HeroSlider dimensions */}
      <style jsx>{`
        .home-wrapper {
          width: 100%;
          padding: 0 16px;
          margin-bottom: 12px;
        }

        .home-container {
          width: 100%;
        }

        .home-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
          align-items: start;
        }

        .main-content {
          min-width: 0;
          width: 100%;
        }

        .sidebar {
          width: 100%;
        }

        /* Mobile - Match HeroSlider mobile padding */
        @media (max-width: 768px) {
          .home-wrapper {
            padding: 0 8px;
          }

          .home-layout {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .sidebar {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}