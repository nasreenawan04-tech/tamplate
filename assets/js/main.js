// Cart State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadProducts();
  updateCartBadge();
  initNavbar();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.className = savedTheme;
  updateThemeIcon();
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
  const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
  
  // Update navbar shadow for dark mode
  const navbar = document.querySelector('.navbar');
  if (navbar && window.scrollY > 50) {
    navbar.style.boxShadow = newTheme === 'dark-mode'
      ? '0 4px 12px rgba(0, 0, 0, 0.5)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  }
  
  // Visual feedback for mobile
  if (window.innerWidth <= 768) {
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      themeBtn.style.transform = 'scale(1.1)';
      setTimeout(() => {
        themeBtn.style.transform = 'scale(1)';
      }, 200);
    }
  }
}

function updateThemeIcon() {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = document.body.classList.contains('dark-mode') 
      ? 'fas fa-sun' 
      : 'fas fa-moon';
  }
}

// Navbar Functionality
function initNavbar() {
  // Sticky navbar on scroll with dark mode support
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const isDarkMode = document.body.classList.contains('dark-mode');
      if (window.scrollY > 50) {
        navbar.style.boxShadow = isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = isDarkMode
          ? '0 2px 4px rgba(0, 0, 0, 0.3)'
          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
      }
    }
  });

  // Mobile menu toggle with Bootstrap compatibility
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    // Handle manual toggle for better control
    navbarToggler.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShown = navbarCollapse.classList.contains('show');
      if (isShown) {
        navbarCollapse.classList.remove('show');
      } else {
        navbarCollapse.classList.add('show');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const isClickInside = navbarToggler.contains(e.target) || navbarCollapse.contains(e.target);
      if (!isClickInside && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });

    // Close mobile menu when clicking a nav link
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) { // Only on mobile/tablet
          navbarCollapse.classList.remove('show');
        }
      });
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992 && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  }

  // Set active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Load Products
async function loadProducts() {
  try {
    const response = await fetch('/assets/data/products.json');
    products = await response.json();
    
    if (document.getElementById('productsGrid')) {
      // Check if there's a search term and apply filters
      const searchTerm = getSearchTermFromURL();
      
      // Pre-fill shop search input if search term exists
      const shopSearchInput = document.getElementById('shopSearch');
      if (shopSearchInput && searchTerm) {
        shopSearchInput.value = searchTerm;
      }
      
      if (searchTerm) {
        filterProducts();
      } else {
        displayProducts(products);
      }
    }
    
    if (document.getElementById('featuredProducts')) {
      displayFeaturedProducts(products.slice(0, 8));
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Display Products (Shop Page)
function displayProducts(productsToDisplay) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = productsToDisplay.map(product => `
    <div class="col-md-6 col-lg-4 mb-4">
      ${createProductCard(product)}
    </div>
  `).join('');
}

// Display Featured Products (Home Page)
function displayFeaturedProducts(productsToDisplay) {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;

  grid.innerHTML = productsToDisplay.map(product => `
    <div class="col-md-6 col-lg-3 mb-4">
      ${createProductCard(product)}
    </div>
  `).join('');
}

// Create Product Card HTML
function createProductCard(product) {
  const discount = product.originalPrice > 0 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
        <div class="product-actions">
          <button class="action-btn" onclick="viewProduct(${product.id})" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="review-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">$${product.price.toFixed(2)}</span>
          ${product.originalPrice > 0 ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

// Generate Star Rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

// Filter Products
function filterProducts() {
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const sortBy = document.getElementById('sortFilter')?.value || 'default';
  const searchTerm = getSearchTermFromURL();
  
  let filtered = [...products];
  
  // Filter by search term
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(lowerSearchTerm) || 
      p.category.toLowerCase().includes(lowerSearchTerm) ||
      p.description?.toLowerCase().includes(lowerSearchTerm)
    );
  }
  
  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  // Sort products
  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  
  displayProducts(filtered);
  
  // Show or clear search results message
  const resultsMessage = document.getElementById('searchResultsMessage');
  if (resultsMessage) {
    if (searchTerm) {
      resultsMessage.textContent = `Found ${filtered.length} results for "${searchTerm}"`;
      resultsMessage.style.display = 'block';
    } else {
      resultsMessage.textContent = '';
      resultsMessage.style.display = 'none';
    }
  }
}

// Get search term from URL
function getSearchTermFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  
  // Clear sessionStorage after reading to prevent persistence
  if (sessionStorage.getItem('searchTerm')) {
    sessionStorage.removeItem('searchTerm');
  }
  
  return searchParam || '';
}

// View Product
function viewProduct(productId) {
  window.location.href = `pages/product-detail.html?id=${productId}`;
}

// Add to Cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartBadge();
  showNotification('Product added to cart!', 'success');
}

