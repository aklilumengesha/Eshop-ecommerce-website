import User from "@/models/User";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  // Validation
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6
  ) {
    return res.status(422).json({
      message: "Validation error. Please check your input.",
    });
  }

  await db.connect();

  // Check if user already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    await db.disconnect();
    return res.status(422).json({ message: "User already exists!" });
  }

  // Hash password
  const hashedPassword = bcryptjs.hashSync(password, 12);

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();

  res.status(201).json({
    message: "User created successfully!",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
