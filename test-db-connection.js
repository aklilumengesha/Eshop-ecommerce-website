// Test MongoDB Connection
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection string:', process.env.MONGODB_URL?.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    
    await mongoose.disconnect();
    console.log('👋 Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Common fixes:');
    console.log('1. Whitelist your IP in MongoDB Atlas (Network Access)');
    console.log('2. Check username/password are correct');
    console.log('3. Verify database user has proper permissions');
    process.exit(1);
  }
};

testConnection();
