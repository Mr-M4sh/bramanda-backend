// ===========================
// BRAMANDA - MAIN JAVASCRIPT
// Cart & Checkout System
// ===========================

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('bramanda_cart')) || [];

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setCurrentYear();
});

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
    updateCartDisplay();
}

// Add item to cart
function addToCart(productName, price) {
    cart.push({
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    });
    
    // Save to localStorage
    localStorage.setItem('bramanda_cart', JSON.stringify(cart));
    
    // Show feedback
    showNotification(`✓ ${productName} added to cart!`);
    
    updateCartCount();
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('bramanda_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const orderSummary = document.getElementById('order-summary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center;'>Your cart is empty</p>';
        cartTotal.textContent = '₹0.00';
        if (orderSummary) {
            orderSummary.innerHTML = '<strong>No items</strong>';
        }
        return;
    }
    
    let html = '';
    let total = 0;
    let summary = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">Qty: ${item.quantity}</div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4500; cursor: pointer; font-size: 1.2rem;">✕</button>
                </div>
                <div class="cart-item-price">₹${itemTotal.toFixed(2)}</div>
            </div>
        `;
        
        summary += `${item.name} x${item.quantity} = ₹${itemTotal.toFixed(2)} | `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotal.textContent = '₹' + total.toFixed(2);
    
    if (orderSummary) {
        orderSummary.innerHTML = '<strong>' + summary.slice(0, -3) + '</strong><br>Total: <strong>₹' + total.toFixed(2) + '</strong>';
    }
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Open checkout modal
function openCheckout() {
    if (cart.length === 0) {
        showNotification('⚠ Add items to your cart first!', 'warning');
        return;
    }
    document.getElementById('checkout-modal').classList.add('active');
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
}

// Submit order - sends to Google Sheets via webhook
function submitOrder(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        payment: document.getElementById('payment').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Send to Google Sheets via webhook
    // You'll need to set up a Google Forms or Apps Script endpoint
    sendToGoogleSheets(formData);
    
    // Show success message
    showNotification('✓ Order submitted! Check your email for confirmation.', 'success');
    
    // Clear cart
    cart = [];
    localStorage.setItem('bramanda_cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Reset form
    document.getElementById('checkout-form').reset();
    
    // Close modal
    setTimeout(() => {
        closeCheckout();
    }, 1000);
}

// Send order to MySQL Database via PHP backend
function sendToGoogleSheets(orderData) {
    // Save to localStorage as backup (always do this)
    if (BRAMANDA_CONFIG.features.useLocalStorageBackup) {
        let orders = JSON.parse(localStorage.getItem('bramanda_orders')) || [];
        orders.push(orderData);
        localStorage.setItem('bramanda_orders', JSON.stringify(orders));
        bramandaLog('Order saved to localStorage backup', { count: orders.length });
    }
    
    // If MySQL backend is disabled, just use localStorage
    if (!BRAMANDA_CONFIG.features.useMysqlBackend) {
        bramandaLog('MySQL backend disabled. Using localStorage only.');
        showNotification('✓ Order saved locally. Database backup mode.', 'success');
        return;
    }
    
    // Send to MySQL Database via PHP
    const submitOrderUrl = getBackendUrl('orders.php?action=submit_order');
    bramandaLog('Submitting order to:', submitOrderUrl);
    
    fetch(submitOrderUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            bramandaLog('✓ Order submitted to database', { orderId: data.order_id });
            showNotification(`✓ Order confirmed! ID: ${data.order_id}`, 'success');
        } else {
            bramandaLog('✗ Database error', data.error);
            showNotification(`⚠ Database error: ${data.error}`, 'warning');
        }
    })
    .catch(error => {
        bramandaLog('✗ Network error sending to database', error.message);
        showNotification('⚠ Connection error. Order saved locally.', 'warning');
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#ff4500' : '#ffff00'};
        color: ${type === 'success' ? '#fff' : '#000'};
        padding: 1.5rem 2rem;
        border-radius: 0;
        border: 2px solid ${type === 'success' ? '#ff6600' : '#ff4500'};
        font-weight: 900;
        font-size: 0.9rem;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animations for notifications
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartSidebar && !cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
        if (cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    }
});

// Close checkout modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('checkout-modal');
    const checkoutContent = document.querySelector('.checkout-content');
    
    if (modal && e.target === modal && checkoutContent && !checkoutContent.contains(e.target)) {
        closeCheckout();
    }
});

// Escape key closes modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('cart-sidebar')?.classList.remove('active');
        document.getElementById('checkout-modal')?.classList.remove('active');
    }
});
