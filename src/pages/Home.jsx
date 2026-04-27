import HeroSlider from '../components/home/Heroslider';
import CategoryNav from '../components/common/Categorynav';
import LiveServices from './Admin/LiveServices';
import TopDeals from '../components/home/TopDeals';
import BestDealOfDay from '../components/common/BestDealofday';
import CostEstimator from '../components/home/Costestimator';
import TestimonialSlider from '../components/home/TestimonialSlider';
import FAQSection from '../components/home/Faqsection';
import PartnerBrands from '../components/home/Partnerbrands';
import BlogSection from '../components/home/Blogsection';
import PlatformToggle from '../components/common/PlatformToggle'; // ✅ NEW

export default function Home() {
  return (
    <div>
      {/* ✅ NEW — Platform toggle (BuildPE ↔ Buy & Sell) */}
      <PlatformToggle active="buildpe" />

      {/* Category icon bar */}
      <CategoryNav />

      {/* Live Services strip */}
      <LiveServices />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Main Content Area */}
      <div className="home-wrapper">
        <div className="home-container">
          <div className="home-layout">
            <div className="main-content">
              <TopDeals />
            </div>
            <aside className="sidebar">
              <BestDealOfDay />
            </aside>
          </div>
        </div>
      </div>

      <CostEstimator />
      <TestimonialSlider />
      <PartnerBrands />
      <FAQSection />
      <BlogSection />

      <style jsx>{`
        .home-wrapper {
          width: 100%;
          padding: 0 16px;
          margin-bottom: 12px;
        }
        .home-container { width: 100%; }
        .home-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
          align-items: start;
        }
        .main-content { min-width: 0; width: 100%; }
        .sidebar { width: 100%; }

        @media (max-width: 768px) {
          .home-wrapper { padding: 0 8px; }
          .home-layout { grid-template-columns: 1fr; gap: 12px; }
          .sidebar { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}