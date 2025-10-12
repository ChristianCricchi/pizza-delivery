/**
 * Tony's Pizza Delivery Website JavaScript
 * Handles navigation, cart functionality, and form interactions
 */

// ===================================
// GLOBAL VARIABLES
// ===================================
let cart = [];
let cartTotal = 0;
const deliveryFee = 2.99;
const CART_STORAGE_KEY = 'tonys_pizza_cart_v1';

// Load cart from storage early
try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) cart = parsed;
    }
} catch(_) {}

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

/**
 * Initialize navigation when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeOrderPage();
    initializeContactPage();
    setupOrderModal();
    setupInlineValidation();
});

/**
 * Set up mobile navigation toggle
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        const toggle = function() {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            const next = !expanded;
            hamburger.setAttribute('aria-expanded', String(next));
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (next) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        };
        hamburger.addEventListener('click', toggle);

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Focus trap and ESC handling for mobile menu
        function handleMenuKeydown(e) {
            if (!navMenu.classList.contains('active')) return;
            const focusable = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            } else if (e.key === 'Escape') {
                closeMobileMenu();
                hamburger.focus();
            }
        }
        function openMobileMenu() {
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) firstLink.focus();
            document.addEventListener('keydown', handleMenuKeydown);
            // close if clicking outside
            document.addEventListener('click', outsideClickClose);
        }
        function closeMobileMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.removeEventListener('keydown', handleMenuKeydown);
            document.removeEventListener('click', outsideClickClose);
        }
        function outsideClickClose(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        }
    }
}

// ===================================
// MENU DATA FOR ORDER PAGE
// ===================================
const menuData = {
    classic: [
        { name: "Margherita", price: 12.99, ingredients: "Tomato, Mozzarella, Basil", calories: 900 },
        { name: "Pepperoni", price: 14.99, ingredients: "Tomato, Mozzarella, Pepperoni", calories: 1100 },
        { name: "Hawaiian", price: 16.99, ingredients: "Tomato, Mozzarella, Ham, Pineapple", calories: 1050 },
        { name: "Cheese", price: 11.99, ingredients: "Tomato, Mozzarella", calories: 850 },
        { name: "Veggie", price: 13.99, ingredients: "Tomato, Mozzarella, Peppers, Olives", calories: 950 },
        { name: "BBQ Chicken", price: 15.99, ingredients: "BBQ Sauce, Chicken, Onion", calories: 1200 },
        { name: "Four Cheese", price: 14.49, ingredients: "Mozzarella, Cheddar, Parmesan, Gorgonzola", calories: 980 },
        { name: "Spinach Ricotta", price: 13.49, ingredients: "Spinach, Ricotta, Mozzarella", calories: 920 },
        { name: "Mushroom", price: 13.99, ingredients: "Tomato, Mozzarella, Mushrooms", calories: 900 },
        { name: "Sausage", price: 15.49, ingredients: "Tomato, Mozzarella, Sausage", calories: 1150 },
        { name: "Onion", price: 12.49, ingredients: "Tomato, Mozzarella, Onion", calories: 870 },
    ],
    premium: [
        { name: "Supreme", price: 18.99, ingredients: "Pepperoni, Sausage, Peppers, Onions", calories: 1300 },
        { name: "Meat Lovers", price: 20.99, ingredients: "Pepperoni, Sausage, Ham, Bacon, Beef", calories: 1500 },
        { name: "Veggie Deluxe", price: 17.99, ingredients: "Peppers, Mushrooms, Onions, Tomatoes, Olives", calories: 1100 },
        { name: "Buffalo Chicken", price: 19.49, ingredients: "Buffalo Sauce, Chicken, Mozzarella", calories: 1350 },
        { name: "Truffle", price: 21.99, ingredients: "Truffle Oil, Mushrooms, Mozzarella", calories: 1200 },
        { name: "Seafood", price: 22.99, ingredients: "Shrimp, Crab, Mozzarella", calories: 1250 },
        { name: "Prosciutto", price: 19.99, ingredients: "Prosciutto, Arugula, Mozzarella", calories: 1150 },
        { name: "Greek", price: 18.49, ingredients: "Feta, Olives, Tomato, Onion", calories: 1050 },
        { name: "Chicken Alfredo", price: 20.49, ingredients: "Alfredo Sauce, Chicken, Mozzarella", calories: 1400 },
        { name: "Pesto", price: 17.99, ingredients: "Pesto, Mozzarella, Tomato", calories: 1000 },
        { name: "Caprese", price: 18.99, ingredients: "Tomato, Mozzarella, Basil, Balsamic", calories: 950 },
    ],
    specialty: [
        { name: "Taco Pizza", price: 19.99, ingredients: "Beef, Lettuce, Tomato, Cheese", calories: 1350 },
        { name: "Breakfast Pizza", price: 17.99, ingredients: "Egg, Bacon, Cheese", calories: 1200 },
        { name: "Philly Cheese Steak", price: 21.49, ingredients: "Steak, Peppers, Cheese", calories: 1450 },
        { name: "Buffalo Veggie", price: 16.99, ingredients: "Buffalo Sauce, Veggies, Cheese", calories: 1100 },
        { name: "Spicy Italian", price: 20.99, ingredients: "Spicy Sausage, Peppers, Cheese", calories: 1400 },
        { name: "Pulled Pork", price: 22.49, ingredients: "Pulled Pork, BBQ Sauce, Cheese", calories: 1500 },
        { name: "Mac & Cheese", price: 18.99, ingredients: "Macaroni, Cheese, Bacon", calories: 1300 },
        { name: "Chicken Bacon Ranch", price: 20.99, ingredients: "Chicken, Bacon, Ranch, Cheese", calories: 1450 },
        { name: "BLT Pizza", price: 17.99, ingredients: "Bacon, Lettuce, Tomato, Cheese", calories: 1200 },
        { name: "Cheeseburger Pizza", price: 19.99, ingredients: "Beef, Pickles, Cheese, Ketchup", calories: 1350 },
        { name: "Garlic Lovers", price: 16.99, ingredients: "Garlic, Cheese, Herbs", calories: 950 },
    ]
};

// ===================================
// ORDER PAGE FUNCTIONALITY
// ===================================

/**
 * Initialize order page functionality
 */
