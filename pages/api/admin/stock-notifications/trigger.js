import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import axios from 'axios';

/**
 * Manual trigger for stock notifications
 * Admin-only endpoint to manually send notifications for a product
 */
const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if user is admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Call the send notifications API
    const { data } = await axios.post(
      `${baseUrl}/api/stock-notifications/send`,
      { productId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Sent ${data.sent} notification emails`,
      ...data,
    });
  } catch (error) {
    console.error('Manual trigger error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to trigger notifications',
    });
  }
};

export default handler;
