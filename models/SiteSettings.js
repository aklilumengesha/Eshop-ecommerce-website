import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    // Newsletter Settings
    newsletterHeading: {
      type: String,
      default: 'Get 10% Off Your First Order!',
    },
    newsletterDescription: {
      type: String,
      default: 'Subscribe to our newsletter and receive exclusive deals, new arrivals, and special offers directly to your inbox.',
    },
    newsletterDiscountPercentage: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    newsletterButtonText: {
      type: String,
      default: 'Subscribe Now',
    },
    newsletterEnabled: {
      type: Boolean,
      default: true,
    },
    
    // Hero Carousel Settings
    heroShopNowText: {
      type: String,
      default: 'Shop Now',
    },
    heroAddToCartText: {
      type: String,
      default: 'Add to Cart',
    },
    heroLearnMoreText: {
      type: String,
      default: 'Learn More',
    },
    
    // Future: Can add more site-wide settings here
    // siteName, siteDescription, contactEmail, etc.
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
