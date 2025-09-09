
document.addEventListener("DOMContentLoaded", function () {
  const productEl = document.getElementById("productDetails");
  const crumbsEl  = document.getElementById("breadcrumbs");

  const params = new URLSearchParams(location.search);
  const productId = params.get("id"); // избягваме името 'id'

  const categoryToPage = {
    "Геймърски компютри": "Category_pc.html",
    "Лаптопи": "Category_laptop.html",
    "Видео карти": "Category_video.html",
    "Монитори": "Category_monitor.html",
    "Процесори": "Category_cpu.html",
    "Дънни платки": "Category_motherboard.html",
    "Периферия": "Category_pheripheral.html",
    "Промоции": "Category_promo.html"
  };

  if (!productId) {
    productEl.innerHTML = "<p>Липсва параметър <code>id</code>.</p>";
    return;
  }
  const JSON_URL = location.hostname.endsWith("github.io")
    ? "/TechStore/products.json"
    : "./products.json";

  fetch(JSON_URL, { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status + " loading " + JSON_URL);
      return res.json();
    })
    .then(data => {
      const list = Array.isArray(data) ? data : [];
      const product = list.find(p => String(p.id) === String(productId));

      if (!product) {
        productEl.innerHTML = "<p>Продуктът не е намерен.</p>";
        document.title = "Продуктът не е намерен | TechStoreX";
        return;
      }

      const catPage = categoryToPage[product.category] || "Products.html";
      if (crumbsEl) {
        crumbsEl.innerHTML = `
          <a href="index.html">Начало</a> &rsaquo;
          <a href="${catPage}">${product.category}</a> &rsaquo;
          <span>${product.name}</span>
        `;
      }

      document.title = `${product.name} | TechStoreX`;

      const desc = product.description || {};
      const overview = typeof desc.overview === "string" ? desc.overview : "";

      const specItems = Object.entries(desc)
        .filter(([k]) => k !== "overview")
        .map(([k, v]) => {
          const key = k.charAt(0).toUpperCase() + k.slice(1);
          return `<li><strong>${key}:</strong> ${v}</li>`;
        })
        .join("");

      const oldPrice = product.oldPrice ?? product.newPrice;
      const newPrice = product.newPrice ?? product.oldPrice;
      const priceHtml = (product.isPromo && oldPrice && newPrice && oldPrice !== newPrice)
        ? `<span class="old-price">${oldPrice} лв.</span>
           <span class="new-price">${newPrice} лв.</span>
           <span class="badge">Промо</span>`
        : `<span class="new-price">${(newPrice ?? oldPrice)} лв.</span>`;

      productEl.innerHTML = `
        <div class="grid">
          <div>
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.onerror=null;this.src='images/placeholder.png'">
          </div>
          <div>
            <h1 id="pageTitle">${product.name}</h1>
            <p><em>${product.category}</em></p>
            <div class="price">${priceHtml}</div>
            ${overview ? `<p>${overview}</p>` : ""}
            ${specItems ? `<ul class="specs">${specItems}</ul>` : ""}

            <div style="margin-top:18px; display:flex; gap:10px;">  
            <button class="btn add-to-cart" data-id="${product.id}">Купи</button>
            <a class="btn" href="${catPage}" style="background:#475569">← Назад към категорията</a>
            </div>
          </div>
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      productEl.innerHTML = "<p>Възникна проблем при зареждане на продукта.</p>";
    });
});



