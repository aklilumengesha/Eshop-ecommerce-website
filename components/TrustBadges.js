export default function TrustBadges() {
  const badges = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: "Free Shipping",
      description: "On orders over $50",
      color: "primary",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Secure Payment",
      description: "100% secure transactions",
      color: "success",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "30-Day Returns",
      description: "Money back guarantee",
      color: "info",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "24/7 Support",
      description: "Dedicated customer service",
      color: "secondary",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40",
      success: "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/30 group-hover:bg-success-100 dark:group-hover:bg-success-900/40",
      info: "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/30 group-hover:bg-info-100 dark:group-hover:bg-info-900/40",
      secondary: "text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30 group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/40",
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${getColorClasses(badge.color)}`}>
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
