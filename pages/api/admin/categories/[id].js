import { getSession } from 'next-auth/react';
import Category from '@/models/Category';
import db from '@/utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  const { id } = req.query;

  await db.connect();

  if (req.method === 'GET') {
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const { name, slug, icon, gradient, bgColor, image, description, isActive, order } = req.body;

      category.name = name || category.name;
      category.slug = slug || category.slug;
      category.icon = icon !== undefined ? icon : category.icon;
      category.gradient = gradient || category.gradient;
      category.bgColor = bgColor || category.bgColor;
      category.image = image !== undefined ? image : category.image;
      category.description = description !== undefined ? description : category.description;
      category.isActive = isActive !== undefined ? isActive : category.isActive;
      category.order = order !== undefined ? order : category.order;

      await category.save();
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.deleteOne();
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }

  await db.disconnect();
};

export default handler;
