# Wishlist/Favorites Feature

## Overview
Users can now save products to their wishlist for later viewing and easy access.

## Features Implemented

### 1. **Wishlist State Management** (`utils/Store.js`)
- Added wishlist state to global store
- Wishlist data persists in cookies
- Actions: `WISHLIST_ADD_ITEM`, `WISHLIST_REMOVE_ITEM`, `WISHLIST_CLEAR`

### 2. **Wishlist Page** (`pages/wishlist.js`)
- View all saved wishlist items
- Remove individual items
- Clear entire wishlist
- Add items directly to cart from wishlist
- Shows out-of-stock status
- Empty state with call-to-action

### 3. **Header Navigation** (`components/Layout.js`)
- Wishlist icon with item count badge (red badge)
- Available in both desktop and mobile navigation
- Real-time count updates

### 4. **Product Detail Page** (`pages/product/[slug].js`)
- "Add to Wishlist" / "Remove from Wishlist" button
- Heart icon that fills when item is in wishlist
- Toast notifications for user feedback

### 5. **Product Cards** (`components/ProductItem.js`)
- Heart icon button on product cards
- Quick add/remove from wishlist
- Visual feedback (filled heart for wishlisted items)
- Toast notifications

## User Experience

### Adding to Wishlist
1. Click the heart icon on any product card or product detail page
2. Item is instantly added to wishlist
3. Success notification appears
4. Heart icon fills with red color
5. Wishlist count badge updates

### Removing from Wishlist
1. Click the filled heart icon or "Remove" button
2. Item is removed from wishlist
3. Confirmation notification appears
4. Heart icon returns to outline state
5. Wishlist count badge updates

### Viewing Wishlist
- Access via header navigation (heart icon)
- Grid layout showing all saved products
- Each item shows: image, name, brand, price, stock status
- "Add to Cart" button for in-stock items
- "Clear Wishlist" option to remove all items

## Data Persistence
- Wishlist data is stored in browser cookies
- Persists across browser sessions
- Syncs across all tabs

## Design Highlights
- Red heart icon and badge for wishlist (distinct from blue cart)
- Consistent with overall site theme
- Responsive design for mobile and desktop
- Smooth transitions and hover effects
- Toast notifications for all actions

## Future Enhancements (Optional)
- User account-based wishlist (sync across devices)
- Share wishlist with others
- Price drop notifications
- Move items between wishlist and cart
- Wishlist analytics
