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
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image?.trim() || req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    product.isFeatured = req.body.isFeatured;
    product.banner = req.body.banner?.trim() || req.body.banner;
    
    await product.save();
    await db.disconnect();
    res.send({ message: "Product updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  
  if (product) {
    await product.deleteOne();
    await db.disconnect();
    res.send({ message: "Product deleted successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

export default handler;
