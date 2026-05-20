const fallbackProducts = [
  {
    "id": 1,
    "name": "Minimal Black Hoodie",
    "price": 2999,
    "oldPrice": 4999,
    "category": "hoodie",
    "sale": true,
    "popular": true,
    "image": "./assets/images/item1.png"
  },
  {
    "id": 2,
    "name": "luxury jersey",
    "price": 5999,
    "oldPrice": 8999,
    "category": "jersey",
    "sale": true,
    "popular": true,
    "image": "./assets/images/item2.png"
  },
  {
    "id": 3,
    "name": "Premium Grey jersey",
    "price": 7999,
    "oldPrice": 11999,
    "category": "jersey",
    "sale": true,
    "popular": true,
    "image": "./assets/images/item3.png"
  },
  {
    "id": 4,
    "name": "classic jersey",
    "price": 6499,
    "oldPrice": 9999,
    "category": "jersey",
    "sale": true,
    "popular": false,
    "image": "./assets/images/item4.png"
  },
  {
    "id": 5,
    "name": "Black Hoodie",
    "price": 3999,
    "oldPrice": 7999,
    "category": "hoodie",
    "sale": true,
    "popular": true,
    "image": "./assets/images/item5.png"
  },
  {
    "id": 6,
    "name": "Brown Hoodie",
    "price": 2999,
    "oldPrice": 5999,
    "category": "hoodie",
    "sale": true,
    "popular": true,
    "image": "./assets/images/item6.png"
  }
];

function bindProductButtons(products) {
  const addButtons = document.querySelectorAll(".add-cart-btn");

  addButtons.forEach((button, index) => {
    if (button.dataset.cartBound === "true") {
      return;
    }

    button.dataset.cartBound = "true";

    button.addEventListener("click", () => {
      const product = products[index];

      if (!product) {
        return;
      }

      if (typeof window.addToCart === "function") {
        window.addToCart(product);
        return;
      }

      document.addEventListener(
        "cart:ready",
        () => window.addToCart(product),
        { once: true }
      );
    });
  });
}

bindProductButtons(fallbackProducts);

fetch("./assets/data/product.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Product data could not be loaded");
    }

    return response.json();
  })
  .then(products => {
    fallbackProducts.splice(0, fallbackProducts.length, ...products);
  })
  .catch(error => {
    console.log("Products JSON Error:", error);
  });
