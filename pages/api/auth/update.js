import { getSession } from "next-auth/react";
import bcryptjs from "bcryptjs";
import User from "@/models/User";
import db from "@/utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Sign in required" });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  // Validation
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    (password && password.trim().length < 6)
  ) {
    return res.status(422).json({
      message: "Validation error. Please check your input.",
    });
  }

  await db.connect();

  const toUpdateUser = await User.findById(user._id);
  if (!toUpdateUser) {
    await db.disconnect();
    return res.status(404).json({ message: "User not found" });
  }

  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password, 12);
  }

  await toUpdateUser.save();
  await db.disconnect();

  res.status(200).json({
    message: "User updated successfully",
  });
}

export default handler;
