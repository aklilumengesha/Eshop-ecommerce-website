// Test if environment variables are loaded
require('dotenv').config({ path: '.env.local' });

console.log('Testing environment variables...\n');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? '✅ Loaded' : '❌ Not found');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Loaded' : '❌ Not found');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Loaded' : '❌ Not found');

if (process.env.MONGODB_URL) {
  console.log('\n✅ Environment variables are working!');
  console.log('MongoDB URL (masked):', process.env.MONGODB_URL.replace(/:[^:@]+@/, ':****@'));
} else {
  console.log('\n❌ MONGODB_URL is not loaded!');
  console.log('Make sure .env.local exists in the eshop folder');
}
