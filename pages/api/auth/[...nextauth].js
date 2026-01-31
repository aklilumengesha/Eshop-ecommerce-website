import User from "@/models/User";
import db from "@/utils/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, add user data to token
      if (user) {
        token._id = user._id;
        token.isAdmin = user.isAdmin;
        console.log('=== JWT CALLBACK (Initial Login) ===');
        console.log('Setting token with user data:', {
          _id: user._id,
          isAdmin: user.isAdmin,
          email: user.email
        });
      }
      
      console.log('=== JWT CALLBACK (Current Token) ===');
      console.log('Token _id:', token._id);
      console.log('Token isAdmin:', token.isAdmin);
      
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.isAdmin = token.isAdmin;
      
      console.log('=== SESSION CALLBACK ===');
      console.log('Session user:', {
        email: session.user.email,
        _id: session.user._id,
        isAdmin: session.user.isAdmin
      });
      
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await db.connect();
        
        const user = await User.findOne({
          email: credentials.email,
        });
        
        await db.disconnect();
        
        console.log('=== LOGIN ATTEMPT ===');
        console.log('Email:', credentials.email);
        console.log('User found:', !!user);
        
        if (user) {
          console.log('User details from DB:');
          console.log('  - ID:', user._id.toString());
          console.log('  - Name:', user.name);
          console.log('  - Email:', user.email);
          console.log('  - isAdmin:', user.isAdmin);
          console.log('  - isAdmin type:', typeof user.isAdmin);
        }
        
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          const userData = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: "default",
            isAdmin: user.isAdmin,
          };
          console.log('✓ Login successful!');
          console.log('Returning user data:', JSON.stringify(userData, null, 2));
          return userData;
        }
        
        console.log('✗ Login failed: Invalid credentials');
        throw new Error("Invalid email or password");
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
