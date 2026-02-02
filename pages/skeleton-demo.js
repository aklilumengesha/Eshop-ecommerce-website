import Layout from "@/components/Layout";
import {
  SkeletonProductCard,
  SkeletonProductGrid,
  SkeletonProductDetail,
  SkeletonHeroCarousel,
  SkeletonTable,
  SkeletonStats,
  SkeletonCartItem,
  SkeletonOrderCard,
  SkeletonReview,
  SkeletonCategory,
} from "@/components/skeletons";

export default function SkeletonDemo() {
  return (
    <Layout title="Skeleton Loaders Demo">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Skeleton Loaders Demo</h1>
          <p className="text-gray-600 mb-8">
            Preview of all skeleton loading components with shimmer animations
          </p>
        </div>

        {/* Hero Carousel */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Hero Carousel Skeleton</h2>
          <SkeletonHeroCarousel />
        </section>

        {/* Stats Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Stats Cards Skeleton</h2>
          <SkeletonStats count={4} />
        </section>

        {/* Product Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Product Grid Skeleton</h2>
          <SkeletonProductGrid count={4} />
        </section>

        {/* Single Product Card */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Single Product Card</h2>
          <div className="max-w-sm">
            <SkeletonProductCard />
          </div>
        </section>

        {/* Product Detail */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Product Detail Skeleton</h2>
          <SkeletonProductDetail />
        </section>

        {/* Cart Items */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Cart Items Skeleton</h2>
          <div className="max-w-2xl">
            <SkeletonCartItem />
            <SkeletonCartItem />
            <SkeletonCartItem />
          </div>
        </section>

        {/* Order Card */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Order Card Skeleton</h2>
          <div className="max-w-2xl">
            <SkeletonOrderCard />
          </div>
        </section>

        {/* Review */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Review Skeleton</h2>
          <div className="max-w-2xl">
            <SkeletonReview />
            <SkeletonReview />
          </div>
        </section>

        {/* Category Card */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Category Card Skeleton</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonCategory />
            <SkeletonCategory />
            <SkeletonCategory />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Table Skeleton</h2>
          <SkeletonTable rows={5} columns={6} />
        </section>

        {/* Animation Info */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Animation Details</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Effect:</strong> Smooth shimmer animation with gradient
              sweep
            </p>
            <p>
              <strong>Duration:</strong> 2 seconds per cycle
            </p>
            <p>
              <strong>Performance:</strong> GPU-accelerated CSS transforms
            </p>
            <p>
              <strong>Accessibility:</strong> Maintains semantic HTML structure
            </p>
            <p>
              <strong>Dark Mode:</strong> Automatically adapts colors
            </p>
          </div>
        </section>

        {/* Usage Example */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Usage Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`import { SkeletonProductGrid } from '@/components/skeletons';

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);

  return (
    <Layout>
      {loading ? (
        <SkeletonProductGrid count={8} />
      ) : (
        <ProductGrid products={products} />
      )}
    </Layout>
  );
}`}</code>
          </pre>
        </section>
      </div>
    </Layout>
  );
}
