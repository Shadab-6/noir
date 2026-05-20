const fallbackProducts = [
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
  {
    id: 5,
    name: "Black Hoodie",
    price: 3999,
    oldPrice: 7999,
    category: "hoodie",
    sale: true,
    image: "assets/images/item5.png"
  },
  {
    id: 6,
    name: "Brown Hoodie",
    price: 2999,
    oldPrice: 5999,
    category: "hoodie",
    sale: true,
    image: "assets/images/item6.png"
  }
];

const productWrapper = document.getElementById("productWrapper");
const selectedProductId = Number(new URLSearchParams(window.location.search).get("id")) || 1;

function addProductToCart(product) {
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

function renderProduct(products) {
  const product = products.find(item => item.id === selectedProductId) || products[0];

  if (!productWrapper || !product) {
    return;
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const statusLabel = product.sale ? "Limited Sale" : "New Arrival";

  document.title = `${product.name} | NOIR.`;

  productWrapper.innerHTML = `
    <div class="product-gallery">
      <div class="gallery-label">${statusLabel}</div>

      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
    </div>

    <div class="product-content">
      <div class="product-kicker">
        <span>${product.category}</span>
        <span>NOIR. Select</span>
      </div>

      <h1>${product.name}</h1>

      <p class="product-description">
        A polished NOIR. essential made for clean daily styling, premium comfort,
        and a sharp minimal finish.
      </p>

      <div class="product-rating" aria-label="Rated 4.8 out of 5">
        <span class="rating-dots" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
        <strong>4.8</strong>
        <small>126 reviews</small>
      </div>

      <div class="purchase-panel">
        <div class="product-price">
          <span class="new-price">Rs.${product.price}</span>
          <span class="old-price">Rs.${product.oldPrice}</span>
          ${discount > 0 ? `<span class="discount-badge">${discount}% off</span>` : ""}
        </div>

        <div class="product-options">
          <div>
            <span class="option-label">Size</span>
            <div class="size-list" id="sizeList">
              <span data-size="S">S</span>
              <span data-size="M">M</span>
              <span data-size="L">L</span>
              <span data-size="XL">XL</span>
            </div>
          </div>
        </div>

        <div class="product-buttons">
          <button class="buy-btn" id="productAddCart">Add To Cart</button>
        </div>
      </div>

      <div class="product-meta">
        <div>
          <strong>Free Shipping</strong>
          <span>On prepaid orders above Rs.1999</span>
        </div>
        <div>
          <strong>Easy Returns</strong>
          <span>7-day exchange support</span>
        </div>
        <div>
          <strong>Premium Finish</strong>
          <span>Soft hand feel with structured fit</span>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("productAddCart")
    .addEventListener("click", () => {
      const selectedSize = document.querySelector(".size-list span.active");
      
      if (!selectedSize) {
        alert("Please select a size");
        return;
      }

      const productWithSize = {
        ...product,
        selectedSize: selectedSize.dataset.size
      };
      
      addProductToCart(productWithSize);
    });

  // Add size selection functionality
  const sizeOptions = document.querySelectorAll(".size-list span");
  sizeOptions.forEach(option => {
    option.addEventListener("click", function() {
      sizeOptions.forEach(opt => opt.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

renderProduct(fallbackProducts);

fetch("./assets/data/product.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Product data could not be loaded");
    }

    return response.json();
  })
  .then(renderProduct)
  .catch(error => {
    console.log("Product JSON Error:", error);
  });
