// ================= CART COUNT =================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = total;
    });
}

// 🔥 DENGARKAN PERUBAHAN CART TANPA REFRESH
window.addEventListener("cartUpdated", updateCartCount);

// ================= INIT =================
document.addEventListener("DOMContentLoaded", updateCartCount);
