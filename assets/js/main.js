const cartTemplate = `
  <div class="cart-sidebar" id="cartSidebar">
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button id="closeCart" class="close-cart-btn" aria-label="Close cart">
        <img src="assets/images/remove.png" alt="">
      </button>
    </div>

    <div class="cart-items" id="cartItems"></div>

    <div class="cart-footer">
      <div class="coupon-box">
        <input type="text" id="couponInput" placeholder="Coupon code"/>
        <button id="applyCoupon">Apply</button>
      </div>

      <div class="cart-total">
        <h3>Total:</h3>
        <span id="cartTotal">Rs.0</span>
      </div>

      <button class="whatsapp-order-btn" id="whatsappOrder">
        Proceed To Order
      </button>
    </div>
  </div>

  <div class="cart-overlay" id="cartOverlay"></div>
`;

function setupCartComponent(html) {
  const cartComponent = document.getElementById("cartComponent");

  if (!cartComponent) {
    return;
  }

  cartComponent.innerHTML = html;

  initializeCart();

  if (typeof initializeWhatsappOrder === "function") {
    initializeWhatsappOrder();
  }
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking on the overlay
  navLinks.addEventListener("click", (e) => {
    if (e.target === navLinks) {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();

  fetch("components/cart-sidebar.html")
    .then(res => {
      if (!res.ok) {
        throw new Error("Cart component could not be loaded");
      }

      return res.text();
    })
    .then(setupCartComponent)
    .catch(() => {
      setupCartComponent(cartTemplate);
    });
});
