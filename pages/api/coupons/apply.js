import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import db from '@/utils/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    console.log('No session found in apply coupon API');
    return res.status(401).json({ message: 'Please sign in to use coupons' });
  }

  console.log('Session found:', session.user.email);

  const { code, cartTotal } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Please enter a coupon code' });
  }

  await db.connect();

  try {
    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase().trim() 
    });

    if (!coupon) {
      await db.disconnect();
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Validate coupon
    if (!coupon.isValid()) {
      await db.disconnect();
      return res.status(400).json({ 
        message: coupon.isUsed 
          ? 'This coupon has already been used' 
          : 'This coupon has expired or is inactive' 
      });
    }

    // Check if coupon belongs to this user
    if (coupon.userId.toString() !== session.user._id) {
      await db.disconnect();
      return res.status(403).json({ message: 'This coupon is not valid for your account' });
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    await db.disconnect();

    res.status(200).json({
      success: true,
      discount: discountAmount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUsagePerProduct: coupon.maxUsagePerProduct,
      },
    });
  } catch (error) {
    await db.disconnect();
    console.error('Coupon apply error:', error);
    res.status(500).json({ message: 'Error applying coupon' });
  }
}

export default handler;
