import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a product slug"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please provide a product image"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    brand: {
      type: String,
      required: [true, "Please provide a brand"],
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    ratings: [
      {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
      },
    ],
    totalRatings: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total ratings cannot be negative"],
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },
    reviews: [
      {
        type: String,
        required: true,
      },
    ],
    countInStock: {
      type: Number,
      required: [true, "Please provide stock count"],
      default: 0,
      min: [0, "Stock count cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    banner: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
