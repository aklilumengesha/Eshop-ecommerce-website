import { getSession } from 'next-auth/react';
import Testimonial from '@/models/Testimonial';
import db from '@/utils/db';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res) => {
  try {
    await db.connect();
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    await db.disconnect();
    res.status(200).json(testimonials);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
