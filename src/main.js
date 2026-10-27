/* ==========================================================================
   HomeMaded - Minimalist South Indian Cloud Kitchen Logic
   Vanilla JavaScript ES6+ • Reactive State • Zero Dependencies
   ========================================================================== */

// --- Menu Data Model ---
const MENU_ITEMS = [
  {
    id: 'item-1',
    name: 'Ghee Podi Thatte Idli',
    category: 'tiffins',
    price: 110,
    tag: "Amma's Signature",
    tagHighlight: true,
    spice: '🌶️ Mild warmth',
    description: 'Thick, pillow-soft steamed plate idlis drenched in native cow ghee & fiery gunpowder milagai podi.',
    includes: ['Thatte Idli (2)', 'Pure Cow Ghee Podi', 'Tanjore Sambar', 'Coconut Chutney', 'Tomato Thokku'],
    image: './images/idli-vada.jpg'
  },
  {
    id: 'item-2',
    name: 'Crispy Ney Roast Paper Dosa',
    category: 'tiffins',
    price: 140,
    tag: 'Cast Iron Crisp',
    tagHighlight: true,
    spice: '🌶️ Medium spice',
    description: 'Naturally fermented 14-hour batter roasted paper-thin in pure golden ghee on seasoned iron tawa.',
    includes: ['Ney Roast Dosa (1)', 'Drumstick Sambar', 'Fresh Coconut Chutney', 'Kara Chutney'],
    image: './images/hero-dosa.jpg'
  },
  {
    id: 'item-3',
    name: 'Chettinad Clay-Pot Dum Biryani',
    category: 'meals',
    price: 280,
    tag: 'Earthen Pot Cooked',
    tagHighlight: true,
    spice: '🌶️🌶️ Robust aroma',
    description: 'Fragrant Seeraga Samba short-grain rice slow-cooked in clay pots with hand-pounded spices and caramelized shallots.',
    includes: ['Clay-Pot Biryani', 'Boiled Egg (1)', 'Onion Pachadi (Raita)', 'Mirchi Ka Salan', 'Kesari Sweet'],
    image: './images/biryani-pot.jpg'
  },
  {
    id: 'item-4',
    name: 'Madurai Degree Filter Kaapi',
    category: 'snacks',
    price: 65,
    tag: 'Slow Drip Brew',
    tagHighlight: false,
    spice: '☕ Traditional Roast',
    description: 'Chicory-infused dark roast decoction brewed fresh in traditional brass drip filters with frothed milk.',
    includes: ['Fresh Decoction Kaapi (150ml)', 'Frothy Full-Cream Milk', 'Traditional Brass Dabara Set'],
    image: './images/filter-kaapi.jpg'
  },
  {
    id: 'item-5',
    name: 'Golden Medu Vada Duo (2 Pcs)',
    category: 'tiffins',
    price: 90,
    tag: 'Freshly Fried',
    tagHighlight: false,
    spice: '🌶️ Crushed pepper',
    description: 'Crisp exterior with an airy cloud-soft interior, packed with whole black peppercorns and fresh curry leaves.',
    includes: ['Medu Vada (2)', 'Piping Hot Sambar', 'Fresh Coconut Chutney', 'Ginger Garlic Dip'],
    image: './images/idli-vada.jpg'
  },
  {
    id: 'item-6',
    name: 'Curd Rice & Sun-Dried Mor Milagai',
    category: 'meals',
    price: 130,
    tag: 'Soul Soothing',
    tagHighlight: false,
    spice: '🌶️ Tempered mustard',
    description: 'Velvety homestyle set curd gently mashed with soft Ponni rice, tempered with mustard seeds and curry leaves.',
    includes: ['Tempered Curd Rice', 'Sun-Dried Mor Milagai (2)', 'Homemade Mango Thokku', 'Crisp Appalam (1)'],
    image: './images/hero-dosa.jpg'
  },
  {
    id: 'item-7',
    name: 'Banana Leaf Mini Meal',
    category: 'meals',
    price: 220,
    tag: 'Complete Feast',
    tagHighlight: false,
    spice: '🌶️ Traditional balance',
    description: 'Steamed Ponni rice packed inside fragrant banana leaves with authentic homestyle sides and gravies.',
    includes: ['Ponni Rice', 'Drumstick Sambar', 'Pepper Rasam', 'Vegetable Poriyal', 'Dal Kootu', 'Appalam', 'Pickle'],
    image: './images/biryani-pot.jpg'
  },
  {
    id: 'item-8',
    name: 'Davangere Benne Dosa',
    category: 'tiffins',
    price: 155,
    tag: 'Fresh White Butter',
    tagHighlight: false,
    spice: '🌶️ Mild spiced potato',
    description: 'Fluffy yet golden crust dosa roasted generously with fresh churned white butter (benne).',
    includes: ['Benne Dosa (1)', 'Spiced Potato Palya', 'Fresh White Butter Dollop', 'Davangere Red Chutney', 'Coconut Chutney'],
    image: './images/hero-dosa.jpg'
  }
];

