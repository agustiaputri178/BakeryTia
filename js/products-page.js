// ================================
// DATA PRODUK
// ================================
const products = [
    { id: 1, name: "Croissant", category: "pastry", price: 15000, rating: 4.8, image: "Croissant.jpg", popular: true },
    { id: 2, name: "Roti Tawar", category: "bread", price: 25000, rating: 4.5, image: "Roti-Tawar.jpg", popular: true },
    { id: 3, name: "Donat Coklat", category: "donut", price: 8000, rating: 4.9, image: "Donut.jpg", popular: true },
    { id: 4, name: "Pizza Mini", category: "pastry", price: 20000, rating: 4.7, image: "Pizza.jpg", popular: false },
    { id: 5, name: "Cheesecake", category: "cake", price: 35000, rating: 4.9, image: "Cheesecake.jpg", popular: true },
    { id: 6, name: "Bagel Blueberry", category: "bread", price: 12000, rating: 4.6, image: "Bagel-Blueberry.jpg", popular: false },
    { id: 7, name: "Brownies Coklat", category: "cake", price: 20000, rating: 4.8, image: "Brownies-Cokelat.jpg", popular: true },
    { id: 8, name: "Roti Bawang", category: "bread", price: 10000, rating: 4.4, image: "Bawang.jpg", popular: false }
];

let currentProducts = [...products];

// ================================
// CARD PRODUK
// ================================
function productCard(p) {
    return `
    <div class="product-card">
        <div class="product-img">
            <img src="images/products/${p.image}" 
                 onerror="this.src='images/products/default.jpg'">
            ${p.popular ? `<span class="popular-badge">Terlaris</span>` : ``}
        </div>

        <div class="product-info">
            <h3>${p.name}</h3>
            <p class="product-price">Rp ${p.price.toLocaleString('id-ID')}</p>
            <p class="product-rating">⭐ ${p.rating}</p>

            <a href="products-detail.html?id=${p.id}" class="btn-detail">
                Lihat Detail
            </a>
        </div>
    </div>`;
}

// ================================
// RENDER PRODUK
// ================================
function renderProducts(list) {
    const grid = document.getElementById("products-grid");
    const count = document.getElementById("products-count");

    if (!grid) return;

    grid.innerHTML = "";
    list.forEach(p => {
        grid.innerHTML += productCard(p);
    });

    if (count) {
        count.textContent = `${list.length} produk ditemukan`;
    }
}

// ================================
// SEARCH
// ================================
function searchProducts() {
    const keyword = document.getElementById("search-input").value.toLowerCase();

    currentProducts = products.filter(p =>
        p.name.toLowerCase().includes(keyword)
    );

    renderProducts(currentProducts);
}

// ================================
// FILTER KATEGORI + RATING + HARGA
// ================================
function filterProducts() {
    const checkedCategories = Array.from(
        document.querySelectorAll('.filter-options input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    const ratingValue = document.querySelector('input[name="rating"]:checked').value;
    const minPrice = parseInt(document.getElementById("price-min").value);
    const maxPrice = parseInt(document.getElementById("price-max").value);

    currentProducts = products.filter(p => {
        const categoryMatch = checkedCategories.includes(p.category);
        const ratingMatch = ratingValue === "all" || p.rating >= parseInt(ratingValue);
        const priceMatch = p.price >= minPrice && p.price <= maxPrice;
        return categoryMatch && ratingMatch && priceMatch;
    });

    renderProducts(currentProducts);
}

// ================================
// SORT
// ================================
function sortProducts() {
    const value = document.getElementById("sort-select").value;

    if (value === "price-low") {
        currentProducts.sort((a, b) => a.price - b.price);
    } else if (value === "price-high") {
        currentProducts.sort((a, b) => b.price - a.price);
    } else if (value === "rating") {
        currentProducts.sort((a, b) => b.rating - a.rating);
    } else if (value === "popular") {
        currentProducts.sort((a, b) => b.popular - a.popular);
    } else {
        currentProducts = [...products];
    }

    renderProducts(currentProducts);
}

// ================================
// RESET FILTER
// ================================
function resetFilters() {
    document.getElementById("search-input").value = "";

    document.querySelectorAll('.filter-options input').forEach(i => {
        i.checked = true;
    });

    document.getElementById("price-min").value = 0;
    document.getElementById("price-max").value = 100000;

    document.querySelector('input[name="rating"][value="all"]').checked = true;

    updatePriceRange();

    currentProducts = [...products];
    renderProducts(currentProducts);
}

// ================================
// UPDATE RANGE HARGA
// ================================
function updatePriceRange() {
    const min = document.getElementById("price-min").value;
    const max = document.getElementById("price-max").value;

    document.getElementById("min-price-label").textContent = `Rp ${Number(min).toLocaleString('id-ID')}`;
    document.getElementById("max-price-label").textContent = `Rp ${Number(max).toLocaleString('id-ID')}`;

    filterProducts();
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
});
