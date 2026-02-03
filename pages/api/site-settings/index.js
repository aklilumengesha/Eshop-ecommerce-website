import SiteSettings from '@/models/SiteSettings';
import db from '@/utils/db';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.connect();
    
    let settings = await SiteSettings.findOne().lean();
    
    // Return default settings if none exist
    if (!settings) {
      settings = {
        newsletterHeading: 'Get 10% Off Your First Order!',
        newsletterDescription: 'Subscribe to our newsletter and receive exclusive deals, new arrivals, and special offers directly to your inbox.',
        newsletterDiscountPercentage: 10,
        newsletterButtonText: 'Subscribe Now',
        newsletterEnabled: true,
      };
    }
    
    await db.disconnect();

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message,
    });
  }
};

export default handler;
