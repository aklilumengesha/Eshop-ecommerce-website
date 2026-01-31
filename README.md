# eShop - Modern E-commerce Platform

A full-stack e-commerce application built with Next.js, MongoDB, and modern web technologies.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose
- **Payment**: PayPal Integration
- **Image Management**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- PayPal Developer account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd eshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your actual values in `.env.local`:
   
   - **MONGODB_URL**: Get from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
   - **NEXTAUTH_URL**: Use `http://localhost:3000` for local development
   - **Cloudinary credentials**: Get from [Cloudinary](https://cloudinary.com/)
   - **PayPal Client ID**: Get from [PayPal Developer](https://developer.paypal.com/)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URL` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_SECRET` | Cloudinary secret | Yes |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID | Yes |

## Features

- 🔐 User authentication and authorization
- 🛍️ Product catalog with search and filters
- 🛒 Shopping cart management
- 💳 Secure checkout process with PayPal
- 📦 Order tracking and history
- 👨‍💼 Admin dashboard with analytics
- 📊 Sales reports and charts
- 🖼️ Image upload with Cloudinary
- ⭐ Product ratings and reviews
- 📱 Fully responsive design

## Project Structure

```
eshop/
├── components/       # React components
├── models/          # MongoDB models
├── pages/           # Next.js pages and API routes
│   ├── api/        # API endpoints
│   ├── admin/      # Admin pages
│   └── ...         # Public pages
├── public/          # Static assets
├── styles/          # CSS styles
├── utils/           # Utility functions
└── ...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Support

For support, email your-email@example.com or open an issue in the repository.
