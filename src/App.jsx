import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProductModalProvider from './context/ProductModelProvider';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';

// Admin pages
import Dashboard    from './pages/Admin/Dashboard';
import Users        from './pages/Admin/Users';
import AdminServices from './pages/Admin/Services';
import Categories   from './pages/Admin/Categories';
import Deals        from './pages/Admin/Deals';
import Specifications from './pages/Admin/Specifications'; // ✅ NEW

function Layout() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdmin && <Header />}
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

          {/* Admin */}
          <Route path="/admin"                   element={<Dashboard />} />
          <Route path="/admin/users"             element={<Users />} />
          <Route path="/admin/services"          element={<AdminServices />} />
          <Route path="/admin/categories"        element={<Categories />} />
          <Route path="/admin/deals"             element={<Deals />} />
          <Route path="/admin/specifications"    element={<Specifications />} /> {/* ✅ NEW */}
        </Routes>
      </main>
      {!isAdmin && <Footer />}
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