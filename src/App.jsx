import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductModalProvider from './context/ProductModelProvider';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <ProductModalProvider>
        <div className="app">
          <Header />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </ProductModalProvider>
    </BrowserRouter>
  );
}

export default App;