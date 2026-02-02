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
    
    // Check if stats are requested
    const { stats } = req.query;
    
    if (stats === 'true') {
      // Calculate statistics from all active testimonials
      const testimonials = await Testimonial.find({ isActive: true }).lean();
      
      if (testimonials.length === 0) {
        await db.disconnect();
        return res.status(200).json({
          averageRating: 0,
          totalReviews: 0,
          testimonials: []
        });
      }
      
      // Calculate average rating
      const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
      const averageRating = (totalRating / testimonials.length).toFixed(1);
      
      await db.disconnect();
      return res.status(200).json({
        averageRating: parseFloat(averageRating),
        totalReviews: testimonials.length,
        testimonials: testimonials.sort((a, b) => a.order - b.order || new Date(b.createdAt) - new Date(a.createdAt))
      });
    }
    
    // Regular testimonials fetch
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