// --- State Management ---
class KitchenState {
  constructor() {
    this.cart = this.loadCart();
    this.promoApplied = null;
    this.currentCategory = 'all';
    this.freeDeliveryThreshold = 400;
    this.listeners = [];
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('homemaded_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  saveCart() {
    try {
      localStorage.setItem('homemaded_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  addItem(itemId) {
    this.cart[itemId] = (this.cart[itemId] || 0) + 1;
    this.saveCart();
  }

  removeItem(itemId) {
    if (this.cart[itemId] > 1) {
      this.cart[itemId] -= 1;
    } else {
      delete this.cart[itemId];
    }
    this.saveCart();
  }

  getItemCount(itemId) {
    return this.cart[itemId] || 0;
  }

  getTotalItemsCount() {
    return Object.values(this.cart).reduce((sum, count) => sum + count, 0);
  }

  getSubtotal() {
    return Object.entries(this.cart).reduce((total, [id, count]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      return total + (item ? item.price * count : 0);
    }, 0);
  }

  applyPromo(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRSTBITE') {
      this.promoApplied = { code: 'FIRSTBITE', discountPercent: 0.15 };
      this.notify();
      return { success: true, message: '15% FIRSTBITE discount applied!' };
    }
    return { success: false, message: 'Invalid code. Try "FIRSTBITE"' };
  }

  clearCart() {
    this.cart = {};
    this.promoApplied = null;
    this.saveCart();
  }
}

// Instantiate global state
const state = new KitchenState();

// --- DOM References ---
const menuGrid = document.getElementById('menu-items-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartToggleBtn = document.getElementById('cart-drawer-toggle');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartCountBadge = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmptyState = document.getElementById('cart-empty-state');
const cartFooter = document.getElementById('cart-footer');
const cartItemsCountText = document.getElementById('cart-items-count-text');
const cartBrowseMenuBtn = document.getElementById('cart-browse-menu-btn');

// Bill Breakdown
const billSubtotal = document.getElementById('bill-subtotal');
const billDiscountRow = document.getElementById('bill-discount-row');
const billDiscount = document.getElementById('bill-discount');
const billPackaging = document.getElementById('bill-packaging');
const billDelivery = document.getElementById('bill-delivery');
const billTotal = document.getElementById('bill-total');
const btnTotalDisplay = document.getElementById('btn-total-display');
const trackerText = document.getElementById('tracker-text');
const trackerPercentage = document.getElementById('tracker-percentage');
const trackerProgressFill = document.getElementById('tracker-progress-fill');

// Promo
const promoInput = document.getElementById('promo-input');
const applyPromoBtn = document.getElementById('apply-promo-btn');
const promoMessage = document.getElementById('promo-applied-message');

// Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const checkoutModalBackdrop = document.getElementById('checkout-modal-backdrop');
const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');
const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const orderSuccessScreen = document.getElementById('order-success-screen');
const successBackHomeBtn = document.getElementById('success-back-home-btn');

// Mobile Nav
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

// Pincode Form
const pincodeForm = document.getElementById('pincode-form');
const pincodeInput = document.getElementById('pincode-input');
const pincodeResult = document.getElementById('pincode-result');



// --- Render Menu Items ---
function renderMenu(category = 'all') {
  if (!menuGrid) return;
  
  const filtered = category === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === category);

  menuGrid.innerHTML = filtered.map(item => {
    const count = state.getItemCount(item.id);
    
    return `
      <article class="menu-card" data-id="${item.id}">
        <div class="menu-card-thumb-wrap">
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" onerror="this.onerror=null; if(this.src.indexOf('public/') === -1) { this.src = './public' + this.src.substring(this.src.lastIndexOf('/images')); }" />
          <div class="menu-card-tags">
            <span class="badge-tag ${item.tagHighlight ? 'highlight' : ''}">${item.tag}</span>
          </div>
        </div>
        <div class="menu-card-content">
          <div class="menu-card-header">
            <h3 class="menu-item-title">${item.name}</h3>
            <span class="menu-item-price">₹${item.price}</span>
          </div>
          <p class="menu-item-desc">${item.description}</p>
          
          <!-- Food Contents Breakdown (Clean Minimalist Editorial Line) -->
          <div class="menu-box-includes">
            <span class="includes-label">Includes:</span>
            <span class="includes-text">${item.includes.join(' · ')}</span>
          </div>

          <div class="menu-card-footer">
            <span class="spice-rating">${item.spice}</span>
            <div class="card-action-slot">
              ${
                count > 0 
                  ? `
                    <div class="quantity-stepper">
                      <button class="stepper-btn" data-action="decrement" data-id="${item.id}" aria-label="Decrease quantity">
                        <svg viewBox="0 0 12 2" width="12" height="2" fill="none" aria-hidden="true"><rect width="12" height="2" rx="1" fill="currentColor"/></svg>
                      </button>
                      <span class="stepper-count">${count}</span>
                      <button class="stepper-btn" data-action="increment" data-id="${item.id}" aria-label="Increase quantity">
                        <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true"><path d="M5 0h2v12H5zM0 5h12v2H0z" fill="currentColor"/></svg>
                      </button>
                    </div>
                  `
                  : `
                    <button class="add-card-btn" data-action="add" data-id="${item.id}">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="2" x2="8" y2="14"></line><line x1="2" y1="8" x2="14" y2="8"></line></svg>
                      <span>Add</span>
                    </button>
                  `
              }
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// --- Render Cart Drawer Content ---
function updateCartUI() {
  const totalCount = state.getTotalItemsCount();
  const subtotal = state.getSubtotal();
  
  // Header Badge
  if (cartCountBadge) {
    cartCountBadge.textContent = totalCount;
  }
  if (cartItemsCountText) {
    cartItemsCountText.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
  }

  // Free delivery calculation
  const threshold = state.freeDeliveryThreshold;
  if (subtotal >= threshold) {
    if (trackerText) trackerText.innerHTML = `🎉 <strong>Free Delivery unlocked!</strong>`;
    if (trackerPercentage) trackerPercentage.textContent = `100%`;
    if (trackerProgressFill) trackerProgressFill.style.width = `100%`;
  } else {
    const diff = threshold - subtotal;
    const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
    if (trackerText) trackerText.textContent = `Add ₹${diff} more for Free Delivery`;
    if (trackerPercentage) trackerPercentage.textContent = `${pct}%`;
    if (trackerProgressFill) trackerProgressFill.style.width = `${pct}%`;
  }

  // Empty State Toggle
  if (totalCount === 0) {
    if (cartEmptyState) cartEmptyState.style.display = 'flex';
    if (cartItemsContainer) cartItemsContainer.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartItemsContainer) cartItemsContainer.style.display = 'flex';
    if (cartFooter) cartFooter.style.display = 'block';

    // Render items in cart
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = Object.entries(state.cart).map(([id, count]) => {
        const item = MENU_ITEMS.find(m => m.id === id);
        if (!item) return '';
        return `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.onerror=null; if(this.src.indexOf('public/') === -1) { this.src = './public' + this.src.substring(this.src.lastIndexOf('/images')); }" />
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-includes">${item.includes.slice(0, 3).join(', ')}...</div>
              <div class="cart-item-price">₹${item.price * count}</div>
            </div>
            <div class="cart-item-controls">
              <div class="quantity-stepper">
                <button class="stepper-btn" data-action="decrement" data-id="${item.id}" aria-label="Decrease quantity">
                  <svg viewBox="0 0 12 2" width="12" height="2" fill="none" aria-hidden="true"><rect width="12" height="2" rx="1" fill="currentColor"/></svg>
                </button>
                <span class="stepper-count">${count}</span>
                <button class="stepper-btn" data-action="increment" data-id="${item.id}" aria-label="Increase quantity">
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true"><path d="M5 0h2v12H5zM0 5h12v2H0z" fill="currentColor"/></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Calculations
    const packagingFee = 15;
    const deliveryFee = subtotal >= threshold ? 0 : 25;
    let discount = 0;

    if (state.promoApplied) {
      discount = Math.round(subtotal * state.promoApplied.discountPercent);
    }

    const finalTotal = Math.max(0, subtotal - discount + packagingFee + deliveryFee);

    if (billSubtotal) billSubtotal.textContent = `₹${subtotal}`;
    
    if (billDiscountRow && billDiscount) {
      if (discount > 0) {
        billDiscountRow.style.display = 'flex';
        billDiscount.textContent = `-₹${discount}`;
      } else {
        billDiscountRow.style.display = 'none';
      }
    }

    if (billPackaging) billPackaging.textContent = `₹${packagingFee}`;
    if (billDelivery) {
      billDelivery.innerHTML = deliveryFee === 0 
        ? `<span style="color:#10B981;font-weight:700">FREE</span>` 
        : `₹${deliveryFee}`;
    }
    if (billTotal) billTotal.textContent = `₹${finalTotal}`;
    if (btnTotalDisplay) btnTotalDisplay.textContent = `₹${finalTotal}`;
  }

  // Re-render menu buttons to reflect updated quantities
  renderMenu(state.currentCategory);
}

// --- Cart Drawer Open / Close ---
function openCart() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.add('active');
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.remove('active');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Checkout Modal Flow ---
function openCheckoutModal() {
  closeCart();
  if (checkoutModal && checkoutModalBackdrop) {
    checkoutModal.classList.add('active');
    checkoutModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Ensure form is displayed and success screen hidden
    if (checkoutForm) checkoutForm.style.display = 'flex';
    if (orderSuccessScreen) orderSuccessScreen.style.display = 'none';
  }
}

function closeCheckoutModal() {
  if (checkoutModal && checkoutModalBackdrop) {
    checkoutModal.classList.remove('active');
    checkoutModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Event Handlers & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initial State Subscription
  state.subscribe(() => {
    updateCartUI();
  });

  // 2. Category Tab Switching
  const categoryBtns = document.querySelectorAll('.menu-tab-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const cat = btn.dataset.category;
      state.currentCategory = cat;
      renderMenu(cat);
    });
  });

  // 3. Delegate Menu & Cart Button Clicks
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action], [data-add-id]');
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id || target.dataset.addId;

