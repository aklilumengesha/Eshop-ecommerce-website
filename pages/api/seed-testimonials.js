import { getSession } from 'next-auth/react';
import Testimonial from '@/models/Testimonial';
import db from '@/utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.connect();

    // Check if testimonials already exist
    const existingCount = await Testimonial.countDocuments();
    if (existingCount > 0) {
      await db.disconnect();
      return res.status(400).json({ 
        message: 'Testimonials already exist. Delete them first if you want to reseed.' 
      });
    }

    const sampleTestimonials = [
      {
        name: "Sarah Johnson",
        role: "Verified Buyer",
        image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=4F46E5&color=fff&size=128",
        rating: 5,
        text: "Amazing quality and fast shipping! The products exceeded my expectations. Will definitely shop here again.",
        product: "Wireless Headphones",
        isActive: true,
        order: 1,
      },
      {
        name: "Michael Chen",
        role: "Verified Buyer",
        image: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff&size=128",
        rating: 5,
        text: "Best online shopping experience I've had. Customer service was incredibly helpful and responsive.",
        product: "Smart Watch",
        isActive: true,
        order: 2,
      },
      {
        name: "Emily Rodriguez",
        role: "Verified Buyer",
        image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff&size=128",
        rating: 5,
        text: "Great prices and excellent product selection. The website is easy to navigate and checkout was smooth.",
        product: "Laptop Bag",
        isActive: true,
        order: 3,
      },
      {
        name: "David Thompson",
        role: "Verified Buyer",
        image: "https://ui-avatars.com/api/?name=David+Thompson&background=EF4444&color=fff&size=128",
        rating: 5,
        text: "Outstanding customer support and high-quality products. They went above and beyond to ensure my satisfaction.",
        product: "Gaming Mouse",
        isActive: true,
        order: 4,
      },
      {
        name: "Lisa Anderson",
        role: "Verified Buyer",
        image: "https://ui-avatars.com/api/?name=Lisa+Anderson&background=8B5CF6&color=fff&size=128",
        rating: 5,
        text: "I'm impressed with the attention to detail and the seamless shopping experience. Highly recommend!",
        product: "Bluetooth Speaker",
        isActive: true,
        order: 5,
      },
    ];

    await Testimonial.insertMany(sampleTestimonials);
    await db.disconnect();

    res.status(201).json({ 
      message: 'Testimonials seeded successfully',
      count: sampleTestimonials.length 
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
