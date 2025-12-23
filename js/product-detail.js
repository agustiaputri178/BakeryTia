// ================= PRODUCT DETAIL =================
let quantity = 1;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    if (!id) {
        window.location.href = "products.html";
        return;
    }

    const product = products.find(p => p.id === id);
    if (!product) {
        window.location.href = "products.html";
        return;
    }

    renderProductDetail(product);
});

// ================= RENDER DETAIL =================
function renderProductDetail(product) {
    const container = document.getElementById("product-detail");
    if (!container) return;

    document.title = `${product.name} - Bakery Tia`;

    container.innerHTML = `
        <div class="product-detail-layout">

            <div class="product-gallery">
                <img src="images/products/${product.image}" 
                     alt="${product.name}" class="main-image">
            </div>

            <div class="product-info-detail">
                <h1>${product.name}</h1>

                <div class="product-rating">
                    ${getStarRating(product.rating || 5)}
                    <span>(${product.rating || 5})</span>
                </div>

                <p class="price">
                    Rp ${product.price.toLocaleString("id-ID")}
                </p>

                <p class="desc">
                    Produk bakery fresh, dibuat setiap hari dengan bahan berkualitas.
                </p>

                <div class="qty">
                    <button onclick="changeQty(-1)">-</button>
                    <span id="qty-value">1</span>
                    <button onclick="changeQty(1)">+</button>
                </div>

                <button class="btn-cart" onclick="addToCartDetail(${product.id})">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>

        </div>
    `;
}

// ================= QTY =================
function changeQty(val) {
    quantity += val;
    if (quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10;
    document.getElementById("qty-value").textContent = quantity;
}

// ================= ADD TO CART (FIX) =================
function addToCartDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => i.id === id);

    if (item) {
        item.qty += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔥 INI YANG PENTING
    window.dispatchEvent(new Event("cartUpdated"));
}

// ================= STAR =================
function getStarRating(rating) {
    let stars = "";
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) stars += "★";
    if (half) stars += "½";
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) stars += "☆";

    return stars;
}
