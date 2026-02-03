import Category from '@/models/Category';
import db from '@/utils/db';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.connect();

    // Clear existing categories
    await Category.deleteMany({});

    // Default categories with icons and styles
    const defaultCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        icon: '💻',
        gradient: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        description: 'Latest gadgets and tech',
        isActive: true,
        order: 1,
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        icon: '👕',
        gradient: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        description: 'Fashion and apparel',
        isActive: true,
        order: 2,
      },
      {
        name: 'Shoes',
        slug: 'shoes',
        icon: '👟',
        gradient: 'from-teal-500 to-cyan-500',
        bgColor: 'bg-teal-50 dark:bg-teal-900/20',
        description: 'Footwear for all occasions',
        isActive: true,
        order: 3,
      },
      {
        name: 'Audio',
        slug: 'audio',
        icon: '🎧',
        gradient: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-50 dark:bg-violet-900/20',
        description: 'Headphones and speakers',
        isActive: true,
        order: 4,
      },
      {
        name: 'Books',
        slug: 'books',
        icon: '📚',
        gradient: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        description: 'Reading materials',
        isActive: true,
        order: 5,
      },
      {
        name: 'Toys',
        slug: 'toys',
        icon: '🎮',
        gradient: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        description: 'Games and entertainment',
        isActive: true,
        order: 6,
      },
      {
        name: 'Sports',
        slug: 'sports',
        icon: '⚽',
        gradient: 'from-indigo-500 to-blue-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        description: 'Sports equipment',
        isActive: true,
        order: 7,
      },
      {
        name: 'Home',
        slug: 'home',
        icon: '🏠',
        gradient: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        description: 'Home and living',
        isActive: true,
        order: 8,
      },
      {
        name: 'Beauty',
        slug: 'beauty',
        icon: '💄',
        gradient: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-50 dark:bg-pink-900/20',
        description: 'Beauty and cosmetics',
        isActive: true,
        order: 9,
      },
      {
        name: 'Food',
        slug: 'food',
        icon: '🍔',
        gradient: 'from-red-500 to-orange-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        description: 'Food and beverages',
        isActive: true,
        order: 10,
      },
    ];

    const createdCategories = await Category.insertMany(defaultCategories);

    await db.disconnect();

    res.status(200).json({
      success: true,
      message: 'Categories seeded successfully',
      count: createdCategories.length,
      categories: createdCategories,
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed categories',
      error: error.message,
    });
  }
};

export default handler;
