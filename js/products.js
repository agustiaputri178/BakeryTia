// ================= PRODUCTS DATA =================
const products = [
    { id: 1, name: "Croissant Butter", price: 15000, image: "croissant.jpg", popular: true },
    { id: 2, name: "Roti Tawar", price: 25000, image: "roti-tawar.jpg", popular: true },
    { id: 3, name: "Donat Coklat", price: 8000, image: "donut.jpg", popular: true },
    { id: 4, name: "Pizza Mini", price: 20000, image: "pizza.jpg", popular: false },
    { id: 5, name: "Cheesecake", price: 35000, image: "cheesecake.jpg", popular: true }
];

// ================= DISPLAY POPULAR =================
function displayPopularProducts() {
    const container = document.getElementById("popular-products");
    if (!container) return;

    container.innerHTML = "";

    products
        .filter(p => p.popular)
        .slice(0, 4)
        .forEach(product => {
            container.innerHTML += `
                <div class="product-card">
                    <div class="product-img">
                        <img src="images/products/${product.image}" alt="${product.name}">
                    </div>

                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-price">Rp ${product.price.toLocaleString("id-ID")}</p>
                </div>
            `;
        });
}

// ================= ADD TO CART =================
function addToCart(id) {
    // 🔥 SELALU AMBIL TERBARU
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = products.find(p => p.id === id);
    if (!product) return;

    const item = cart.find(i => i.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔥 UPDATE HEADER REALTIME
    window.dispatchEvent(new Event("cartUpdated"));
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", displayPopularProducts);
