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

export default function Home({ featuredProducts, products }) {
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
        <div className="mb-8">
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {featuredProducts.map((product) => (
              <div key={product._id} className="relative">
                <Link href={`/product/${product.slug}`} passHref>
                  <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-lg">
                    <Image
                      src={product.banner}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                        {product.name}
                      </h2>
                      <p className="text-white text-lg md:text-xl font-semibold">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      )}
      
      <h1 className="text-3xl font-bold my-4">Latest Products</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  );
  await db.disconnect();
  
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
