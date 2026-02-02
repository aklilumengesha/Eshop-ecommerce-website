import { getSession } from 'next-auth/react';
import SocialProofStat from '@/models/SocialProofStat';
import db from '@/utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Admin access required' });
  }

  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res) => {
  try {
    await db.connect();
    const stats = await SocialProofStat.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    await db.disconnect();
    res.status(200).json(stats);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

const postHandler = async (req, res) => {
  try {
    await db.connect();
    const newStat = new SocialProofStat({
      label: req.body.label,
      value: req.body.value,
      icon: req.body.icon || 'users',
      color: req.body.color || 'primary',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      order: req.body.order || 0,
    });
    const stat = await newStat.save();
    await db.disconnect();
    res.status(201).json(stat);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
