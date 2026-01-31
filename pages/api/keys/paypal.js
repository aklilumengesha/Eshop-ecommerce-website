import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).send("Sign in required");
  }
  
  res.send(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb");
};

export default handler;