function initializeOrderPage() {
    if (window.location.pathname.includes('order.html') || 
        window.location.pathname.endsWith('order.html')) {
        // Render menu and controls
        renderMenu();
        // Event listeners for controls
        document.getElementById('categorySelect').addEventListener('change', renderMenu);
        document.getElementById('sortSelect').addEventListener('change', renderMenu);
        // Start order dialogue button (only if modal not present)
        const startOrderBtn = document.getElementById('startOrderBtn');
        const hasModal = !!document.getElementById('orderModal');
        if (startOrderBtn && !hasModal) {
            startOrderBtn.addEventListener('click', function() {
                document.getElementById('orderForm').style.display = 'block';
                startOrderBtn.style.display = 'none';
            });
        }
        // Initialize cart display
        updateCartDisplay();
        // Set up order form submission
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', handleOrderSubmission);
        }
        // Update checkout button state
        updateCheckoutButton();
    }
}

function renderMenu() {
    const category = document.getElementById('categorySelect').value;
    const sort = document.getElementById('sortSelect').value;
    let items = [...menuData[category]];
    // Sorting
    if (sort === 'name') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'price') {
        items.sort((a, b) => a.price - b.price);
    } else if (sort === 'calories') {
        items.sort((a, b) => a.calories - b.calories);
    }
    // Render items
    const menuItemsDiv = document.getElementById('menuItems');
    menuItemsDiv.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.ingredients}</p>
                <span class="item-calories">${item.calories} cal</span>
            </div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <div class="item-action">
                <input type="number" min="1" max="99" value="1" class="quantity-input" id="qty-${category}-${item.name.replace(/\s/g,'')}">
                <button class="add-btn" onclick="addVariableToCart('${item.name}', ${item.price}, ${item.calories}, '${item.ingredients}', '${category}')">Add</button>
            </div>
        `;
        menuItemsDiv.appendChild(itemDiv);
    });
}

// Add variable number of items to cart
function addVariableToCart(name, price, calories, ingredients, category) {
    const qtyInput = document.getElementById(`qty-${category}-${name.replace(/\s/g,'')}`);
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: qty,
            calories: calories,
            ingredients: ingredients
        });
    }
    updateCartDisplay();
    updateCheckoutButton();
    showAddToCartFeedback(name + (qty > 1 ? ` x${qty}` : ''));
}

/**
 * Add item to cart
 * @param {string} name - Pizza name
 * @param {number} price - Pizza price
 */
function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCheckoutButton();
    
    // Show visual feedback
    showAddToCartFeedback(name);
}

/**
 * Remove item from cart
 * @param {string} name - Pizza name to remove
 */
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    updateCheckoutButton();
}

/**
 * Update item quantity in cart
 * @param {string} name - Pizza name
 * @param {number} change - Change in quantity (+1 or -1)
 */
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartDisplay();
            updateCheckoutButton();
        }
    }
}

/**
 * Update cart display
 */
function updateCartDisplay() {
    const cartElement = document.getElementById('cart');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const startOrderBtn = document.getElementById('startOrderBtn');
    if (!cartElement) return;
    if (cart.length === 0) {
        cartElement.innerHTML = '<div class="empty-cart"><p>Your basket is empty. Add some delicious pizzas!</p></div>';
        cartTotal = 0;
    } else {
        let cartHTML = '';
        cartTotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            cartHTML += `
                <div class="cart-item">
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-info">${item.ingredients || ''} ${item.calories ? `| <span class="item-calories">${item.calories} cal</span>` : ''}</div>
                        <div class="item-controls">
                            <button class="qty-btn" onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">Remove</button>
                        </div>
                    </div>
                    <div class="item-total">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });
        cartElement.innerHTML = cartHTML;
    }
    if (subtotalElement) subtotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    const finalTotal = cart.length > 0 ? cartTotal + deliveryFee : 0;
    if (totalElement) totalElement.textContent = `$${finalTotal.toFixed(2)}`;

    if (startOrderBtn) {
        startOrderBtn.disabled = cart.length === 0;
        startOrderBtn.title = cart.length === 0 ? 'Add items to your basket to continue' : '';
    }

    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch(_) {}
}

