import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import SocialProofStat from '@/models/SocialProofStat';
import db from '@/utils/db';

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('Admin sign in required');
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    return getHandler(req, res, id);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, id);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, id);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res, id) => {
  try {
    await db.connect();
    const stat = await SocialProofStat.findById(id);
    await db.disconnect();
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    res.status(200).json(stat);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

const putHandler = async (req, res, id) => {
  try {
    await db.connect();
    const stat = await SocialProofStat.findById(id);
    if (!stat) {
      await db.disconnect();
      return res.status(404).json({ message: 'Stat not found' });
    }

    stat.label = req.body.label || stat.label;
    stat.value = req.body.value || stat.value;
    stat.icon = req.body.icon || stat.icon;
    stat.color = req.body.color || stat.color;
    stat.isActive = req.body.isActive !== undefined ? req.body.isActive : stat.isActive;
    stat.order = req.body.order !== undefined ? req.body.order : stat.order;

    const updatedStat = await stat.save();
    await db.disconnect();
    res.status(200).json(updatedStat);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

const deleteHandler = async (req, res, id) => {
  try {
    await db.connect();
    const stat = await SocialProofStat.findById(id);
    if (!stat) {
      await db.disconnect();
      return res.status(404).json({ message: 'Stat not found' });
    }
    await stat.deleteOne();
    await db.disconnect();
    res.status(200).json({ message: 'Stat deleted successfully' });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