// Wishlist Management
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Add to Wishlist
function addToWishlist(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = wishlist.find(item => item.id === productId);
  
  if (existingItem) {
    showNotification('Product already in wishlist!', 'info');
    return;
  }

  wishlist.push(product);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  // Update heart icon if on product detail page
  const heartIcon = document.querySelector('.product-action-buttons .fa-heart');
  if (heartIcon) {
    heartIcon.classList.remove('far');
    heartIcon.classList.add('fas');
  }
  
  showNotification('Product added to wishlist!', 'success');
}

// Remove from Wishlist
function removeFromWishlist(productId) {
  wishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  // Update heart icon if on product detail page
  const heartIcon = document.querySelector('.product-action-buttons .fa-heart');
  if (heartIcon) {
    heartIcon.classList.remove('fas');
    heartIcon.classList.add('far');
  }
  
  showNotification('Product removed from wishlist!', 'info');
}

// Toggle Wishlist
function toggleWishlist(productId) {
  const isInWishlist = wishlist.some(item => item.id === productId);
  
  if (isInWishlist) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }
}

// Share Product
function shareProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const url = window.location.href;
  const title = product.name;
  const text = `Check out ${product.name} on ShopVerse!`;

  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url
    })
    .then(() => showNotification('Product shared successfully!', 'success'))
    .catch((error) => {
      if (error.name !== 'AbortError') {
        fallbackShare(url, title);
      }
    });
  } else {
    fallbackShare(url, title);
  }
}

// Fallback share method
function fallbackShare(url, title) {
  // Create share modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div style="background: var(--card-color); border-radius: 1rem; padding: 2rem; max-width: 500px; width: 90%; box-shadow: var(--shadow-xl);">
      <h3 style="margin-bottom: 1.5rem; color: var(--text-color);">Share this product</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}', '_blank')" style="flex: 1; min-width: 120px; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: #1877f2; color: white; cursor: pointer;">
          <i class="fab fa-facebook-f"></i> Facebook
        </button>
        <button onclick="window.open('https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}', '_blank')" style="flex: 1; min-width: 120px; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: #1da1f2; color: white; cursor: pointer;">
          <i class="fab fa-twitter"></i> Twitter
        </button>
        <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}', '_blank')" style="flex: 1; min-width: 120px; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: #25d366; color: white; cursor: pointer;">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </button>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <input type="text" value="${url}" readonly style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--bg-color); color: var(--text-color);" id="shareUrl">
      </div>
      <div style="display: flex; gap: 1rem;">
        <button onclick="copyShareUrl()" style="flex: 1; padding: 0.75rem; border: 1px solid var(--primary-color); border-radius: 0.5rem; background: var(--primary-color); color: white; cursor: pointer;">
          <i class="fas fa-copy"></i> Copy Link
        </button>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="flex: 1; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-color); color: var(--text-color); cursor: pointer;">
          Close
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Copy share URL
function copyShareUrl() {
  const input = document.getElementById('shareUrl');
  input.select();
  document.execCommand('copy');
  showNotification('Link copied to clipboard!', 'success');
}

