import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import db from "@/utils/db";
import Review from "@/models/Review";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: "Admin access required" });
  }

  if (req.method === "POST") {
    return addResponse(req, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

const addResponse = async (req, res) => {
  try {
    await db.connect();

    const { reviewId } = req.query;
    const { response } = req.body;

    if (!response || !response.trim()) {
      await db.disconnect();
      return res.status(400).json({ message: "Response text is required" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      await db.disconnect();
      return res.status(404).json({ message: "Review not found" });
    }

    review.adminResponse = {
      text: response.trim(),
      date: new Date(),
    };

    await review.save();
    await db.disconnect();

    res.status(200).json({
      message: "Response added successfully",
      review: db.convertDocToObj(review),
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
