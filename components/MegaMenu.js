import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  // Define your categories with subcategories and featured items
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      subcategories: [
        { name: 'Smartphones', slug: 'smartphones' },
        { name: 'Laptops', slug: 'laptops' },
        { name: 'Tablets', slug: 'tablets' },
        { name: 'Cameras', slug: 'cameras' },
        { name: 'Audio', slug: 'audio' },
        { name: 'Wearables', slug: 'wearables' },
      ],
      featured: {
        title: 'New Arrivals',
        items: ['Latest iPhone', 'MacBook Pro', 'AirPods Pro'],
      },
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      subcategories: [
        { name: "Men's Clothing", slug: 'mens-clothing' },
        { name: "Women's Clothing", slug: 'womens-clothing' },
        { name: 'Shoes', slug: 'shoes' },
        { name: 'Accessories', slug: 'accessories' },
        { name: 'Bags', slug: 'bags' },
        { name: 'Jewelry', slug: 'jewelry' },
      ],
      featured: {
        title: 'Trending Now',
        items: ['Summer Collection', 'Designer Bags', 'Sneakers'],
      },
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      subcategories: [
        { name: 'Furniture', slug: 'furniture' },
        { name: 'Decor', slug: 'decor' },
        { name: 'Kitchen', slug: 'kitchen' },
        { name: 'Bedding', slug: 'bedding' },
        { name: 'Lighting', slug: 'lighting' },
        { name: 'Storage', slug: 'storage' },
      ],
      featured: {
        title: 'Best Sellers',
        items: ['Modern Sofa', 'LED Lights', 'Kitchen Set'],
      },
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subcategories: [
        { name: 'Fitness Equipment', slug: 'fitness' },
        { name: 'Outdoor Gear', slug: 'outdoor-gear' },
        { name: 'Sports Apparel', slug: 'sports-apparel' },
        { name: 'Cycling', slug: 'cycling' },
        { name: 'Camping', slug: 'camping' },
        { name: 'Water Sports', slug: 'water-sports' },
      ],
      featured: {
        title: 'Hot Deals',
        items: ['Yoga Mats', 'Running Shoes', 'Camping Tents'],
      },
    },
    {
      name: 'Beauty & Health',
      slug: 'beauty-health',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      subcategories: [
        { name: 'Skincare', slug: 'skincare' },
        { name: 'Makeup', slug: 'makeup' },
        { name: 'Haircare', slug: 'haircare' },
        { name: 'Fragrances', slug: 'fragrances' },
        { name: 'Vitamins', slug: 'vitamins' },
        { name: 'Personal Care', slug: 'personal-care' },
      ],
      featured: {
        title: 'Popular',
        items: ['Face Serums', 'Lipsticks', 'Hair Dryers'],
      },
    },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Mega Menu Trigger */}
      <button
        onMouseEnter={handleMouseEnter}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>All Categories</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mega Menu Dropdown */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 top-full mt-2 w-screen max-w-7xl bg-white shadow-2xl rounded-lg border border-gray-200 z-50"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="grid grid-cols-12 gap-0">
            {/* Left Sidebar - Category List */}
            <div className="col-span-3 bg-gray-50 rounded-l-lg p-4 border-r border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Browse Categories
              </h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onMouseEnter={() => setActiveCategory(category)}
                    onClick={() => {
                      window.location.href = `/search?category=${category.slug}`;
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                      activeCategory?.slug === category.slug
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={activeCategory?.slug === category.slug ? 'text-white' : 'text-gray-400'}>
                      {category.icon}
                    </span>
                    <span className="font-medium">{category.name}</span>
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Content - Subcategories & Featured */}
            <div className="col-span-9 p-6">
              {activeCategory ? (
                <div className="grid grid-cols-3 gap-8">
                  {/* Subcategories */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      {activeCategory.icon}
                      {activeCategory.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {activeCategory.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/search?category=${activeCategory.slug}&subcategory=${sub.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-2 group"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/search?category=${activeCategory.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 mt-6 text-primary-600 hover:text-primary-700 font-semibold group"
                    >
                      View All {activeCategory.name}
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>

                  {/* Featured Section */}
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-5">
                    <h4 className="text-sm font-bold text-primary-900 mb-3 uppercase tracking-wide">
                      {activeCategory.featured.title}
                    </h4>
                    <ul className="space-y-2">
                      {activeCategory.featured.items.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={`/search?q=${encodeURIComponent(item)}`}
                            onClick={() => setIsOpen(false)}
                            className="text-primary-700 hover:text-primary-900 font-medium flex items-center gap-2 group"
                          >
                            <svg
                              className="w-4 h-4 text-secondary-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <Link
                        href="/search?sortBy=newest"
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-primary-600 hover:text-primary-800 font-semibold uppercase tracking-wide"
                      >
                        See All New Arrivals →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <p className="text-sm font-medium">Hover over a category to see options</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-b-lg flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/search?deals=true"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-secondary-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">Today's Deals</span>
              </Link>
              <Link
                href="/search?sortBy=newest"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-secondary-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">New Arrivals</span>
              </Link>
              <Link
                href="/search?sortBy=popular"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-secondary-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-semibold">Trending</span>
              </Link>
            </div>
            <Link
              href="/search"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold hover:text-secondary-300 transition-colors"
            >
              Browse All Products →
            </Link>
          </div>
        </div>
      </Transition>
    </div>
  );
}
