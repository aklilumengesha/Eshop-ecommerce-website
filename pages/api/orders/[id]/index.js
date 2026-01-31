import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).send({ message: "Sign in required" });
  }

  await db.connect();
  
  const order = await Order.findById(req.query.id);
  
  await db.disconnect();
  
  if (!order) {
    return res.status(404).send({ message: "Order not found" });
  }
  
  res.send(order);
};

export default handler;
