# ShopVerse - Premium eCommerce Template

A modern, fully responsive eCommerce website template built with HTML5, CSS3, JavaScript, and Bootstrap 5. Perfect for fashion, electronics, furniture, and beauty stores.

## 🌟 Features

### Core Functionality
- **8 Complete Pages**: Home, Shop, Product Details, Cart, Checkout, Login/Register, Contact, About
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Shopping Cart**: Add to cart, update quantity, remove items with real-time calculations
- **Product Filtering**: Filter by category and sort by price, rating, or name
- **Product Gallery**: Image thumbnails with smooth transitions
- **Form Validation**: Client-side validation for all forms
- **SEO Optimized**: Proper meta tags, semantic HTML, and heading structure

### Design Features
- Clean, modern minimalist design
- Smooth animations and hover effects
- Consistent typography using Inter font
- Soft color palette with gradient accents
- Premium UI components and cards
- Sticky navigation header
- Newsletter subscription section
- Comprehensive footer with social links

### Technical Features
- Pure Vanilla JavaScript (no frameworks)
- Bootstrap 5 for responsive grid
- Font Awesome icons
- LocalStorage for cart and theme persistence
- JSON-based product data structure
- Optimized images from Unsplash
- Fast loading performance

## 📁 Folder Structure

```
shopverse/
├── index.html                 # Home page
├── assets/
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   ├── js/
│   │   └── main.js           # JavaScript functionality
│   ├── data/
│   │   └── products.json     # Product data
│   └── images/               # Image assets (optional)
├── pages/
│   ├── shop.html             # Shop/Products page
│   ├── product-detail.html   # Product detail page
│   ├── cart.html             # Shopping cart page
│   ├── checkout.html         # Checkout page
│   ├── auth.html             # Login/Register page
│   ├── contact.html          # Contact page
│   └── about.html            # About Us page
└── README.md                 # Documentation
```

## 🚀 Getting Started

### Installation

1. **Download the template** and extract to your desired location
2. **Open `index.html`** in your browser to view the template
3. No build process or dependencies required - it's ready to use!

### Using with a Local Server (Recommended)

For the best experience, run with a local server:

```bash
# Using Python
python -m http.server 5000

# Using Node.js
npx http-server -p 5000

# Using PHP
php -S localhost:5000
```

Then open `http://localhost:5000` in your browser.

## 🎨 Customization Guide

### 1. Changing Colors

Edit the CSS variables in `assets/css/styles.css`:

```css
:root {
  --primary-color: #6366f1;      /* Main brand color */
  --secondary-color: #8b5cf6;    /* Secondary accent */
  --accent-color: #ec4899;       /* Accent highlights */
  /* ... more variables */
}
```

### 2. Adding/Editing Products

Edit `assets/data/products.json`:

```json
{
  "id": 1,
  "name": "Product Name",
  "category": "electronics",
  "price": 199.99,
  "originalPrice": 299.99,
  "rating": 4.5,
  "reviews": 128,
  "image": "image-url.jpg",
  "description": "Product description...",
  "inStock": true,
  "badge": "Sale"
}
```

**Badge options**: "Sale", "Hot", "New", "Best Seller", or leave empty

**Categories**: fashion, electronics, furniture, beauty

### 3. Updating Logo & Branding

1. Replace the brand name in navbar:
   ```html
   <a class="navbar-brand" href="index.html">
     <i class="fas fa-shopping-bag"></i> YourBrand
   </a>
   ```

2. Update footer information in all pages

3. Replace favicon in `<head>` section

### 4. Modifying Images

Replace Unsplash URLs with your own images:
- Product images: Update in `products.json`
- Hero/banner images: Update in HTML files
- Team photos: Update in `about.html`

**Recommended image sizes**:
- Product images: 800x800px (square)
- Hero banners: 1920x1080px
- Team photos: 400x400px (square)

### 5. Changing Fonts