/**
 * Update checkout button state
 */
function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.textContent = cart.length === 0 ? 'Add Items to Order' : 'Place Order';
    }
}

/**
 * Show visual feedback when adding to cart
 * @param {string} itemName - Name of the added item
 */
function showAddToCartFeedback(itemName) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.textContent = `${itemName} added to cart!`;
    document.body.appendChild(feedback);
    setTimeout(() => { if (feedback.parentNode) feedback.parentNode.removeChild(feedback); }, 2000);
}

/**
 * Handle order form submission
 * @param {Event} e - Form submission event
 */
function handleOrderSubmission(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Please add items to your cart before placing an order.');
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            name: formData.get('customerName'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            notes: formData.get('notes')
        },
        items: cart,
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        total: cartTotal + deliveryFee,
        orderTime: new Date().toISOString()
    };
    
    // Simulate order processing
    processOrder(orderData);
}

/**
 * Process the order (simulation)
 * @param {Object} orderData - Order information
 */
function processOrder(orderData) {
    // Show loading state
    const checkoutBtn = document.getElementById('checkoutBtn');
    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Show success message
        showOrderConfirmation(orderData);
        
        // Reset form and cart
        document.getElementById('orderForm').reset();
        cart = [];
        updateCartDisplay();
        updateCheckoutButton();
        
        // Reset button
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }, 2000);
}

/**
 * Show order confirmation
 * @param {Object} orderData - Order information
 */
