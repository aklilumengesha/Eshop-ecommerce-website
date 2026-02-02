export default function SkeletonProductCard() {
  return (
    <div className="card animate-pulse">
      {/* Image skeleton */}
      <div className="relative bg-gray-200 h-64 rounded-t overflow-hidden">
        <div className="absolute inset-0 shimmer"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Brand/Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-2/3 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-24 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
        </div>
      </div>
    </div>
  );
}
