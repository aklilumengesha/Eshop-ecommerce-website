import { getSession } from 'next-auth/react';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import db from '@/utils/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  await db.connect();

  try {
    // Find and update coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase().trim(),
      userId: session.user._id,
    });

    if (!coupon) {
      await db.disconnect();
      return res.status(404).json({ message: 'Coupon not found' });
    }

    if (coupon.isUsed) {
      await db.disconnect();
      return res.status(400).json({ message: 'Coupon already used' });
    }

    // Mark coupon as used
    coupon.isUsed = true;
    coupon.usedAt = new Date();
    await coupon.save();

    // Update user's welcome coupon status if it's a welcome coupon
    if (coupon.couponType === 'welcome') {
      await User.findByIdAndUpdate(session.user._id, {
        welcomeCouponUsed: true,
      });
    }

    await db.disconnect();

    res.status(200).json({
      success: true,
      message: 'Coupon marked as used',
    });
  } catch (error) {
    await db.disconnect();
    console.error('Mark coupon used error:', error);
    res.status(500).json({ message: 'Error updating coupon' });
  }
}

export default handler;