function showOrderConfirmation(orderData) {
    const orderNumber = Math.floor(Math.random() * 10000) + 1000;
    
    alert(`🍕 Order Confirmed! 🍕\n\nOrder #${orderNumber}\nTotal: $${orderData.total.toFixed(2)}\n\nEstimated delivery time: 30-45 minutes\n\nThank you for choosing Tony's Pizza!`);
}

// ===================================
// MODAL DIALOGUE FOR ORDER
// ===================================
function setupOrderModal() {
    const startOrderBtn = document.getElementById('startOrderBtn');
    const modal = document.getElementById('orderModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const continueModalBtn = document.getElementById('continueModalBtn');
    const modalContactForm = document.getElementById('modalContactForm');
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmBtn = document.getElementById('closeConfirmBtn');
    const closeBasketBtn = document.getElementById('closeBasketBtn');
    const backToContactBtn = document.getElementById('backToContactBtn');
    const confirmOrderDetails = document.getElementById('confirmOrderDetails');
    if (!modal) return;

    let lastFocusedElement = null;

    function trapFocus(container, e) {
        const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        } else if (e.key === 'Escape') {
            // close whichever modal is open
            if (container.parentElement && container.parentElement.id === 'orderModal') {
                closeModal();
            } else if (container.parentElement && container.parentElement.id === 'confirmModal') {
                confirmModal.style.display = 'none';
                if (lastFocusedElement) lastFocusedElement.focus();
            }
        }
    }

    // Open modal
    if (startOrderBtn) {
        startOrderBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                // inline summary error near cart total
                const cartDiv = document.querySelector('.cart-total');
                if (cartDiv && !document.getElementById('cart-summary-error')) {
                    const warn = document.createElement('div');
                    warn.id = 'cart-summary-error';
                    warn.className = 'form-error-summary';
                    warn.setAttribute('role', 'alert');
                    warn.textContent = 'Please add items to your cart before continuing.';
                    cartDiv.parentElement.insertBefore(warn, cartDiv);
                }
                return;
            }
            // remove any previous summary error
            const prev = document.getElementById('cart-summary-error');
            if (prev) prev.remove();
            lastFocusedElement = document.activeElement;
            modal.style.display = 'flex';
            const firstField = document.getElementById('modalName');
            if (firstField) firstField.focus();
        });
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        modalContactForm.reset();
        if (lastFocusedElement) lastFocusedElement.focus();
    }
    if (closeModalBtn) closeModalBtn.onclick = closeModal;
    if (cancelModalBtn) cancelModalBtn.onclick = closeModal;

    // Keyboard trap
    modal.addEventListener('keydown', (e) => trapFocus(modal.querySelector('.modal-content'), e));

    // Continue to next step
    if (continueModalBtn) {
        continueModalBtn.onclick = function() {
            // clear any previous errors
            ['modalName','modalPhone','modalAddress'].forEach(id => { const el = document.getElementById(id); if (el) clearError(el); });
            if (!validateModalFields()) {
                return;
            }
            const name = document.getElementById('modalName').value.trim();
            const phone = document.getElementById('modalPhone').value.trim();
            const address = document.getElementById('modalAddress').value.trim();
            closeModal();
            document.getElementById('orderForm').style.display = 'block';
            document.getElementById('customerName').value = name;
            document.getElementById('phone').value = phone;
            document.getElementById('address').value = address;
            document.getElementById('notes').focus();
            showConfirmModal({ name, phone, address, total: cartTotal + deliveryFee, items: cart });
        };
    }

    function showConfirmModal(details) {
        let html = `<p><strong>Order Confirmed!</strong></p>`;
        html += `<p><strong>Total:</strong> $${details.total.toFixed(2)}</p>`;
        html += `<p><strong>Contact Details:</strong><br>Name: ${details.name}<br>Phone: ${details.phone}<br>Address: ${details.address}</p>`;
        html += `<p><strong>Items:</strong></p><ul>`;
        details.items.forEach(item => {
            html += `<li>${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})</li>`;
        });
        html += `</ul>`;
        confirmOrderDetails.innerHTML = html;
        confirmModal.style.display = 'flex';
        const firstBtn = confirmModal.querySelector('.continue-btn') || confirmModal.querySelector('button');
        if (firstBtn) firstBtn.focus();
    }

    if (closeBasketBtn) closeBasketBtn.onclick = function() {
        confirmModal.style.display = 'none';
        cart = [];
        updateCartDisplay();
        try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch(_) {}
        document.getElementById('orderForm').reset();
        document.getElementById('orderForm').style.display = 'none';
        const startBtn = document.getElementById('startOrderBtn');
        if (startBtn) startBtn.style.display = 'block';
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    if (backToContactBtn) backToContactBtn.onclick = function() {
        confirmModal.style.display = 'none';
        document.getElementById('orderModal').style.display = 'flex';
        const firstField = document.getElementById('modalName');
        if (firstField) firstField.focus();
    };

    if (closeConfirmBtn) closeConfirmBtn.onclick = function() {
        confirmModal.style.display = 'none';
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
}

// ===================================
// CONTACT PAGE FUNCTIONALITY
// ===================================

/**
 * Initialize contact page functionality
 */
function initializeContactPage() {
    if (window.location.pathname.includes('contact.html') || 
        window.location.pathname.endsWith('contact.html')) {
        
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmission);
        }
    }
}

