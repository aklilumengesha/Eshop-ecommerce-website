import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "@/utils/db";
import Review from "@/models/Review";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Sign in required" });
  }

  try {
    await db.connect();

    const { reviewId } = req.query;
    const userId = session.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      await db.disconnect();
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user already voted
    const hasVoted = review.helpfulVotes.some(
      (vote) => vote.toString() === userId
    );

    if (hasVoted) {
      // Remove vote
      review.helpfulVotes = review.helpfulVotes.filter(
        (vote) => vote.toString() !== userId
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add vote
      review.helpfulVotes.push(userId);
      review.helpfulCount += 1;
    }

    await review.save();
    await db.disconnect();

    res.status(200).json({
      message: hasVoted ? "Vote removed" : "Marked as helpful",
      helpfulCount: review.helpfulCount,
      hasVoted: !hasVoted,
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
