import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "@/utils/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    return getReviews(req, res);
  }

  if (req.method === "POST") {
    if (!session) {
      return res.status(401).json({ message: "Sign in required" });
    }
    return createReview(req, res, session);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

// Get all reviews for a product
const getReviews = async (req, res) => {
  try {
    await db.connect();
    
    const { id } = req.query;
    const { sort = "recent", filter = "all" } = req.query;

    let sortOption = { createdAt: -1 }; // Default: most recent
    
    if (sort === "helpful") {
      sortOption = { helpfulCount: -1, createdAt: -1 };
    } else if (sort === "rating-high") {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === "rating-low") {
      sortOption = { rating: 1, createdAt: -1 };
    }

    let filterOption = { product: id, status: "approved" };
    
    if (filter !== "all" && filter >= 1 && filter <= 5) {
      filterOption.rating = parseInt(filter);
    } else if (filter === "verified") {
      filterOption.verifiedPurchase = true;
    }

    const reviews = await Review.find(filterOption)
      .sort(sortOption)
      .lean();

    // Get rating statistics
    const stats = await Review.aggregate([
      { $match: { product: new db.mongoose.Types.ObjectId(id), status: "approved" } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingStats = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    stats.forEach((stat) => {
      ratingStats[stat._id] = stat.count;
    });

    const totalReviews = Object.values(ratingStats).reduce((a, b) => a + b, 0);

    await db.disconnect();

    res.status(200).json({
      reviews: reviews.map(db.convertDocToObj),
      stats: ratingStats,
      totalReviews,
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
const createReview = async (req, res, session) => {
  try {
    await db.connect();

    const { id } = req.query;
    const { rating, title, comment, images = [] } = req.body;

    // Validate input
    if (!rating || !title || !comment) {
      await db.disconnect();
      return res.status(400).json({ message: "Please provide rating, title, and comment" });
    }

    if (rating < 1 || rating > 5) {
      await db.disconnect();
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      await db.disconnect();
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: id,
      user: session.user._id,
    });

    if (existingReview) {
      await db.disconnect();
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Check if user purchased this product (verified purchase)
    const hasPurchased = await Order.findOne({
      user: session.user._id,
      "orderItems.slug": product.slug,
      isPaid: true,
    });

    // Create review
    const review = await Review.create({
      product: id,
      user: session.user._id,
      userName: session.user.name,
      userEmail: session.user.email,
      rating,
      title,
      comment,
      images,
      verifiedPurchase: !!hasPurchased,
    });

    // Update product rating
    const allReviews = await Review.find({ product: id, status: "approved" });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    product.rating = avgRating;
    product.numReviews = allReviews.length;
    product.totalRatings = allReviews.length;
    await product.save();

    await db.disconnect();

    res.status(201).json({
      message: "Review submitted successfully",
      review: db.convertDocToObj(review),
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: error.message });
  }
};

export default handler;