/**
 * Handle contact form submission
 * @param {Event} e - Form submission event
 */
function handleContactSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phoneContact'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Validate required fields
    if (!contactData.firstName || !contactData.lastName || 
        !contactData.email || !contactData.subject || !contactData.message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Simulate form processing
    processContactForm(contactData);
}

/**
 * Process contact form submission (simulation)
 * @param {Object} contactData - Contact form data
 */
function processContactForm(contactData) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Hide form and show success message
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        
        // Reset button (in case user wants to submit another message)
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Scroll to success message
        document.getElementById('formSuccess').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 1500);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Inline error helpers
function showError(input, message) {
    clearError(input);
    input.classList.add('input-invalid');
    const err = document.createElement('div');
    err.className = 'error-text';
    err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', input.id + '-error');
    err.id = input.id + '-error';
    input.parentElement.appendChild(err);
}
function clearError(input) {
    input.classList.remove('input-invalid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    const existing = document.getElementById(input.id + '-error');
    if (existing) existing.remove();
}

// Simple phone mask and normalization (digits and leading +)
function setupPhoneMask(el) {
    if (!el) return;
    el.addEventListener('input', () => {
        const start = el.selectionStart;
        let v = el.value.replace(/[^\d+\s()-]/g, '');
        // ensure only one leading +
        v = v.replace(/(?!^)[+]/g, '');
        el.value = v;
        el.setSelectionRange(start, start);
    });
}

// Enhance modal and order form validation
function setupInlineValidation() {
    const modalForm = document.getElementById('modalContactForm');
    if (modalForm) {
        const name = document.getElementById('modalName');
        const phone = document.getElementById('modalPhone');
        const address = document.getElementById('modalAddress');
        [name, phone, address].forEach(i => i && i.addEventListener('input', () => clearError(i)));
        setupPhoneMask(phone);
    }
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        const name = document.getElementById('customerName');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');
        [name, phone, address].forEach(i => i && i.addEventListener('input', () => clearError(i)));
        setupPhoneMask(phone);
    }
}

// Validate modal fields, show inline errors
function validateModalFields() {
    const name = document.getElementById('modalName');
    const phone = document.getElementById('modalPhone');
    const address = document.getElementById('modalAddress');
    let ok = true;
    if (!name.value.trim()) { showError(name, 'Please enter your full name.'); ok = false; }
    if (!phone.value.trim() || !validatePhone(phone.value.trim())) { showError(phone, 'Enter a valid phone number (e.g. +441234567890).'); ok = false; }
    if (!address.value.trim()) { showError(address, 'Please enter your delivery address.'); ok = false; }
    return ok;
}

// ===================================
// CSS ANIMATIONS (for feedback elements)
// ===================================

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// ERROR HANDLING
// ===================================

/**
 * Global error handler for unhandled errors
 */
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // Could send error reports to monitoring service in production
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
