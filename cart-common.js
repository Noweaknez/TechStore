<!-- Увери се, че това е съдържанието на cart-common.js -->
<script>
// cart-common.js (v2) – работи само с data-id и чете детайли от products.json
document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "techstore_cart";

  // правилен път за GitHub Pages/локално
  const JSON_URL = location.hostname.endsWith("github.io")
    ? "/TechStore/products.json"
    : "./products.json";

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  function unitPriceOf(prod) {
    const oldP = Number(prod.oldPrice ?? 0);
    const newP = Number(prod.newPrice ?? 0);
    if (prod.isPromo && newP && newP !== oldP) return newP;
    return oldP || newP || 0;
  }

  function updateCartCountBadge() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;
    const totalQty = getCart().reduce((s, it) => s + (Number(it.qty) || 0), 0);
    badge.textContent = totalQty || "";
  }

  function addToCartById(productId) {
    fetch(JSON_URL, { cache: "no-store" })
      .then(r => r.json())
      .then(list => {
        const prod = (Array.isArray(list) ? list : [])
          .find(p => String(p.id) === String(productId));
        if (!prod) {
          alert("Продуктът не е намерен.");
          return;
        }

        const cart = getCart();
        const found = cart.find(i => String(i.id) === String(prod.id));
        if (found) {
          found.qty = (Number(found.qty) || 0) + 1;
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
      .catch(() => alert("Проблем при добавяне в кошницата."));
  }

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute("data-id");
    if (!id) {
      alert("Липсва data-id на бутона.");
      return;
    }
    addToCartById(id);
  });

  updateCartCountBadge();
});
</script>
