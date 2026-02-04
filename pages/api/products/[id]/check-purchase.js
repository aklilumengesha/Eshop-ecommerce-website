import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "@/utils/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Sign in required" });
  }

  try {
    await db.connect();

    const { id } = req.query;

    // Get product to find its slug
    const product = await Product.findById(id);
    if (!product) {
      await db.disconnect();
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has purchased and received this product
    // Check by slug (new orders) OR by name (old orders)
    const hasPurchased = await Order.findOne({
      user: session.user._id,
      $or: [
        { "orderItems.slug": product.slug },
        { "orderItems.name": product.name }
      ],
      isPaid: true,
      isDelivered: true, // Only allow reviews for delivered orders
    });

    await db.disconnect();

    res.status(200).json({
      hasPurchased: !!hasPurchased,
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
