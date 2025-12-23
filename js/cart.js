document.addEventListener("DOMContentLoaded", () => {

  const cartContainer = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const cartCountEl = document.getElementById("cart-count");

  const ONGKIR = 10000;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function formatRupiah(num) {
    return "Rp " + num.toLocaleString("id-ID");
  }

  function updateCartCount() {
    if (!cartCountEl) return;
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalQty;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Keranjang masih kosong</p>";
      subtotalEl.textContent = formatRupiah(0);
      totalEl.textContent = formatRupiah(0);
      saveCart();
      return;
    }

    cart.forEach((item, index) => {
      if (!item.qty || item.qty < 1) item.qty = 1;

      const totalItem = item.price * item.qty;
      subtotal += totalItem;

      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="images/products/${item.image}" alt="${item.name}">

          <div class="info">
            <h4>${item.name}</h4>
            <p class="item-price">${formatRupiah(item.price)}</p>

            <div class="qty">
              <button onclick="changeQty(${index}, -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${index}, 1)">+</button>
            </div>

            <button class="remove" onclick="removeItem(${index})">
              <i class="fas fa-trash"></i> Hapus
            </button>
          </div>

          <div class="item-total">
            ${formatRupiah(totalItem)}
          </div>
        </div>
      `;
    });

    subtotalEl.textContent = formatRupiah(subtotal);
    totalEl.textContent = formatRupiah(subtotal + ONGKIR);

    saveCart();
  }

  // GLOBAL supaya bisa dipakai onclick
  window.changeQty = function(index, value) {
    cart[index].qty += value;
    if (cart[index].qty < 1) cart[index].qty = 1;
    renderCart();
  };

  window.removeItem = function(index) {
    cart.splice(index, 1);
    renderCart();
  };

  renderCart();
});
