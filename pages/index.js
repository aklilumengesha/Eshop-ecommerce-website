import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/HeroCarousel";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";
import Product from "@/models/Product";
import db from "@/utils/db";
import { Store } from "@/utils/Store";
import axios from "axios";
import Link from "next/link";
import { useContext } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";

export default function Home({ featuredProducts = [], products = [], productsByCategory = {} }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="Home">
      {/* Enhanced Hero Carousel */}
      {featuredProducts.length > 0 && (
        <HeroCarousel 
          featuredProducts={featuredProducts} 
          addToCartHandler={addToCartHandler}
        />
      )}
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Latest Products */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Latest Products</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
              allProducts={products}
            />
          ))}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewed limit={8} />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Products by Category */}
      {productsByCategory && Object.keys(productsByCategory).map((category) => (
        <div key={category} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">{category}</h2>
            <Link 
              href={`/search?category=${category}`}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productsByCategory[category].slice(0, 4).map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addToCartHandler={addToCartHandler}
                allProducts={products}
              />
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean().sort({ createdAt: -1 });
  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  );
  
  // Group products by category
  const productsByCategory = {};
  products.forEach((product) => {
    const category = product.category;
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });
  
  await db.disconnect();
  
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
      productsByCategory: Object.keys(productsByCategory).reduce((acc, key) => {
        acc[key] = productsByCategory[key].map(db.convertDocToObj);
        return acc;
      }, {}),
    },
  };
}
