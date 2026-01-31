import Product from "@/models/Product";
import db from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("Admin sign in required");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};

const postHandler = async (req, res) => {
  await db.connect();
  
  const newProduct = new Product({
    name: "Sample Product",
    slug: "sample-product-" + Math.random(),
    image: "/images/sample.jpg",
    price: 0,
    category: "Sample Category",
    brand: "Sample Brand",
    countInStock: 0,
    description: "Sample description",
    rating: 0,
    ratings: [],
    totalRatings: 0,
    numReviews: 0,
    reviews: [],
    isFeatured: false,
    banner: "",
  });

  const product = await newProduct.save();
  await db.disconnect();
  
  res.send({
    message: "Product created successfully",
    product,
  });
};

export default handler;
