/* ==========================
   CART GLOBAL (HEADER)
========================== */

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartCount() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    document.querySelectorAll('.cart-count').forEach(badge => {
        badge.innerText = totalQty;
        badge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    });
}

// Auto update saat halaman dibuka
document.addEventListener('DOMContentLoaded', updateCartCount);
<script src="js/cart-global.js"></script>
