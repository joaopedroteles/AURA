import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id && item.selectedSize === product.selectedSize);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.selectedSize === product.selectedSize ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const getTotal = useCallback(() => {
    return cartItems.reduce((total, product) => total + product.preco * product.quantity, 0).toFixed(2);
  }, [cartItems]);

  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const updateSize = useCallback((id, newSize) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, selectedSize: newSize } : item
      )
    );
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, updateSize, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};