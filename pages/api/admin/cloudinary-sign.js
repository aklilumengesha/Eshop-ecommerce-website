import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    console.log('=== CLOUDINARY SIGN REQUEST ===');
    console.log('Session exists:', !!session);
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session) {
      console.log('❌ No session found');
      return res.status(401).json({ 
        error: "Authentication required - please login",
        hasSession: false 
      });
    }
    
    console.log('User email:', session.user?.email);
    console.log('User isAdmin:', session.user?.isAdmin);
    console.log('User isAdmin type:', typeof session.user?.isAdmin);
    
    if (!session.user?.isAdmin) {
      console.log('❌ User is not admin');
      return res.status(401).json({ 
        error: "Admin access required",
        hasSession: true,
        isAdmin: session.user?.isAdmin,
        userEmail: session.user?.email
      });
    }

    console.log('✓ Admin access granted');
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_SECRET
    );

    res.status(200).json({ signature, timestamp });
  } catch (error) {
    console.error('=== CLOUDINARY SIGN ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
