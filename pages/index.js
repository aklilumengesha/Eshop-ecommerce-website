import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/HeroCarousel";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";
import NewsletterSection from "@/components/NewsletterSection";
import BrandShowcase from "@/components/BrandShowcase";
import CategoryShowcase from "@/components/CategoryShowcase";
import { SkeletonHeroCarousel, SkeletonProductGrid } from "@/components/skeletons";
import Product from "@/models/Product";
import Category from "@/models/Category";
import db from "@/utils/db";
import { Store } from "@/utils/Store";
import axios from "axios";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";

export default function Home({ featuredProducts = [], products = [], productsByCategory = {}, brands = [], categories = [], settings = {} }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [isLoading, setIsLoading] = useState(true);

  // Debug: Log settings
  useEffect(() => {
    console.log('Homepage Settings:', settings);
  }, [settings]);

  // Ensure settings have defaults
  const siteSettings = {
    latestProductsEnabled: settings.latestProductsEnabled !== false,
    latestProductsHeading: settings.latestProductsHeading || 'Latest Products',
    latestProductsCount: settings.latestProductsCount || 8,
    categoryProductsEnabled: settings.categoryProductsEnabled !== false,
    categoryProductsViewAllText: settings.categoryProductsViewAllText || 'View All',
    categoryProductsCount: settings.categoryProductsCount || 4,
    brandShowcaseEnabled: settings.brandShowcaseEnabled !== false,
    testimonialsEnabled: settings.testimonialsEnabled !== false,
    recentlyViewedEnabled: settings.recentlyViewedEnabled !== false,
    recentlyViewedLimit: settings.recentlyViewedLimit || 8,
    newsletterEnabled: settings.newsletterEnabled !== false,
    ...settings,
  };

  useEffect(() => {
    // Simulate initial loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
      {isLoading ? (
        <SkeletonHeroCarousel />
      ) : (
        featuredProducts.length > 0 && (
          <HeroCarousel 
            featuredProducts={featuredProducts} 
            addToCartHandler={addToCartHandler}
          />
        )
      )}
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Category Showcase */}
      <CategoryShowcase categories={categories} />
      
      {/* Brand Showcase */}
      {siteSettings.brandShowcaseEnabled && brands.length > 0 && (
        <BrandShowcase brands={brands} settings={siteSettings} />
      )}
      
      {/* Latest Products */}
      {siteSettings.latestProductsEnabled && (
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">{siteSettings.latestProductsHeading}</h1>
          {isLoading ? (
            <SkeletonProductGrid count={siteSettings.latestProductsCount} />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, siteSettings.latestProductsCount).map((product) => (
                <ProductItem
                  product={product}
                  key={product.slug}
                  addToCartHandler={addToCartHandler}
                  allProducts={products}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recently Viewed Products */}
      {siteSettings.recentlyViewedEnabled && (
        <RecentlyViewed limit={siteSettings.recentlyViewedLimit} />
      )}

      {/* Customer Testimonials */}
      {siteSettings.testimonialsEnabled && <Testimonials settings={siteSettings} />}

      {/* Products by Category */}
      {siteSettings.categoryProductsEnabled && (
        isLoading ? (
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <SkeletonProductGrid count={siteSettings.categoryProductsCount} />
          </div>
        ) : (
          productsByCategory && Object.keys(productsByCategory).map((category) => (
            <div key={category} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{category}</h2>
                <Link 
                  href={`/search?category=${category}`}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  {siteSettings.categoryProductsViewAllText}
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
                {productsByCategory[category].slice(0, siteSettings.categoryProductsCount).map((product) => (
                  <ProductItem
                    product={product}
                    key={product.slug}
                    addToCartHandler={addToCartHandler}
                    allProducts={products}
                  />
                ))}
              </div>
            </div>
          ))
        )
      )}

      {/* Newsletter Subscription */}
      {siteSettings.newsletterEnabled && <NewsletterSection />}
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
  
  // Get all unique categories from products
  const productCategories = await Product.distinct('category');
  
  // Get styling info from Category collection
  const categoryStyles = await Category.find({}).lean();
  const styleMap = {};
  categoryStyles.forEach(cat => {
    styleMap[cat.name] = cat;
  });
  
  // Combine product categories with their styling
  const categoriesWithCounts = productCategories.map((categoryName) => {
    const productCount = products.filter(p => p.category === categoryName).length;
    const style = styleMap[categoryName] || {};
    
    return {
      name: categoryName,
      icon: style.icon || '📦',
      gradient: style.gradient || 'from-blue-500 to-cyan-500',
      bgColor: style.bgColor || 'bg-blue-50 dark:bg-blue-900/20',
      image: style.image || '',
      description: style.description || '',
      order: style.order || 0,
      productCount,
    };
  }).filter(cat => cat.productCount > 0); // Only show categories with products
  
  // Sort by order, then by name
  categoriesWithCounts.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
  
  // Extract and count brands
  const brandMap = {};
  products.forEach((product) => {
    const brand = product.brand;
    if (brand) {
      if (!brandMap[brand]) {
        brandMap[brand] = {
          name: brand,
          productCount: 0,
          logo: product.brandLogo || null,
        };
      }
      brandMap[brand].productCount++;
      // Use the first non-empty logo found
      if (!brandMap[brand].logo && product.brandLogo) {
        brandMap[brand].logo = product.brandLogo;
      }
    }
  });
  
  // Convert to array and sort by product count
  const brands = Object.values(brandMap).sort(
    (a, b) => b.productCount - a.productCount
  );
  
  // Fetch site settings
  const SiteSettings = (await import('@/models/SiteSettings')).default;
  let settings = await SiteSettings.findOne().lean();
  
  console.log('Fetched settings from DB:', settings);
  
  // Use defaults if no settings exist
  if (!settings) {
    console.log('No settings found, using defaults');
    settings = {
      latestProductsHeading: 'Latest Products',
      latestProductsCount: 8,
      latestProductsEnabled: true,
      categoryProductsViewAllText: 'View All',
      categoryProductsCount: 4,
      categoryProductsEnabled: true,
      brandShowcaseHeading: 'Shop by Brand',
      brandShowcaseDescription: 'Discover products from your favorite brands',
      brandShowcaseViewAllText: 'View All Brands',
      brandShowcaseBadge1: 'Trusted Brands',
      brandShowcaseBadge2: 'Authentic Products',
      brandShowcaseBadge3: 'Official Partners',
      brandShowcasePerPage: 6,
      brandShowcaseEnabled: true,
      testimonialsHeading: 'What Our Customers Say',
      testimonialsDescription: 'Join thousands of satisfied customers who trust us for quality products and excellent service',
      testimonialsEnabled: true,
      recentlyViewedLimit: 8,
      recentlyViewedEnabled: true,
      newsletterEnabled: true,
    };
  }
  
  console.log('Final settings to be sent:', settings);
  
  await db.disconnect();
  
  // Clean settings object for serialization
  const cleanSettings = settings ? {
    latestProductsHeading: settings.latestProductsHeading || 'Latest Products',
    latestProductsCount: settings.latestProductsCount || 8,
    latestProductsEnabled: settings.latestProductsEnabled !== false,
    categoryProductsViewAllText: settings.categoryProductsViewAllText || 'View All',
    categoryProductsCount: settings.categoryProductsCount || 4,
    categoryProductsEnabled: settings.categoryProductsEnabled !== false,
    brandShowcaseHeading: settings.brandShowcaseHeading || 'Shop by Brand',
    brandShowcaseDescription: settings.brandShowcaseDescription || 'Discover products from your favorite brands',
    brandShowcaseViewAllText: settings.brandShowcaseViewAllText || 'View All Brands',
    brandShowcaseBadge1: settings.brandShowcaseBadge1 || 'Trusted Brands',
    brandShowcaseBadge2: settings.brandShowcaseBadge2 || 'Authentic Products',
    brandShowcaseBadge3: settings.brandShowcaseBadge3 || 'Official Partners',
    brandShowcasePerPage: settings.brandShowcasePerPage || 6,
    brandShowcaseEnabled: settings.brandShowcaseEnabled !== false,
    testimonialsHeading: settings.testimonialsHeading || 'What Our Customers Say',
    testimonialsDescription: settings.testimonialsDescription || 'Join thousands of satisfied customers who trust us for quality products and excellent service',
    testimonialsEnabled: settings.testimonialsEnabled !== false,
    recentlyViewedLimit: settings.recentlyViewedLimit || 8,
    recentlyViewedEnabled: settings.recentlyViewedEnabled !== false,
    newsletterEnabled: settings.newsletterEnabled !== false,
    newsletterHeading: settings.newsletterHeading || 'Get 10% Off Your First Order!',
    newsletterDescription: settings.newsletterDescription || 'Subscribe to our newsletter and receive exclusive deals',
    newsletterDiscountPercentage: settings.newsletterDiscountPercentage || 10,
    newsletterButtonText: settings.newsletterButtonText || 'Subscribe Now',
    heroShopNowText: settings.heroShopNowText || 'Shop Now',
    heroAddToCartText: settings.heroAddToCartText || 'Add to Cart',
    heroLearnMoreText: settings.heroLearnMoreText || 'Learn More',
  } : {};
  
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
      productsByCategory: Object.keys(productsByCategory).reduce((acc, key) => {
        acc[key] = productsByCategory[key].map(db.convertDocToObj);
        return acc;
      }, {}),
      brands,
      categories: categoriesWithCounts,
      settings: cleanSettings,
    },
  };
}
