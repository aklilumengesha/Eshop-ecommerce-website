import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import SiteSettings from '@/models/SiteSettings';
import db from '@/utils/db';

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('Admin sign in required');
  }

  await db.connect();

  if (req.method === 'GET') {
    try {
      let settings = await SiteSettings.findOne();
      
      // Create default settings if none exist
      if (!settings) {
        settings = await SiteSettings.create({});
      }
      
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      let settings = await SiteSettings.findOne();
      
      if (!settings) {
        settings = await SiteSettings.create(req.body);
      } else {
        // Update existing settings
        Object.keys(req.body).forEach(key => {
          settings[key] = req.body[key];
        });
        await settings.save();
      }
      
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }

  await db.disconnect();
};

export default handler;
