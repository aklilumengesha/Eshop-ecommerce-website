import User from "@/models/User";
import db from "@/utils/db";
import { sendVerificationEmail } from "@/utils/email";

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ message: "Email is required" });
  }

  await db.connect();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await db.disconnect();
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      await db.disconnect();
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationCode,
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      await db.disconnect();
      return res.status(500).json({ 
        message: "Failed to send verification email. Please try again." 
      });
    }

    await db.disconnect();

    res.status(200).json({
      message: "Verification code sent successfully!",
    });
  } catch (error) {
    await db.disconnect();
    console.error('Resend verification error:', error);
    res.status(500).json({ message: "Error sending verification code. Please try again." });
  }
}

export default handler;
