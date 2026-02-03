import Category from '@/models/Category';
import Product from '@/models/Product';
import db from '@/utils/db';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.connect();
    
    // Get active categories from database
    const dbCategories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      dbCategories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category.name });
        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          gradient: category.gradient,
          bgColor: category.bgColor,
          image: category.image,
          description: category.description,
          productCount,
        };
      })
    );

    // Filter out categories with no products
    const activeCategories = categoriesWithCounts.filter(cat => cat.productCount > 0);

    await db.disconnect();

    res.status(200).json({
      success: true,
      categories: activeCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

export default handler;
