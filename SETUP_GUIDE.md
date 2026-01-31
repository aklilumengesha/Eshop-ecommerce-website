# 🚀 eShop Setup Guide

Complete step-by-step guide to run your eShop application.

---

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ⚠️ MongoDB (local or cloud - MongoDB Atlas)

---

## 📦 STEP 1: Install Dependencies

Dependencies are already installed! ✅

If you need to reinstall:
```bash
cd eshop
npm install
```

---

## 🔧 STEP 2: Configure Environment Variables

The `.env.local` file has been created with default values.

### **Required Configuration:**

#### **A. MongoDB Setup (REQUIRED)**

**Option 1: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env.local`:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eshop?retryWrites=true&w=majority
   ```

**Option 2: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use default connection:
   ```
   MONGODB_URL=mongodb://localhost:27017/eshop
   ```

#### **B. NextAuth Secret (REQUIRED)**

Generate a secure secret:
```bash
# On Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# Or use any random string:
NEXTAUTH_SECRET=my-super-secret-key-12345
```

Update in `.env.local`:
```
NEXTAUTH_SECRET=your-generated-secret-here
```

---

### **Optional Configuration:**

#### **C. Cloudinary (Optional - for image uploads)**

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your credentials from Dashboard
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_SECRET=your-secret
   ```

#### **D. PayPal (Optional - for payments)**

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create a sandbox account
3. Get your Client ID
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
   ```

---

## 🎯 STEP 3: Run the Development Server

```bash
cd eshop
npm run dev
```

The application will start on: **http://localhost:3000**

---

## 🗄️ STEP 4: Create Sample Data (Optional)

Since this is a fresh installation, you'll need to:

### **A. Create Admin User**
1. Go to http://localhost:3000/register
2. Register a new account
3. Manually update the user in MongoDB to make them admin:
   - Open MongoDB Compass or Atlas
   - Find your user in the `users` collection
   - Set `isAdmin: true`

### **B. Create Sample Products**
1. Login as admin
2. Go to http://localhost:3000/admin/dashboard
3. Click "Products" → "Create Product"
4. Fill in product details

---

## 🧪 STEP 5: Test the Application

### **User Features:**
- ✅ Register: http://localhost:3000/register
- ✅ Login: http://localhost:3000/login
- ✅ Browse Products: http://localhost:3000
- ✅ Search: http://localhost:3000/search
- ✅ Product Detail: Click any product
- ✅ Add to Cart
- ✅ Checkout Process
- ✅ Order History: http://localhost:3000/order-history
- ✅ Profile: http://localhost:3000/profile

### **Admin Features (requires admin user):**
- ✅ Dashboard: http://localhost:3000/admin/dashboard
- ✅ Orders Management: http://localhost:3000/admin/orders
- ✅ Products Management: http://localhost:3000/admin/products
- ✅ Users Management: http://localhost:3000/admin/users

---

## 🐛 Troubleshooting

### **Issue: MongoDB Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution:**
- Check if MongoDB is running
- Verify MONGODB_URL in `.env.local`
- For Atlas: Check IP whitelist (allow 0.0.0.0/0 for testing)

### **Issue: NextAuth Error**
```
[next-auth][error][NO_SECRET]
```
**Solution:**
- Make sure NEXTAUTH_SECRET is set in `.env.local`
- Restart the dev server after changing .env.local

### **Issue: Module Not Found**
```
Module not found: Can't resolve 'xyz'
```
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Port Already in Use**
```
Port 3000 is already in use
```
**Solution:**
- Kill the process using port 3000
- Or use a different port: `npm run dev -- -p 3001`

---

## 📝 Quick Start Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB setup (local or Atlas)
- [ ] `.env.local` configured with MONGODB_URL
- [ ] `.env.local` configured with NEXTAUTH_SECRET
- [ ] Dev server running (`npm run dev`)
- [ ] Register first user
- [ ] Make user admin in database
- [ ] Create sample products
- [ ] Test the application

---

## 🚀 Production Deployment

For production deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Environment Variables:**
   - Update NEXTAUTH_URL to your production domain
   - Use production MongoDB cluster
   - Use production PayPal credentials
   - Set NODE_ENV=production

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [PayPal Developer Docs](https://developer.paypal.com/docs/)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Make sure MongoDB is accessible
4. Restart the development server
5. Clear browser cache and cookies

---

**Happy Coding! 🎉**
