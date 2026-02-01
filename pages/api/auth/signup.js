import User from "@/models/User";
import Coupon from "@/models/Coupon";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";

// Generate unique welcome coupon code
function generateWelcomeCouponCode() {
  const prefix = 'WELCOME';
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomStr}`;
}

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

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      await db.disconnect();
      return res.status(422).json({ message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 12);

    // Generate unique welcome coupon code
    let couponCode;
    let isUnique = false;
    
    while (!isUnique) {
      couponCode = generateWelcomeCouponCode();
      const existingCoupon = await Coupon.findOne({ code: couponCode });
      if (!existingCoupon) {
        isUnique = true;
      }
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      welcomeCouponCode: couponCode,
      welcomeCouponUsed: false,
    });

    const user = await newUser.save();

    // Create welcome coupon (expires in 2 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    const welcomeCoupon = new Coupon({
      code: couponCode,
      userId: user._id,
      discountType: 'percentage',
      discountValue: 20,
      expiryDate: expiryDate,
      isActive: true,
      isUsed: false,
      couponType: 'welcome',
      maxUsagePerProduct: 1,
    });

    await welcomeCoupon.save();

    await db.disconnect();

    res.status(201).json({
      message: "User created successfully!",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      welcomeCouponCode: couponCode,
    });
  } catch (error) {
    await db.disconnect();
    console.error('Signup error:', error);
    res.status(500).json({ message: "Error creating user. Please try again." });
  }
}

export default handler;
