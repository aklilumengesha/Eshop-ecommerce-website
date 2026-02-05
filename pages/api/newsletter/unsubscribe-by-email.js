import Newsletter from "@/models/Newsletter";
import db from "@/utils/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(422).json({ message: "Valid email is required" });
  }

  await db.connect();

  try {
    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      await db.disconnect();
      return res.status(404).json({ message: "Email not found in our newsletter list" });
    }

    if (!subscriber.isActive) {
      await db.disconnect();
      return res.status(400).json({ message: "This email is already unsubscribed" });
    }

    subscriber.isActive = false;
    await subscriber.save();

    await db.disconnect();

    res.status(200).json({ 
      message: "Successfully unsubscribed from newsletter. We're sorry to see you go!" 
    });
  } catch (error) {
    await db.disconnect();
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: "Error unsubscribing. Please try again." });
  }
}

export default handler;
