(function () {
  const { getCart, saveCart, updateBadge } = window.__cartApi || {};

  function money(x){ return `${x.toFixed(2)} лв.`; }

  function render() {
    const wrap = document.getElementById("cartWrap");
    const cart = getCart();

    if (!cart.length) {
      wrap.innerHTML = `<p>Кошницата е празна.</p>`;
      updateBadge();
      return;
    }

    const rows = cart.map((it, i) => `
      <tr>
        <td><img src="${it.image || ''}" alt="" width="60"></td>
        <td>${it.name}</td>
        <td>${money(it.price)}</td>
        <td>
          <button class="qty-dec" data-i="${i}">–</button>
          <input type="number" min="1" value="${it.qty || 1}" data-i="${i}" class="qty-input">
          <button class="qty-inc" data-i="${i}">+</button>
        </td>
        <td>${money((it.qty || 1) * it.price)}</td>
        <td><button class="remove" data-i="${i}">✖</button></td>
      </tr>
    `).join("");

    const total = cart.reduce((s, it) => s + (it.qty || 1) * it.price, 0);

    wrap.innerHTML = `
      <table class="cart">
        <thead>
          <tr>
            <th></th><th>Продукт</th><th>Цена</th>
            <th>Кол-во</th><th>Сума</th><th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align:right"><strong>Общо:</strong></td>
            <td><strong>${money(total)}</strong></td>
            <td>
              <button id="clearCart">Изчисти</button>
            </td>
          </tr>
        </tfoot>
      </table>
    `;


    wrap.querySelectorAll(".qty-inc").forEach(b => b.onclick = () => {
      const i = +b.dataset.i; cart[i].qty++; saveCart(cart); render();
    });
    wrap.querySelectorAll(".qty-dec").forEach(b => b.onclick = () => {
      const i = +b.dataset.i; cart[i].qty = Math.max(1, (cart[i].qty||1)-1); saveCart(cart); render();
    });
    wrap.querySelectorAll(".qty-input").forEach(inp => inp.onchange = () => {
      const i = +inp.dataset.i; cart[i].qty = Math.max(1, +inp.value || 1); saveCart(cart); render();
    });
    wrap.querySelectorAll(".remove").forEach(b => b.onclick = () => {
      const i = +b.dataset.i; cart.splice(i,1); saveCart(cart); render();
    });
    const clr = document.getElementById("clearCart");
    if (clr) clr.onclick = () => { saveCart([]); render(); };

    updateBadge();
  }

  document.addEventListener("DOMContentLoaded", render);
})();

