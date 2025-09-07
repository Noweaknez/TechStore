document.addEventListener("DOMContentLoaded", () => {
  console.log("cart-common.js loaded"); // ще видиш това в Console, за да сме сигурни, че се зарежда

  const CART_KEY = "techstore_cart";

  const JSON_URL = location.hostname.endsWith("github.io")
    ? "/TechStore/products.json"
    : "./products.json";

  const getCart  = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  function unitPriceOf(prod) {
    const hasPromo = !!prod.isPromo;
    const oldP = Number(prod.oldPrice ?? 0);
    const newP = Number(prod.newPrice ?? 0);
    if (hasPromo && newP && newP !== oldP) return newP;
    return oldP || newP || 0;
  }

  function updateCartCountBadge() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;
    const totalQty = getCart().reduce((s, it) => s + (it.qty || 0), 0);
    badge.textContent = totalQty || "";
  }

  // Глобална функция, достъпна от HTML: onclick="addToCart('cpu1')"
  window.addToCart = function(productId) {
    if (!productId) {
      alert("Липсва id на продукта.");
      return;
    }
    fetch(JSON_URL, { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(list => {
        const prod = (Array.isArray(list) ? list : []).find(p => String(p.id) === String(productId));
        if (!prod) return alert("Продуктът не е намерен: " + productId);

        const cart = getCart();
        const found = cart.find(i => i.id === prod.id);
        if (found) {
          found.qty += 1;
        } else {
          cart.push({
            id: prod.id,
            name: prod.name,
            image: prod.image,
            price: unitPriceOf(prod),
            qty: 1
          });
        }
        saveCart(cart);
        updateCartCountBadge();
        alert("Добавено в кошницата: " + prod.name);
      })
      .catch(err => {
        console.error(err);
        alert("Проблем при добавяне в кошницата.");
      });
  };

  // по желание: запазваме и делегиран клик по .add-to-cart
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute("data-id");
    if (id) window.addToCart(id);
  });

  updateCartCountBadge();
});
