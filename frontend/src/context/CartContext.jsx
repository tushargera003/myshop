import { createContext, useState } from "react";

// Create Context
export const CartContext = createContext();

// Create Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Clear cart function
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
