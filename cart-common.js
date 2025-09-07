// cart-common.js
(function () {
  const LS_KEY = "cart"; // localStorage key

  function getCart() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }
  function cartCount() {
    return getCart().reduce((s, it) => s + (it.qty || 1), 0);
  }
  function updateBadge() {
    const el = document.getElementById("cartCount");
    if (el) el.textContent = cartCount() ? `(${cartCount()})` : "";
  }
  function addToCart(item) {
    const cart = getCart();
    const idx = cart.findIndex(x => String(x.id) === String(item.id));
    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty || 1) + (item.qty || 1);
    } else {
      item.qty = item.qty || 1;
      cart.push(item);
    }
    saveCart(cart);
    updateBadge();
  }

  // Закачи всички бутони .btn-add (и .add-to-cart за всеки случай)
  function wireButtons() {
    document.querySelectorAll(".btn-add, .add-to-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const d = btn.dataset;
        const price = Number(d.price);   // ВАЖНО: само число в data-price
        if (!d.id || !d.name || !price) {
          alert("Липсва id/name/price на бутона.");
          return;
        }
        addToCart({
          id: d.id,
          name: d.name,
          price: price,
          image: d.image || ""
        });
        // малък фийдбек
        btn.textContent = "Добавено ✓";
        setTimeout(() => (btn.textContent = "Добави"), 900);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireButtons();
    updateBadge();
  });

  // достъпно за други скриптове (напр. cart.js)
  window.__cartApi = { getCart, saveCart, updateBadge };
})();
