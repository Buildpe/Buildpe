import { createContext, useContext } from 'react';

// Create Context
export const ProductModalContext = createContext();

// Custom hook to use the modal
export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within ProductModalProvider');
  }
  return context;
};