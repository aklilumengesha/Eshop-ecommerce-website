import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/AdminLayout';
import { getError } from '@/utils/error';

export default function AdminSiteSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    newsletterHeading: '',
    newsletterDescription: '',
    newsletterDiscountPercentage: 10,
    newsletterButtonText: '',
    newsletterEnabled: true,
    heroShopNowText: '',
    heroAddToCartText: '',
    heroLearnMoreText: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/site-settings');
      setSettings(data);
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put('/api/admin/site-settings', settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Site Settings">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Carousel Settings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">Hero Carousel Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize button text for featured product carousel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  name="heroShopNowText"
                  value={settings.heroShopNowText}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Shop Now"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Main call-to-action button</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add to Cart Button Text
                </label>
                <input
                  type="text"
                  name="heroAddToCartText"
                  value={settings.heroAddToCartText}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Add to Cart"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Quick add button</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Learn More Button Text
                </label>
                <input
                  type="text"
                  name="heroLearnMoreText"
                  value={settings.heroLearnMoreText}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Learn More"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Secondary button</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold text-sm"
                  disabled
                >
                  {settings.heroShopNowText || 'Shop Now'}
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold text-sm flex items-center gap-2"
                  disabled
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {settings.heroAddToCartText || 'Add to Cart'}
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-sm"
                  disabled
                >
                  {settings.heroLearnMoreText || 'Learn More'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">Preview</p>
            </div>
          </div>

          {/* Newsletter Settings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Newsletter Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure the newsletter subscription section on your homepage
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletterEnabled"
                  checked={settings.newsletterEnabled}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {settings.newsletterEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  name="newsletterHeading"
                  value={settings.newsletterHeading}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Get 10% Off Your First Order!"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="newsletterDescription"
                  value={settings.newsletterDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Subscribe to our newsletter and receive exclusive deals..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="newsletterDiscountPercentage"
                      value={settings.newsletterDiscountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This appears in the heading (e.g., "Get 10% Off")
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="newsletterButtonText"
                    value={settings.newsletterButtonText}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    placeholder="Subscribe Now"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-lg">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {settings.newsletterHeading.replace(
                    /\d+%/,
                    `${settings.newsletterDiscountPercentage}%`
                  )}
                </h3>
                <p className="text-sm text-primary-100 mb-3">
                  {settings.newsletterDescription}
                </p>
                <button
                  type="button"
                  className="px-6 py-2 bg-secondary-500 text-white rounded-lg text-sm font-semibold"
                  disabled
                >
                  {settings.newsletterButtonText}
                </button>
                <p className="text-xs text-primary-200 mt-2">Preview</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={fetchSettings}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={saving}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

AdminSiteSettingsScreen.auth = { adminOnly: true };
