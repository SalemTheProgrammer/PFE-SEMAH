import React, { useState } from 'react';
import './Products.css';

const initialProducts = [
  { id: 1, name: 'Shampoo', price: 10, image: '/images/shampoo.jpg' },
  { id: 2, name: 'Conditioner', price: 12, image: '/images/conditioner.jpg' },
  { id: 3, name: 'Hair Gel', price: 8, image: '/images/hair-gel.jpg' },
  { id: 4, name: 'Hair Brush', price: 15, image: '/images/hair-brush.jpg' },
  { id: 5, name: 'Hair Clippers', price: 50, image: '/images/hair-clippers.jpg' },
  { id: 6, name: 'Beard Oil', price: 20, image: '/images/beard-oil.jpg' },
  { id: 7, name: 'Hair Spray', price: 11, image: '/images/hair-spray.jpg' },
  { id: 8, name: 'Barber Scissors', price: 25, image: '/images/barber-scissors.jpg' },
  { id: 9, name: 'Shaving Cream', price: 9, image: '/images/shaving-cream.jpg' },
  { id: 10, name: 'Aftershave Lotion', price: 18, image: '/images/aftershave-lotion.jpg' },
];

const Products = ({ user }) => {
  const [cart, setCart] = useState({});
  const [isCartVisible, setCartVisible] = useState(false);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.id]) {
        newCart[product.id].quantity += 1;
      } else {
        newCart[product.id] = {
          name: product.name,
          quantity: 1,
          price: product.price,
        };
      }
      return newCart;
    });
  };

  const handleToggleCart = () => {
    setCartVisible(!isCartVisible);
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + (item.price ? (item.price * item.quantity) : 0);
    }, 0).toFixed(2);
  };

  const handleProceed = async () => {
    const token = user?.token || localStorage.getItem('token');
  
    if (!token) {
      alert('You must be logged in to proceed.');
      return;
    }
  
    try {
      const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
      console.log('loginResponse:', loginResponse);
      const email = loginResponse?.user.email 
      console.log('email:', email);
      console.log('cart:', cart);
      if (email) {
        await fetch('http://localhost:3000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ cart, email }),
        });
        alert('Email sent successfully!');
        setCart({});
      } else {
        alert('Email address is required.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <div className="products-container">
      <h1>Our Products</h1>
      <div className="products-grid">
        {initialProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <button className="cart-toggle-button" onClick={handleToggleCart}>
        {isCartVisible ? 'Hide Cart' : 'Show Cart'}
      </button>
      {isCartVisible && (
        <div className="cart-summary">
          <h2>Cart Summary</h2>
          <ul>
            {Object.entries(cart).map(([productId, item]) => (
              <li key={productId}>
                {item.name}: {item.quantity} x ${item.price ? item.price.toFixed(2) : '0.00'}
              </li>
            ))}
          </ul>
          {Object.keys(cart).length > 0 && (
            <h3>Total: ${calculateTotal()}</h3>
          )}
          <button className="proceed-button" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;