    if (action === 'add' || target.dataset.addId) {
      state.addItem(id);
      openCart();
    } else if (action === 'increment') {
      state.addItem(id);
    } else if (action === 'decrement') {
      state.removeItem(id);
    }
  });

  // 4. Cart Drawer Toggles
  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (cartBrowseMenuBtn) {
    cartBrowseMenuBtn.addEventListener('click', () => {
      closeCart();
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 5. Promo Code Handler
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim();
      const res = state.applyPromo(code);
      if (promoMessage) {
        promoMessage.textContent = res.message;
        promoMessage.className = `promo-message ${res.success ? 'success' : 'notice'}`;
      }
    });
  }

  // 6. Checkout Trigger
  if (checkoutTriggerBtn) {
    checkoutTriggerBtn.addEventListener('click', openCheckoutModal);
  }
  if (closeCheckoutModalBtn) {
    closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
  }
  if (checkoutModalBackdrop) {
    checkoutModalBackdrop.addEventListener('click', closeCheckoutModal);
  }

  // 7. Checkout Form Submission (Simulation)
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Show simulated confirmation state
      checkoutForm.style.display = 'none';
      if (orderSuccessScreen) {
        orderSuccessScreen.style.display = 'block';
      }
      state.clearCart();
    });
  }

  if (successBackHomeBtn) {
    successBackHomeBtn.addEventListener('click', () => {
      closeCheckoutModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Pincode Zone Validator
  if (pincodeForm && pincodeInput && pincodeResult) {
    pincodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = pincodeInput.value.trim();
      if (!/^\d{6}$/.test(val)) {
        pincodeResult.textContent = 'Please enter a valid 6-digit PIN code.';
        pincodeResult.className = 'pincode-result notice';
        return;
      }

      // Simulated zone check with lively response
      const randomMins = Math.floor(Math.random() * 10) + 26; // 26 - 35 mins
      pincodeResult.innerHTML = `✅ <strong>Home Delivery Available in ${val}:</strong> Fresh homestyle meal arriving hot from our kitchen in ~${randomMins} minutes!`;
      pincodeResult.className = 'pincode-result success';
    });
  }

  // 9. Sticky Header Shadow on Scroll
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 10. Mobile Navigation Toggle
  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
    });

    // Close on clicking mobile links
    const mobileLinks = mobileNavDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    });
  }



});
