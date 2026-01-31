# Step 1: Review Model & API Routes

## What Was Implemented

### 1. Review Model (`models/Review.js`)
Created a comprehensive Review schema with:

**Fields:**
- `product` - Reference to Product
- `user` - Reference to User who wrote the review
- `userName` & `userEmail` - User information
- `rating` - 1-5 star rating
- `title` - Review title (max 100 chars)
- `comment` - Review text (max 2000 chars)
- `images` - Array of image URLs
- `verifiedPurchase` - Boolean flag if user bought the product
- `helpfulCount` - Number of helpful votes
- `helpfulVotes` - Array of user IDs who voted
- `status` - pending/approved/rejected (for moderation)
- `adminResponse` - Optional admin reply
- `timestamps` - createdAt & updatedAt

**Indexes:**
- Product + createdAt (for fast queries)
- User (for user's reviews)
- Status (for moderation)

### 2. API Routes

#### `/api/products/[id]/reviews` (GET & POST)
**GET** - Fetch all reviews for a product
- Query params: `sort` (recent, helpful, rating-high, rating-low)
- Query params: `filter` (all, 1-5 stars, verified)
- Returns: reviews array, rating statistics, total count

**POST** - Create a new review
- Requires authentication
- Validates: rating, title, comment
- Checks: no duplicate reviews per user
- Auto-detects: verified purchase from orders
- Updates: product rating automatically

#### `/api/reviews/[reviewId]` (PUT & DELETE)
**PUT** - Update own review
- User can edit their review
- Recalculates product rating

**DELETE** - Delete review
- User can delete own review
- Admin can delete any review
- Recalculates product rating

#### `/api/reviews/[reviewId]/helpful` (POST)
**POST** - Toggle helpful vote
- Requires authentication
- Toggle vote (add/remove)
- Updates helpful count

### 3. Features

✅ **Review CRUD Operations**
- Create, Read, Update, Delete reviews

✅ **Verified Purchase Detection**
- Automatically checks if user purchased the product
- Marks review with verified badge

✅ **Helpful Voting System**
- Users can mark reviews as helpful
- Vote count displayed
- Can toggle vote on/off

✅ **Rating Statistics**
- Breakdown by star rating (5★, 4★, 3★, 2★, 1★)
- Total review count
- Average rating

✅ **Automatic Product Rating Update**
- Product rating recalculated on review add/edit/delete
- Always stays in sync

✅ **Review Sorting**
- Most recent
- Most helpful
- Highest rating
- Lowest rating

✅ **Review Filtering**
- All reviews
- By star rating (1-5)
- Verified purchases only

✅ **Security**
- Authentication required for write operations
- Users can only edit/delete own reviews
- Admins can delete any review
- No duplicate reviews per user per product

✅ **Moderation Ready**
- Status field (pending/approved/rejected)
- Currently auto-approves (can change to pending)
- Admin response capability

## Database Schema

```javascript
Review {
  _id: ObjectId
  product: ObjectId (ref: Product)
  user: ObjectId (ref: User)
  userName: String
  userEmail: String
  rating: Number (1-5)
  title: String (max 100)
  comment: String (max 2000)
  images: [String]
  verifiedPurchase: Boolean
  helpfulCount: Number
  helpfulVotes: [ObjectId]
  status: String (pending/approved/rejected)
  adminResponse: {
    text: String
    date: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/[id]/reviews` | No | Get all reviews for product |
| POST | `/api/products/[id]/reviews` | Yes | Create new review |
| PUT | `/api/reviews/[reviewId]` | Yes | Update own review |
| DELETE | `/api/reviews/[reviewId]` | Yes | Delete review |
| POST | `/api/reviews/[reviewId]/helpful` | Yes | Toggle helpful vote |

## Next Steps

**Step 2** will include:
- Review submission form component
- Review display component
- Image upload functionality
- Rating statistics display
- Review list with sorting/filtering UI

## Commit Message

```
feat: add review model and API routes for product reviews

- Create Review model with comprehensive schema
- Add API routes for CRUD operations on reviews
- Implement helpful voting system
- Add verified purchase detection
- Enable review sorting and filtering
- Auto-update product ratings on review changes
- Add security checks and user authorization
```