// Update Cart Badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Display Cart Items
function displayCartItems() {
  const cartContainer = document.getElementById('cartItems');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart" style="font-size: 4rem; opacity: 0.3;"></i>
        <h3 class="mt-3">Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <a href="shop.html" class="btn-secondary mt-3">Shop Now</a>
      </div>
    `;
    updateCartSummary();
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="product-category">${item.category}</p>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span style="min-width: 3rem; text-align: center; font-weight: 600;">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div class="text-end">
        <div class="current-price mb-3">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

// Update Quantity
function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  displayCartItems();
  updateCartBadge();
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  displayCartItems();
  updateCartBadge();
  showNotification('Item removed from cart', 'info');
}

// Update Cart Summary
function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const summaryHTML = `
    <h3 class="mb-4">Order Summary</h3>
    <div class="summary-row">
      <span>Subtotal:</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping:</span>
      <span>${shipping > 0 ? '$' + shipping.toFixed(2) : 'Free'}</span>
    </div>
    <div class="summary-row">
      <span>Tax (10%):</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <strong>Total:</strong>
      <strong class="summary-total">$${total.toFixed(2)}</strong>
    </div>
    <a href="${cart.length > 0 ? 'checkout.html' : '#'}" class="btn-secondary w-100 mt-3" ${cart.length === 0 ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
      Proceed to Checkout
    </a>
  `;

  const summaryElement = document.getElementById('cartSummary');
  if (summaryElement) {
    summaryElement.innerHTML = summaryHTML;
  }
}

// Newsletter Subscription
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail')?.value;
  if (email) {
    showNotification('Thank you for subscribing!', 'success');
    document.getElementById('newsletterEmail').value = '';
  }
}

// Hero Search Functionality
function handleHeroSearch(event) {
  if (event.key === 'Enter') {
    performHeroSearch();
  }
}

function performHeroSearch() {
  const searchInput = document.getElementById('heroSearch');
  const searchTerm = searchInput?.value.trim();
  
  if (searchTerm) {
    // Redirect to shop page with search parameter
    window.location.href = 'pages/shop.html?search=' + encodeURIComponent(searchTerm);
  } else {
    showNotification('Please enter a search term', 'info');
  }
}

// Shop Page Search Functionality
function handleShopSearch(event) {
  if (event.key === 'Enter') {
    performShopSearch();
  }
}

function performShopSearch() {
  const searchInput = document.getElementById('shopSearch');
  const searchTerm = searchInput?.value.trim();
  
  if (searchTerm) {
    // Update URL with search parameter and filter products
    const url = new URL(window.location.href);
    url.searchParams.set('search', searchTerm);
    window.history.pushState({}, '', url);
    filterProducts();
  } else {
    // Clear search if empty
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    window.history.pushState({}, '', url);
    searchInput.value = '';
    filterProducts();
  }
}

// Show Notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success-color)' : type === 'info' ? 'var(--primary-color)' : 'var(--danger-color)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Product Detail Page
async function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));

  if (!productId) {
    window.location.href = '../shop.html';
    return;
  }

  try {
    const response = await fetch('/assets/data/products.json');
    products = await response.json();
    const product = products.find(p => p.id === productId);

    if (!product) {
      window.location.href = '../shop.html';
      return;
    }

    displayProductDetail(product);
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

// Display Product Detail
function displayProductDetail(product) {
  // Update page title
  document.title = `${product.name} - ShopVerse`;

  // Gallery
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.getElementById('thumbnailImages');
  
  if (mainImage && product.images && product.images.length > 0) {
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
  }

  if (thumbnails && product.images) {
    thumbnails.innerHTML = product.images.map((img, index) => `
      <img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}" 
           onclick="changeMainImage('${img}', this)">
    `).join('');
  }

  // Product Info
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productCategory').textContent = product.category;
  document.getElementById('productRating').innerHTML = generateStars(product.rating);
  document.getElementById('reviewCount').textContent = `(${product.reviews} reviews)`;
  document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
  
  if (product.originalPrice > 0) {
    document.getElementById('productOriginalPrice').textContent = `$${product.originalPrice.toFixed(2)}`;
  } else {
    document.getElementById('productOriginalPrice').style.display = 'none';
  }

  document.getElementById('productDescription').textContent = product.description;

  // Features
  if (product.features) {
    document.getElementById('productFeatures').innerHTML = product.features.map(feature => `
      <li>${feature}</li>
    `).join('');
  }

  // Stock status
  document.getElementById('stockStatus').innerHTML = product.inStock 
    ? '<i class="fas fa-check-circle"></i> In Stock' 
    : '<i class="fas fa-times-circle"></i> Out of Stock';

  // Add to cart button
  const addToCartBtn = document.getElementById('addToCartBtn');
  addToCartBtn.onclick = () => addToCart(product.id);

  // Check if product is in wishlist and update heart icon
  const isInWishlist = wishlist.some(item => item.id === product.id);
  const wishlistBtn = document.querySelector('.product-action-buttons .btn-outline:first-child');
  if (wishlistBtn) {
    const heartIcon = wishlistBtn.querySelector('i');
    if (heartIcon && isInWishlist) {
      heartIcon.classList.remove('far');
      heartIcon.classList.add('fas');
    }
    wishlistBtn.onclick = () => toggleWishlist(product.id);
  }

  // Wire share button
  const shareBtn = document.querySelector('.product-action-buttons .btn-outline:last-child');
  if (shareBtn) {
    shareBtn.onclick = () => shareProduct(product.id);
  }
}

// Change Main Image
function changeMainImage(imageSrc, thumbnail) {
  document.getElementById('mainImage').src = imageSrc;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
}

// Form Validation
function validateCheckoutForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = 'var(--danger-color)';
    } else {
      input.style.borderColor = 'var(--border-color)';
    }
  });

  if (isValid) {
    showNotification('Order placed successfully!', 'success');
    setTimeout(() => {
      cart = [];
      saveCart();
      window.location.href = '../index.html';
    }, 2000);
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

// Auth Forms
function toggleAuthForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');

  if (formType === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
  }
}

function handleLogin(event) {
  event.preventDefault();
  showNotification('Login successful!', 'success');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1500);
}

function handleRegister(event) {
  event.preventDefault();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    showNotification('Passwords do not match!', 'error');
    return;
  }

  showNotification('Registration successful!', 'success');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1500);
}

// Contact Form
function handleContactForm(event) {
  event.preventDefault();
  showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
  event.target.reset();
}

// Comment Submission
function handleCommentSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('commentName').value;
  const email = document.getElementById('commentEmail').value;
  const comment = document.getElementById('commentText').value;
  
  if (name && email && comment) {
    // Create new comment element
    const commentHTML = `
      <div class="review-card" style="animation: fadeInUp 0.5s ease;">
        <div class="review-header">
          <div>
            <div class="reviewer-name">${name}</div>
          </div>
          <div class="review-date">Just now</div>
        </div>
        <p>${comment}</p>
        <div class="comment-reply mt-2">
          <button class="btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
            <i class="fas fa-reply"></i> Reply
          </button>
        </div>
      </div>
    `;
    
    // Add to comments list
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
      commentsList.insertAdjacentHTML('afterbegin', commentHTML);
    }
    
    // Reset form
    event.target.reset();
    
    // Show success notification
    showNotification('Comment posted successfully!', 'success');
    
    // Scroll to new comment
    setTimeout(() => {
      commentsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// Display Wishlist Items
function displayWishlistItems() {
  const wishlistContainer = document.getElementById('wishlistItems');
  const clearBtn = document.getElementById('clearWishlistBtn');
  
  if (!wishlistContainer) return;

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-heart" style="font-size: 4rem; opacity: 0.3;"></i>
        <h3 class="mt-3">Your wishlist is empty</h3>
        <p>Add products you love to see them here!</p>
        <a href="shop.html" class="btn-secondary mt-3">Browse Products</a>
      </div>
    `;
    if (clearBtn) clearBtn.style.display = 'none';
    return;
  }

  if (clearBtn) clearBtn.style.display = 'block';

  wishlistContainer.innerHTML = `
    <div class="row">
      ${wishlist.map(product => `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="product-card">
            <div class="product-image">
              <img src="${product.image}" alt="${product.name}">
              ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
              <div class="product-actions">
                <button class="action-btn" onclick="viewProduct(${product.id})" title="Quick View">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="removeFromWishlist(${product.id}); displayWishlistItems();" title="Remove from Wishlist">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
            </div>
            <div class="product-info">
              <div class="product-category">${product.category}</div>
              <h3 class="product-name">${product.name}</h3>
              <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="review-count">(${product.reviews})</span>
              </div>
              <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice > 0 ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Clear Wishlist
function clearWishlist() {
  if (confirm('Are you sure you want to clear your wishlist?')) {
    wishlist = [];
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlistItems();
    showNotification('Wishlist cleared!', 'info');
  }
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
