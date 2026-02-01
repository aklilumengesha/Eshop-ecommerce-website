import { testEmailConfiguration, sendBackInStockEmail } from '@/utils/email';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if user is admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  const { action, email } = req.body;

  try {
    if (action === 'verify') {
      // Test email configuration
      const result = await testEmailConfiguration();
      return res.status(200).json(result);
    }

    if (action === 'send-test') {
      // Send a test email
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      await sendBackInStockEmail({
        email,
        product: {
          name: 'Test Product',
          slug: 'test-product',
          price: 99.99,
          image: 'https://via.placeholder.com/300',
        },
        unsubscribeToken: 'test-token-12345',
      });

      return res.status(200).json({
        success: true,
        message: `Test email sent to ${email}`,
      });
    }

    return res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default handler;
