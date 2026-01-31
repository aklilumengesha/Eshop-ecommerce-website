import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  console.log("Cloudinary Sign - Session:", JSON.stringify(session, null, 2));
  
  if (!session) {
    return res.status(401).json({ 
      error: "Authentication required - please login",
      hasSession: false 
    });
  }
  
  if (!session.user.isAdmin) {
    return res.status(401).json({ 
      error: "Admin access required - please ensure your account has admin privileges",
      hasSession: true,
      isAdmin: session.user.isAdmin,
      userEmail: session.user.email
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET
  );

  res.status(200).json({ signature, timestamp });
};

export default handler;
