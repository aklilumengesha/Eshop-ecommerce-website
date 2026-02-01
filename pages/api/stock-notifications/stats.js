import StockNotification from '@/models/StockNotification';
import Product from '@/models/Product';
import db from '@/utils/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if user is admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  try {
    await db.connect();

    // Get total pending notifications
    const pendingCount = await StockNotification.countDocuments({ notified: false });

    // Get total sent notifications
    const sentCount = await StockNotification.countDocuments({ notified: true });

    // Get most requested products
    const mostRequested = await StockNotification.aggregate([
      { $match: { notified: false } },
      { $group: { _id: '$product', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Populate product details
    const mostRequestedWithDetails = await Promise.all(
      mostRequested.map(async (item) => {
        const product = await Product.findById(item._id).select('name slug image countInStock');
        return {
          product,
          requestCount: item.count,
        };
      })
    );

    await db.disconnect();

    res.status(200).json({
      pending: pendingCount,
      sent: sentCount,
      total: pendingCount + sentCount,
      mostRequested: mostRequestedWithDetails,
    });
  } catch (error) {
    await db.disconnect();
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

export default handler;
