import { getSession } from 'next-auth/react';
import Category from '@/models/Category';
import Product from '@/models/Product';
import db from '@/utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  await db.connect();

  if (req.method === 'GET') {
    try {
      const categories = await Category.find({}).sort({ order: 1, name: 1 });
      
      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Product.countDocuments({ category: category.name });
          return {
            ...category.toObject(),
            productCount,
          };
        })
      );

      res.status(200).json(categoriesWithCounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, slug, icon, gradient, bgColor, image, description, isActive, order } = req.body;

      const categoryExists = await Category.findOne({ $or: [{ name }, { slug }] });
      if (categoryExists) {
        return res.status(400).json({ message: 'Category name or slug already exists' });
      }

      const category = await Category.create({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        icon,
        gradient,
        bgColor,
        image,
        description,
        isActive,
        order,
      });

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }

  await db.disconnect();
};

export default handler;
