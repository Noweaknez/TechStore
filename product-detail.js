const JSON_URL = location.hostname.endsWith("github.io")
  ? "/TechStore/products.json"  // абсолютен път за Pages
  : "./products.json";          // локално (python http.server / Live Server)

fetch(JSON_URL, { cache: "no-store" })
  .then((res) => {
    if (!res.ok) {
      throw new Error("HTTP " + res.status + " loading " + JSON_URL);
    }
    return res.json();
  })
  .then((data) => {
    const product = (Array.isArray(data) ? data : []).find(
      (p) => String(p.id) === String(id)
    );

    if (!product) {
      $("#productDetails").innerHTML = "<p>Продуктът не е намерен.</p>";
      document.title = "Продуктът не е намерен | TechStoreX";
      return;
    }

    const catPage = categoryToPage[product.category] || "Products.html";
    $("#breadcrumbs").innerHTML = `
      <a href="index.html">Начало</a> &rsaquo;
      <a href="${catPage}">${product.category}</a> &rsaquo;
      <span>${product.name}</span>
    `;

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
    let priceHtml = "";

    if (product.isPromo && oldPrice && newPrice && oldPrice !== newPrice) {
      priceHtml = `
        <span class="old-price">${oldPrice} лв.</span>
        <span class="new-price">${newPrice} лв.</span>
        <span class="badge">Промо</span>
      `;
    } else {
      const shown = (newPrice ?? oldPrice);
      priceHtml = `<span class="new-price">${shown} лв.</span>`;
    }

    $("#productDetails").innerHTML = `
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
            <a class="btn" href="#">Купи</a>
            <a class="btn" href="${catPage}" style="background:#475569">← Назад към категорията</a>
          </div>
        </div>
      </div>
    `;
  })
  .catch((e) => {
    console.error(e);
    $("#productDetails").innerHTML =
      "<p>Възникна проблем при зареждане на продукта.</p>";
  });