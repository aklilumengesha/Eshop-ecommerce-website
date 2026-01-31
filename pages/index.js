import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import Product from "@/models/Product";
import db from "@/utils/db";
import { Store } from "@/utils/Store";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
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
      {featuredProducts.length > 0 && (
        <div className="-mx-8 md:-mx-12 xl:-mx-14 mb-8">
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {featuredProducts.map((product) => (
              <div key={product._id} className="relative">
                <Link href={`/product/${product.slug}`} passHref>
                  <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                    <Image
                      src={product.banner}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 md:p-12">
                      <div className="max-w-7xl mx-auto px-8">
                        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                          {product.name}
                        </h2>
                        <p className="text-white text-xl md:text-3xl lg:text-4xl font-semibold mb-4">
                          ${product.price}
                        </p>
                        <button className="bg-white text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-gray-100 transition-colors">
                          Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      )}
      
      {/* Latest Products */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Latest Products</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            />
          ))}
        </div>
      </div>

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
