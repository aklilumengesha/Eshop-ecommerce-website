import nodemailer from 'nodemailer';

/**
 * Create email transporter
 */
function createTransporter() {
  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️ Email not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in .env.local');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

/**
 * Generate back in stock email HTML template
 */
function getBackInStockEmailTemplate({ product, unsubscribeUrl, productUrl }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Back in Stock</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Great News!</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">The product you wanted is back in stock</p>
            </td>
          </tr>

          <!-- Product Info -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="${product.image}" alt="${product.name}" style="max-width: 300px; height: auto; border-radius: 8px; border: 1px solid #e0e0e0;" />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 24px;">${product.name}</h2>
                    <p style="color: #2563eb; font-size: 32px; font-weight: bold; margin: 10px 0;">$${product.price}</p>
                    <p style="color: #666666; font-size: 14px; margin: 10px 0;">Hurry! Limited stock available.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="${productUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-size: 18px; font-weight: bold;">Shop Now</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
                You received this email because you requested to be notified when this product is back in stock.
              </p>
              <p style="color: #666666; font-size: 12px; margin: 0;">
                <a href="${unsubscribeUrl}" style="color: #2563eb; text-decoration: none;">Unsubscribe</a> from these notifications
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate plain text version of email
 */
function getBackInStockEmailText({ product, productUrl, unsubscribeUrl }) {
  return `
Great News! ${product.name} is Back in Stock!

The product you were waiting for is now available:

${product.name}
Price: $${product.price}

Shop now: ${productUrl}

Hurry! Limited stock available.

---
You received this email because you requested to be notified when this product is back in stock.
Unsubscribe: ${unsubscribeUrl}
  `.trim();
}

/**
 * Send back in stock email notification
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email
 * @param {Object} params.product - Product details (name, slug, price, image)
 * @param {string} params.unsubscribeToken - Unsubscribe token
 */
export async function sendBackInStockEmail({ email, product, unsubscribeToken }) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 Email not configured - skipping email to:', email);
    return Promise.resolve(); // Don't fail if email is not configured
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const unsubscribeUrl = `${baseUrl}/api/stock-notifications/unsubscribe?token=${unsubscribeToken}`;

  const htmlContent = getBackInStockEmailTemplate({
    product,
    productUrl,
    unsubscribeUrl,
  });

  const textContent = getBackInStockEmailText({
    product,
    productUrl,
    unsubscribeUrl,
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Your Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 ${product.name} is Back in Stock!`,
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);
    console.log('📧 Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email to:', email);
    console.error('Error:', error.message);
    throw error;
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration() {
  const transporter = createTransporter();

  if (!transporter) {
    return {
      success: false,
      message: 'Email not configured',
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      message: 'Email configuration is valid',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
