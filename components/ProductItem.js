import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Store } from "@/utils/Store";
import { formatPrice } from "@/utils/currency";
import { toast } from "react-toastify";
import ProductQuickView from "./ProductQuickView";
import SimilarProducts from "./SimilarProducts";
import LiveStockBadge from "./LiveStockBadge";
import { useInventory } from "@/hooks/useInventory";

export default function ProductItem({ product, addToCartHandler, allProducts }) {
  const { state, dispatch } = useContext(Store);
  const { currency, wishlist, compare } = state;
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  // Ensure product has images array (for backward compatibility)
  const productWithImages = {
    ...product,
    images: Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : []
  };

  // Debug logging
  console.log('ProductItem - product:', {
    name: product.name,
    hasImages: !!product.images,
    imagesIsArray: Array.isArray(product.images),
    imagesLength: product.images?.length,
    images: product.images,
    productWithImages: productWithImages.images
  });

  // Real-time inventory
  const { stock, isConnected, isLowStock, isSoldOut } = useInventory(
    product._id,
    product.countInStock
  );

  const isInWishlist = wishlist.wishlistItems.some(
    (item) => item.slug === product.slug
  );

  const isInCompare = compare.compareItems.some(
    (item) => item.slug === product.slug
  );

  const toggleWishlistHandler = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch({ type: "WISHLIST_REMOVE_ITEM", payload: product });
      toast.success("Removed from wishlist");
    } else {
      dispatch({ type: "WISHLIST_ADD_ITEM", payload: product });
      toast.success("Added to wishlist");
    }
  };

  const toggleCompareHandler = (e) => {
    e.preventDefault();
    if (isInCompare) {
      dispatch({ type: "COMPARE_REMOVE_ITEM", payload: product });
      toast.success("Removed from comparison");
    } else {
      if (compare.compareItems.length >= 4) {
        toast.error("Maximum 4 products can be compared");
        return;
      }
      dispatch({ type: "COMPARE_ADD_ITEM", payload: product });
      toast.success("Added to comparison");
    }
  };

  // Truncate product name to first 4 words
  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return name;
  };

  return (
    <>
      <article 
        className="card relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`${product.name} product card`}
      >
        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlistHandler}
            className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-600"
            aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isInWishlist}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isInWishlist ? "#ef4444" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={isInWishlist ? "#ef4444" : "currentColor"}
              className={`w-6 h-6 ${!isInWishlist ? 'text-gray-700 dark:text-gray-300' : ''}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>

          {/* Compare Button */}
          <button
            onClick={toggleCompareHandler}
            className={`rounded-full p-2 shadow-md hover:shadow-lg transition-all border ${
              isInCompare 
                ? "bg-purple-600 border-purple-600" 
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            }`}
            aria-label={isInCompare ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
            aria-pressed={isInCompare}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={isInCompare ? "white" : "currentColor"}
              className={`w-6 h-6 ${!isInCompare ? 'text-gray-700 dark:text-gray-300' : ''}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </button>
        </div>
        
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={`${product.name} - ${product.brand}`}
            className="rounded shadow object-cover w-full h-64 object-top"
            height={400}
            width={400}
          />
        </Link>

        <div className="flex flex-col items-center justify-center p-5">
          <Link href={`/product/${product.slug}`}>
            <h2 
              className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors dark:text-white" 
              title={product.name}
            >
              {truncateName(product.name)}
            </h2>
          </Link>
          <p className="mb-2 text-gray-600 dark:text-gray-300">{product.brand}</p>
          <div className="flex items-center mb-2" role="img" aria-label={`Rated ${product.rating} out of 5 stars with ${product.numReviews} reviews`}>
            <ReactStars
              count={5}
              size={24}
              activeColor="#ffd700"
              value={product.rating}
              edit={false}
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300" aria-hidden="true">
              ({product.numReviews})
            </span>
          </div>
          
          {/* Live Stock Badge */}
          <div className="mb-2">
            <LiveStockBadge 
              stock={stock}
              isConnected={isConnected}
              isLowStock={isLowStock}
              isSoldOut={isSoldOut}
              size="sm"
            />
          </div>
          
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(product.price, currency)}</p>
          
          {/* Add to Cart button - always visible */}
          <button
            className="primary-button mt-3 w-full"
            type="button"
            onClick={() => addToCartHandler(product)}
            disabled={isSoldOut}
            aria-label={isSoldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            {isSoldOut ? 'Out of Stock' : 'Add to cart'}
          </button>
          
          {/* Notify Me link for out of stock products */}
          {isSoldOut && (
            <Link href={`/product/${product.slug}`}>
              <div className="text-center mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Get notified when available
              </div>
            </Link>
          )}
          
          {/* Hover action buttons - shown on hover below Add to Cart */}
          <div
            className={`flex gap-2 mt-2 w-full transition-all duration-300 ${
              isHovered ? "opacity-100 visible max-h-20" : "opacity-0 invisible max-h-0"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors text-sm"
              aria-label={`Quick view for ${product.name}`}
            >
              Quick View
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowSimilar(true);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors text-sm"
              aria-label={`View products similar to ${product.name}`}
            >
              Similar
            </button>
          </div>
        </div>
      </article>

      {/* Modals */}
      <ProductQuickView
        product={productWithImages}
        isOpen={showQuickView}
        closeModal={() => setShowQuickView(false)}
        currency={currency}
        onAddToCart={addToCartHandler}
      />

      <SimilarProducts
        product={productWithImages}
        allProducts={allProducts || []}
        isOpen={showSimilar}
        closeModal={() => setShowSimilar(false)}
        currency={currency}
        onAddToCart={addToCartHandler}
      />
    </>
  );
}
