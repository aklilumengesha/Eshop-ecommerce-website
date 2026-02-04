import Order from "@/models/Order";
import db from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("Admin sign in required");
  }

  await db.connect();
  
  const order = await Order.findById(req.query.id);
  
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `ADMIN-${Date.now()}`,
      status: "COMPLETED",
      email_address: session.user.email,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({
      message: "Order marked as paid successfully",
      order: paidOrder,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Order not found" });
  }
};

export default handler;
