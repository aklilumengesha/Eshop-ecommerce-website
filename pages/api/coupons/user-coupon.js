import { getSession } from 'next-auth/react';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import db from '@/utils/db';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Please sign in' });
  }

  await db.connect();

  try {
    // Get user's welcome coupon
    const user = await User.findById(session.user._id);
    
    if (!user || !user.welcomeCouponCode) {
      await db.disconnect();
      return res.status(200).json({ hasCoupon: false });
    }

    // Check if already used
    if (user.welcomeCouponUsed) {
      await db.disconnect();
      return res.status(200).json({ hasCoupon: false });
    }

    // Get coupon details
    const coupon = await Coupon.findOne({
      code: user.welcomeCouponCode,
      userId: user._id,
    });

    if (!coupon) {
      await db.disconnect();
      return res.status(200).json({ hasCoupon: false });
    }

    // Check if valid
    if (!coupon.isValid()) {
      await db.disconnect();
      return res.status(200).json({ hasCoupon: false });
    }

    await db.disconnect();

    res.status(200).json({
      hasCoupon: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        expiryDate: coupon.expiryDate,
        couponType: coupon.couponType,
      },
    });
  } catch (error) {
    await db.disconnect();
    console.error('Get user coupon error:', error);
    res.status(500).json({ message: 'Error fetching coupon' });
  }
}

export default handler;
