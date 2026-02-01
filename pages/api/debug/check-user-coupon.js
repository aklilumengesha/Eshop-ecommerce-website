import { getSession } from 'next-auth/react';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import db from '@/utils/db';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Please sign in' });
  }

  await db.connect();

  try {
    const user = await User.findById(session.user._id);
    
    if (!user) {
      await db.disconnect();
      return res.status(404).json({ message: 'User not found' });
    }

    const coupon = user.welcomeCouponCode 
      ? await Coupon.findOne({ code: user.welcomeCouponCode })
      : null;

    await db.disconnect();

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        welcomeCouponCode: user.welcomeCouponCode,
        welcomeCouponUsed: user.welcomeCouponUsed,
        createdAt: user.createdAt,
      },
      coupon: coupon ? {
        code: coupon.code,
        userId: coupon.userId,
        discountValue: coupon.discountValue,
        discountType: coupon.discountType,
        isUsed: coupon.isUsed,
        isActive: coupon.isActive,
        expiryDate: coupon.expiryDate,
        createdAt: coupon.createdAt,
        isExpired: new Date(coupon.expiryDate) < new Date(),
        isValid: coupon.isValid(),
      } : null,
    });
  } catch (error) {
    await db.disconnect();
    console.error('Debug check error:', error);
    return res.status(500).json({ message: error.message });
  }
}

export default handler;
