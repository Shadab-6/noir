let cart = JSON.parse(localStorage.getItem("cart")) || [];

function initializeCart(){

  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartBtn.addEventListener("click", () => {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

  });

  closeCart.addEventListener("click", closeSidebar);

  cartOverlay.addEventListener("click", closeSidebar);

  function closeSidebar(){

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

  }

  function updateCart(){

    cartItems.innerHTML = "";

    let total = 0;

    if(cart.length === 0){

      cartItems.innerHTML = `
        <h3 style="color:#777;text-align:center;margin-top:50px;">
          Cart is Empty
        </h3>
      `;

    }

    cart.forEach((item,index)=>{

      total += item.price * item.quantity;

      cartItems.innerHTML += `

        <div class="cart-item">

          <img src="${item.image}" alt="">

          <div class="cart-info">

            <h4>${item.name}</h4>
            
            ${item.selectedSize ? `<p class="size-badge">Size: ${item.selectedSize}</p>` : ""}

            <p>₹${item.price}</p>

            <div class="qty-box">

              <button class="qty-btn" onclick="changeQty(${index}, -1)">
                -
              </button>

              <span>${item.quantity}</span>

              <button class="qty-btn" onclick="changeQty(${index}, 1)">
                +
              </button>

            </div>

            <button class="remove-btn" onclick="removeItem(${index})">
              Remove
            </button>

          </div>

        </div>

      `;

    });

    cartTotal.innerText = `₹${total}`;

    cartCount.innerText = cart.length;

    localStorage.setItem("cart", JSON.stringify(cart));

  }

  window.addToCart = function(product){

    const existing = cart.find(item => item.id === product.id && item.selectedSize === product.selectedSize);

    if(existing){

      existing.quantity += 1;

    }else{

      cart.push({
        ...product,
        quantity:1
      });

    }

    updateCart();

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

  }

  window.removeItem = function(index){

    cart.splice(index,1);

    updateCart();

  }

  window.changeQty = function(index, change){

    cart[index].quantity += change;

    if(cart[index].quantity <= 0){

      cart.splice(index,1);

    }

    updateCart();

  }

  updateCart();

  document.dispatchEvent(new Event("cart:ready"));

}
