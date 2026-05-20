const staticShopProducts = {
  5: {
    id: 5,
    name: "Black Hoodie",
    price: 3999,
    oldPrice: 7999,
    category: "hoodie",
    sale: true,
    image: "assets/images/item5.png"
  },
  6: {
    id: 6,
    name: "Brown Hoodie",
    price: 2999,
    oldPrice: 5999,
    category: "hoodie",
    sale: true,
    image: "assets/images/item6.png"
  }
};

let allProducts = [
  {
    id: 1,
    name: "Minimal Black Hoodie",
    price: 2999,
    oldPrice: 4999,
    category: "hoodie",
    sale: true,
    image: "assets/images/item1.png"
  },
  {
    id: 2,
    name: "luxury jersey",
    price: 5999,
    oldPrice: 8999,
    category: "jersey",
    sale: true,
    image: "assets/images/item2.png"
  },
  {
    id: 3,
    name: "Premium Grey jersey",
    price: 7999,
    oldPrice: 11999,
    category: "jersey",
    sale: false,
    image: "assets/images/item3.png"
  },
  {
    id: 4,
    name: "classic jersey",
    price: 6499,
    oldPrice: 9999,
    category: "jersey",
    sale: true,
    image: "assets/images/item4.png"
  },
  staticShopProducts[5],
  staticShopProducts[6]
];

const productsContainer = document.getElementById("shopProducts");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

function addShopProductToCart(product) {
  if (typeof window.addToCart === "function") {
    window.addToCart(product);
    return;
  }

  document.addEventListener(
    "cart:ready",
    () => window.addToCart(product),
    { once: true }
  );
}

function bindProductCard(card, product) {
  const cartBtn = card.querySelector(".shop-cart-btn");
  const quickViewBtn = card.querySelector(".quick-view");

  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      addShopProductToCart(product);
    });
  }

  if (quickViewBtn) {
    quickViewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `product.html?id=${product.id}`;
    });
  }
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.productId = String(product.id);
  card.dataset.category = product.category;
  card.dataset.name = product.name.toLowerCase();

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
      ${product.sale ? '<span class="sale-badge">SALE</span>' : ""}
      <button class="quick-view" type="button" data-product-id="${product.id}">Quick View</button>
    </div>

    <div class="product-info">
      <h3>${product.name}</h3>

      <div class="price-box">
        <span class="new-price">Rs.${product.price}</span>
        <span class="old-price">Rs.${product.oldPrice}</span>
      </div>

      <button class="shop-cart-btn" type="button">
        <img class="add-cart-icon" src="assets/images/online-shopping.png" alt="">
        Add To Cart
      </button>
    </div>
  `;

  bindProductCard(card, product);
  return card;
}

function getStaticCards() {
  if (!productsContainer) {
    return [];
  }

  return [...productsContainer.querySelectorAll('[data-static-product="true"]')].map(card => ({
    id: Number(card.dataset.productId),
    clone: card.cloneNode(true)
  }));
}

function renderProducts(products) {
  if (!productsContainer) {
    return;
  }

  const staticCards = getStaticCards();
  const staticIds = new Set(staticCards.map(card => card.id));

  productsContainer.innerHTML = "";

  products.forEach(product => {
    if (staticIds.has(Number(product.id))) {
      return;
    }

    productsContainer.appendChild(createProductCard(product));
  });

  staticCards.forEach(({ id, clone }) => {
    if (!products.some(product => Number(product.id) === id)) {
      return;
    }

    const product = staticShopProducts[id];

    if (!product) {
      return;
    }

    productsContainer.appendChild(clone);
    bindProductCard(clone, product);
  });
}

function filterProducts() {
  let filtered = [...allProducts];

  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const sortValue = sortFilter.value;

  filtered = filtered.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  );

  if (categoryValue !== "all") {
    filtered = filtered.filter(product =>
      product.category === categoryValue
    );
  }

  if (sortValue === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

function ensureStaticProductsInCatalog() {
  Object.values(staticShopProducts).forEach(product => {
    if (!allProducts.some(item => Number(item.id) === product.id)) {
      allProducts.push(product);
    }
  });
}

if (productsContainer) {
  ensureStaticProductsInCatalog();
  renderProducts(allProducts);

  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
  sortFilter.addEventListener("change", filterProducts);
}

fetch("./assets/data/product.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("Product data could not be loaded");
    }

    return res.json();
  })
  .then(data => {
    allProducts = data;
    ensureStaticProductsInCatalog();
    filterProducts();
  })
  .catch(error => {
    console.log("Shop Products JSON Error:", error);
    ensureStaticProductsInCatalog();
    filterProducts();
  });
