// Checkout Functions
function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('order-subtotal');
    const shippingElement = document.getElementById('order-shipping');
    const totalElement = document.getElementById('order-total');
    
    if (!orderItemsContainer || cart.length === 0) {
        // Redirect to cart if empty
        window.location.href = 'cart.html';
        return;
    }
    
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <span class="order-item-name">${item.name} × ${item.quantity}</span>
                <span class="order-item-price">Rp ${item.price.toLocaleString('id-ID')}</span>
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    updateOrderTotals();
}

// Update Order Totals
function updateOrderTotals() {
    const subtotalElement = document.getElementById('order-subtotal');
    const shippingElement = document.getElementById('order-shipping');
    const totalElement = document.getElementById('order-total');
    
    if (!subtotalElement) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= 100000 ? 0 : 10000;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    shippingElement.textContent = subtotal >= 100000 ? 'Gratis' : `Rp ${shipping.toLocaleString('id-ID')}`;
    totalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Process Order
function processOrder() {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form data
    const formData = {
        customer: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value
        },
        shipping: document.querySelector('input[name="shipping"]:checked').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('notes').value,
        items: [...cart],
        subtotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        shippingCost: 10000,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 10000,
        orderNumber: 'ORD' + Date.now(),
        orderDate: new Date().toLocaleString('id-ID')
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(formData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Redirect to confirmation page
    window.location.href = `order-confirmation.html?order=${formData.orderNumber}`;
}

// Shipping cost calculation
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.checkout-section')) {
        loadOrderSummary();
        updateCartCount();
        
        // Add shipping cost calculation when shipping method changes
        const shippingRadios = document.querySelectorAll('input[name="shipping"]');
        shippingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                updateShippingCost(this.value);
            });
        });
        
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }
});

function updateShippingCost(method) {
    const shippingElement = document.getElementById('order-shipping');
    const totalElement = document.getElementById('order-total');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    let shipping = 0;
    
    // Calculate shipping based on method
    switch (method) {
        case 'regular':
            shipping = subtotal >= 100000 ? 0 : 10000;
            break;
        case 'express':
            shipping = 25000;
            break;
        case 'same-day':
            shipping = 40000;
            break;
    }
    
    const total = subtotal + shipping;
    
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'Gratis' : `Rp ${shipping.toLocaleString('id-ID')}`;
    }
    
    if (totalElement) {
        totalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}