Edit the Google Fonts import in all HTML files:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;700&display=swap" rel="stylesheet">
```

Then update the font-family in `styles.css`:

```css
body {
  font-family: 'YourFont', sans-serif;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚙️ JavaScript Functions

### Cart Management
- `addToCart(productId)` - Add product to cart
- `removeFromCart(productId)` - Remove from cart
- `updateQuantity(productId, change)` - Update item quantity
- `displayCartItems()` - Render cart items

### Theme Toggle
- `toggleTheme()` - Switch between light/dark mode
- `initTheme()` - Initialize theme from localStorage

### Product Display
- `loadProducts()` - Load products from JSON
- `filterProducts()` - Filter and sort products
- `displayProducts(products)` - Render product grid

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Third-Party Libraries

- **Bootstrap 5.3.0**: Responsive grid and components
- **Font Awesome 6.4.0**: Icon library
- **Google Fonts (Inter)**: Typography

All libraries are loaded via CDN - no local installation required.

## 🎯 SEO Best Practices

### Meta Tags (Included)
- Page-specific titles and descriptions
- Keywords meta tags
- Author information
- Viewport settings for mobile

### HTML Structure
- Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<article>`)
- Proper heading hierarchy (H1 → H6)
- Alt attributes on all images
- Descriptive link text

### Performance
- Optimized images from CDN
- Minimal CSS/JS files
- Fast loading animations
- Efficient DOM manipulation

## 🛠️ Common Modifications

### Add a New Page

1. Copy an existing page structure
2. Update navigation links in navbar
3. Add footer section
4. Link CSS and JS files with correct paths
5. Update meta tags

### Change Product Categories

1. Update category filters in `shop.html`
2. Update category icons in `index.html`
3. Ensure product JSON uses matching category names

### Customize Checkout Process

Edit `pages/checkout.html` and `assets/js/main.js`:
- Modify payment methods
- Add shipping options
- Customize form fields
- Update validation rules

## 📝 Forms & Validation

All forms include client-side validation:
- Required field checks
- Email format validation
- Password matching (registration)
- Custom error messaging

To modify validation, edit the respective functions in `main.js`.

## 🚢 Deployment / Publishing

### For Envato Market Submission

1. **Test Thoroughly**: Check all pages, links, and functionality
2. **Validate Code**: Use W3C validators for HTML/CSS
3. **Optimize Images**: Compress all images for web
4. **Documentation**: Ensure README is complete and accurate
5. **License**: Add appropriate license file
6. **Package**: Create a ZIP file with all files

### For Live Website

1. Upload all files to your web hosting
2. Update all absolute URLs if needed
3. Configure SSL certificate
4. Set up custom domain
5. Test on live server

## 📄 File Licenses

- Template code: Your chosen license
- Images: Unsplash (Free to use)
- Icons: Font Awesome (Free license)
- Bootstrap: MIT License

## 🐛 Troubleshooting

### Cart not working
- Check browser localStorage is enabled
- Clear localStorage and refresh: `localStorage.clear()`

### Products not loading
- Verify `products.json` path is correct
- Check browser console for errors
- Ensure JSON is valid (use JSONLint)

### Images not displaying
- Check image URLs are accessible
- Verify correct file paths (relative vs absolute)
- Check browser network tab for failed requests

### Dark mode not persisting
- Ensure localStorage is enabled
- Check browser privacy settings
- Verify theme toggle function is called

## 💡 Tips for Customization

1. **Start with colors**: Change CSS variables first to match your brand
2. **Use real images**: Replace Unsplash URLs with your product photos
3. **Update content**: Customize all text content to match your business
4. **Test responsive**: Always test on mobile devices
5. **Performance**: Optimize images before uploading
6. **Backup**: Keep a copy of original files before major changes

## 📧 Support

For support with this template:
- Check this README for common solutions
- Review the code comments in CSS/JS files
- Test in different browsers to isolate issues

## 🎉 Credits

- **Design & Development**: ShopVerse Template
- **Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)
- **Images**: Unsplash

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: ShopVerse Template

Thank you for choosing ShopVerse! We hope this template serves you well. Happy selling! 🛍️
#   t a m p l a t e  
 