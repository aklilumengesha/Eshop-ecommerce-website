import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import ReactStars from "react-rating-stars-component";
import { Store } from "@/utils/Store";
import { formatPrice } from "@/utils/currency";
import { toast } from "react-toastify";

export default function ProductItem({ product, addToCartHandler }) {
  const { state, dispatch } = useContext(Store);
  const { currency, wishlist } = state;

  const isInWishlist = wishlist.wishlistItems.some(
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

  // Truncate product name to first 4 words
  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return name;
  };

  return (
    <div className="card relative">
      <button
        onClick={toggleWishlistHandler}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isInWishlist ? "#ef4444" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke={isInWishlist ? "#ef4444" : "currentColor"}
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
      <Link href={`/product/${product.slug}`}>
        <Image
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover w-full h-64 object-top"
          height={400}
          width={400}
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 
            className="text-lg font-semibold hover:text-blue-600 transition-colors" 
            title={product.name}
          >
            {truncateName(product.name)}
          </h2>
        </Link>
        <p className="mb-2 text-gray-600">{product.brand}</p>
        <div className="flex items-center mb-2">
          <ReactStars
            count={5}
            size={24}
            activeColor="#ffd700"
            value={product.rating}
            edit={false}
          />
          <span className="ml-2 text-sm text-gray-600">
            ({product.numReviews})
          </span>
        </div>
        <p className="text-xl font-bold text-blue-600">{formatPrice(product.price, currency)}</p>
        <button
          className="primary-button mt-3"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
