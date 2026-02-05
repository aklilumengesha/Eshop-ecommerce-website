import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    console.log('=== CLOUDINARY SIGN REQUEST (Profile) ===');
    console.log('Session exists:', !!session);
    console.log('Session user:', session?.user?.email);
    
    if (!session) {
      console.log('❌ No session found');
      return res.status(401).json({ 
        error: "Authentication required - please login",
      });
    }

    console.log('✓ User authenticated');
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "profile-images",
      },
      process.env.CLOUDINARY_SECRET
    );

    res.status(200).json({ 
      signature, 
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
