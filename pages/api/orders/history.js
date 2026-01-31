import Order from "@/models/Order";
import db from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).send({ message: "Sign in required" });
  }

  await db.connect();
  
  const orders = await Order.find({ user: session.user._id });
  
  await db.disconnect();
  
  res.send(orders);
};

export default handler;
