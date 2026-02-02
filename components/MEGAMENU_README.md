# Mega Menu Component

## Overview
A modern, responsive mega menu navigation component with category/subcategory dropdowns, featured items, and quick links.

## Features
- ✅ Multi-level category navigation
- ✅ Hover-activated dropdown with smooth animations
- ✅ Featured items section per category
- ✅ Quick access to deals, new arrivals, and trending items
- ✅ Fully responsive (desktop and mobile)
- ✅ Keyboard accessible
- ✅ Dark mode support
- ✅ Icon-based category identification

## Usage

### Basic Implementation
The Mega Menu is already integrated into the Layout component:

```jsx
import MegaMenu from './MegaMenu';

// In your navigation
<MegaMenu />
```

### Customizing Categories
Edit the `categories` array in `MegaMenu.js`:

```javascript
const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: <svg>...</svg>,
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones' },
      // Add more subcategories
    ],
    featured: {
      title: 'New Arrivals',
      items: ['Latest iPhone', 'MacBook Pro'],
    },
  },
  // Add more categories
];
```

## Category Structure

### Main Categories
- Electronics
- Fashion
- Home & Living
- Sports & Outdoors
- Beauty & Health

Each category includes:
- **Icon**: Visual identifier
- **Subcategories**: 6+ subcategories per main category
- **Featured Section**: Highlights trending/new items

## API Integration

### Get All Categories
```javascript
// Fetch categories dynamically
const response = await fetch('/api/categories');
const { categories } = await response.json();
```

### Category API Response
```json
{
  "success": true,
  "categories": [
    {
      "name": "Electronics",
      "count": 45,
      "sampleProducts": [...]
    }
  ]
}
```

## Styling

### Custom Classes
- `.mega-menu-category` - Category button styles
- `.mega-menu-subcategory` - Subcategory link styles
- `.mega-menu-featured` - Featured section background
- `.mega-menu-shadow` - Dropdown shadow effect

### Tailwind Configuration
The component uses custom color schemes defined in `tailwind.config.js`:
- `primary-*` - Main brand colors
- `secondary-*` - Accent colors
- `success-*`, `info-*`, `warning-*`, `danger-*` - Status colors

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate through categories
- **Enter/Space**: Open/close menu
- **Escape**: Close menu
- **Arrow Keys**: Navigate subcategories

### ARIA Attributes
- `aria-expanded`: Menu state
- `aria-haspopup`: Indicates dropdown
- `aria-label`: Screen reader descriptions

## Mobile Responsiveness

### Desktop (lg+)
- Full mega menu with hover activation
- Multi-column layout
- Featured items sidebar

### Mobile (< lg)
- Simplified dropdown menu
- Stacked layout
- Touch-friendly buttons

## Performance

### Optimizations
- Lazy loading of subcategories
- Debounced hover events (200ms)
- CSS transitions for smooth animations
- Minimal re-renders with React hooks

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Future Enhancements
- [ ] Dynamic category loading from API
- [ ] Category images/thumbnails
- [ ] Search within categories
- [ ] Recently viewed categories
- [ ] Category-specific promotions
- [ ] Multi-language support

## Troubleshooting

### Menu not appearing
- Check z-index conflicts
- Verify Headless UI installation: `npm install @headlessui/react`

### Hover not working
- Ensure `onMouseEnter` and `onMouseLeave` are properly bound
- Check for CSS pointer-events conflicts

### Mobile menu issues
- Verify responsive breakpoints in Tailwind config
- Check mobile menu toggle state

## Related Components
- `Layout.js` - Main layout wrapper
- `SearchAutocomplete.js` - Search functionality
- `CategoryShowcase.js` - Category display on homepage

## Credits
Developed by: Aklilu Mengesha
Version: 1.0.0
Last Updated: February 2026
