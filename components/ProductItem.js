import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReactStars from "react-rating-stars-component";

export default function ProductItem({ product, addToCartHandler }) {
  // Truncate product name to first 4 words
  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return name;
  };

  return (
    <div className="card">
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
        <p className="text-xl font-bold text-blue-600">${product.price}</p>
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
