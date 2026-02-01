import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import db from '@/utils/db';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    console.log('No session found');
    return res.status(401).json({ message: 'Please sign in' });
  }

  console.log('Session user:', session.user);
  console.log('User ID:', session.user._id);

  await db.connect();

  try {
    // Get user's welcome coupon
    const user = await User.findById(session.user._id);
    
    console.log('User found:', !!user);
    if (user) {
      console.log('User welcomeCouponCode:', user.welcomeCouponCode);
      console.log('User welcomeCouponUsed:', user.welcomeCouponUsed);
    }
    
    if (!user || !user.welcomeCouponCode) {
      await db.disconnect();
      console.log('No user or no welcome coupon code');
      return res.status(200).json({ hasCoupon: false });
    }

    // Check if already used
    if (user.welcomeCouponUsed) {
      await db.disconnect();
      console.log('Welcome coupon already used');
      return res.status(200).json({ hasCoupon: false });
    }

    // Get coupon details
    const coupon = await Coupon.findOne({
      code: user.welcomeCouponCode,
      userId: user._id,
    });

    console.log('Coupon found:', !!coupon);
    if (coupon) {
      console.log('Coupon code:', coupon.code);
      console.log('Coupon isValid:', coupon.isValid());
      console.log('Coupon expiry:', coupon.expiryDate);
      console.log('Coupon isUsed:', coupon.isUsed);
      console.log('Coupon isActive:', coupon.isActive);
    }

    if (!coupon) {
      await db.disconnect();
      console.log('Coupon not found in database');
      return res.status(200).json({ hasCoupon: false });
    }

    // Check if valid
    if (!coupon.isValid()) {
      await db.disconnect();
      console.log('Coupon is not valid');
      return res.status(200).json({ hasCoupon: false });
    }

    await db.disconnect();

    console.log('Returning valid coupon');
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
