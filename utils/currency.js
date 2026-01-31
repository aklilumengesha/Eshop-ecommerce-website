// Currency conversion rates (you can fetch these from an API in production)
export const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 149.50, name: 'Japanese Yen' },
  CNY: { symbol: '¥', rate: 7.24, name: 'Chinese Yuan' },
  INR: { symbol: '₹', rate: 83.12, name: 'Indian Rupee' },
  AUD: { symbol: 'A$', rate: 1.53, name: 'Australian Dollar' },
  CAD: { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
};

export const formatPrice = (price, currencyCode = 'USD') => {
  const currency = currencies[currencyCode];
  if (!currency) return `$${price}`;
  
  const convertedPrice = (price * currency.rate).toFixed(2);
  
  // Format with proper decimal places
  if (currencyCode === 'JPY') {
    return `${currency.symbol}${Math.round(price * currency.rate)}`;
  }
  
  return `${currency.symbol}${convertedPrice}`;
};

export const getDefaultCurrency = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currency') || 'USD';
  }
  return 'USD';
};

export const setDefaultCurrency = (currencyCode) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currency', currencyCode);
  }
};
