# ⚡ Quick Start - Get Running in 5 Minutes!

## 🎯 Minimum Setup to See the Website

### **1. MongoDB Setup (Choose ONE option)**

**EASIEST: MongoDB Atlas (Cloud)**
```
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Paste it in .env.local as MONGODB_URL
```

**OR Local MongoDB:**
```
1. Install MongoDB from: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Keep default: MONGODB_URL=mongodb://localhost:27017/eshop
```

### **2. Generate NextAuth Secret**

Open PowerShell and run:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

Copy the output and paste it in `.env.local` as `NEXTAUTH_SECRET`

### **3. Start the Server**

```bash
npm run dev
```

### **4. Open Browser**

Go to: **http://localhost:3000**

---

## 🎨 What You'll See

- **Homepage**: Empty (no products yet)
- **Register**: Create your account
- **Login**: Sign in

---

## 👤 Create Admin User

1. Register at: http://localhost:3000/register
2. Open MongoDB (Compass or Atlas web interface)
3. Find your database → `users` collection
4. Find your user document
5. Edit: Change `isAdmin: false` to `isAdmin: true`
6. Save
7. Logout and login again
8. You'll now see "Admin Dashboard" in the menu!

---

## 📦 Add Sample Products

1. Login as admin
2. Go to: http://localhost:3000/admin/products
3. Click "Create Product"
4. Fill in the form:
   - Name: "Sample T-Shirt"
   - Slug: "sample-t-shirt"
   - Price: 29.99
   - Category: "Clothing"
   - Brand: "Nike"
   - Stock: 10
   - Description: "A comfortable cotton t-shirt"
   - Image: Use any image URL (e.g., https://via.placeholder.com/400)
5. Click "Update"
6. Repeat for more products!

---

## ✅ You're Ready!

Now you can:
- Browse products on homepage
- Add to cart
- Complete checkout
- View orders
- Manage products as admin

---

## 🔥 Optional: Add Images & Payments

**For Image Uploads (Cloudinary):**
- Sign up at: https://cloudinary.com/
- Add credentials to `.env.local`

**For PayPal Payments:**
- Sign up at: https://developer.paypal.com/
- Create sandbox account
- Add Client ID to `.env.local`

---

**That's it! You're running! 🎉**
