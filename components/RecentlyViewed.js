import React, { useState, useEffect, useContext } from 'react';
import { getRecentlyViewed } from '@/utils/recentlyViewed';
import ProductItem from './ProductItem';
import { Store } from '@/utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function RecentlyViewed({ currentProductSlug = null, limit = 12 }) {
  const [recentProducts, setRecentProducts] = useState([]);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  useEffect(() => {
    // Get recently viewed products from localStorage
    let products = getRecentlyViewed();
    
    // Filter out current product if on product detail page
    if (currentProductSlug) {
      products = products.filter(p => p.slug !== currentProductSlug);
    }
    
    // Apply limit
    if (limit) {
      products = products.slice(0, limit);
    }
    
    setRecentProducts(products);
  }, [currentProductSlug, limit]);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });

    toast.success('Product added to the cart');
  };

  // Don't render if no products
  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Recently Viewed</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{recentProducts.length} {recentProducts.length === 1 ? 'product' : 'products'}</span>
        </div>
      </div>
      
      {/* Horizontal scroll container */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {recentProducts.map((product) => (
            <div 
              key={product.slug} 
              className="flex-none w-72 snap-start"
            >
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
                allProducts={recentProducts}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
