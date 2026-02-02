import React, { useState } from 'react';
import { ProductModalContext } from './ProductModelContext';
import ProductDescription from '../components/common/Productdiscrption';

const ProductModalProvider = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  return (
    <ProductModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ProductDescription
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </ProductModalContext.Provider>
  );
};

export default ProductModalProvider;