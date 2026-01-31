import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  res.status(200).json({
    hasSession: !!session,
    session: session,
    user: session?.user || null,
    isAdmin: session?.user?.isAdmin || false,
  });
};

export default handler;
