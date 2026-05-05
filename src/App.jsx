import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProductModalProvider from './context/ProductModelProvider';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Public
import Home          from './pages/Home';
import Services      from './pages/Services';
import About         from './pages/About';
import Contact       from './pages/Contact';
import Login         from './pages/Login';
import Register      from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';

// Buy & Sell — all standalone (no Header/Footer)
import BuySell            from './pages/BuySell';
import BuySellMap         from './pages/BuySellMap';
import BuySellBuy         from './pages/BuySellBuy';
import BuySellSell        from './pages/BuySellSell';
import BuySellListings    from './pages/BuySellListings';
import BuySellProperty    from './pages/BuySellProperty';
import BuySellPostListing from './pages/BuySellPostListing';

// Admin
import Dashboard      from './pages/Admin/Dashboard';
import Users          from './pages/Admin/Users';
import AdminServices  from './pages/Admin/Services';
import Categories     from './pages/Admin/Categories';
import Deals          from './pages/Admin/Deals';
import Specifications from './pages/Admin/Specifications';

// Blog
import AllBlogs  from './pages/AllBlogs';
import BlogPost  from './pages/BlogPost';
import AdminListings  from './pages/Admin/AdminListings';

function Layout() {
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith('/admin') || pathname.startsWith('/buy-sell');
  return (
    <div className="app">
      {!hideChrome && <Header />}
      <main>
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Home />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Buy & Sell */}
          <Route path="/buy-sell"                  element={<BuySell />} />
          <Route path="/buy-sell/map"              element={<BuySellMap />} />
          <Route path="/buy-sell/buy"              element={<BuySellBuy />} />
          <Route path="/buy-sell/sell"             element={<BuySellSell />} />
          <Route path="/buy-sell/buy/listings"     element={<BuySellListings />} />
          <Route path="/buy-sell/property/:id"     element={<BuySellProperty />} />
          <Route path="/buy-sell/sell/post"        element={<BuySellPostListing />} />

          {/* Admin */}
          <Route path="/admin"                element={<Dashboard />} />
          <Route path="/admin/users"          element={<Users />} />
          <Route path="/admin/services"       element={<AdminServices />} />
          <Route path="/admin/categories"     element={<Categories />} />
          <Route path="/admin/deals"          element={<Deals />} />
          <Route path="/admin/specifications" element={<Specifications />} />
          <Route path="/admin/listings"       element={<AdminListings />} />
          <Route path="/blogs"               element={<AllBlogs />} />
          <Route path="/blogs/:slug"         element={<BlogPost />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProductModalProvider>
        <Layout />
      </ProductModalProvider>
    </BrowserRouter>
  );
}