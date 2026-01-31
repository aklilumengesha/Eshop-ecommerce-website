// API route to fetch real-time currency exchange rates
// Uses exchangerate-api.com (free tier: 1,500 requests/month)

const handler = async (req, res) => {
  try {
    // Free API - no key required for basic usage
    // Alternative: https://api.exchangerate-api.com/v4/latest/USD
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    
    // Extract only the currencies we support
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD'];
    const rates = {};
    
    supportedCurrencies.forEach(currency => {
      rates[currency] = data.rates[currency] || 1;
    });

    // Cache for 1 hour
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    res.status(200).json({
      base: 'USD',
      rates: rates,
      lastUpdated: data.date || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Currency API Error:', error);
    
    // Fallback rates if API fails
    res.status(200).json({
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        CNY: 7.24,
        INR: 83.12,
        AUD: 1.53,
        CAD: 1.36,
      },
      lastUpdated: new Date().toISOString(),
      fallback: true,
    });
  }
};

export default handler;
