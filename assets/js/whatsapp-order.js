function initializeWhatsappOrder() {
  const whatsappOrder = document.getElementById("whatsappOrder");

  if (!whatsappOrder) {
    return;
  }

  if (whatsappOrder.dataset.initialized === "true") {
    return;
  }

  whatsappOrder.dataset.initialized = "true";

  whatsappOrder.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Cart is Empty");
      return;
    }

    let message = "Hello, I want to order:%0A%0A";
    let total = 0;

    cart.forEach(item => {
      const sizeInfo = item.selectedSize ? ` (Size: ${item.selectedSize})` : "";
      message += `${item.quantity}x ${item.name}${sizeInfo} - Rs.${item.price * item.quantity}%0A`;
      total += item.price * item.quantity;
    });

    message += `%0ATotal: Rs.${total}`;

    const whatsappNumber = "919136579741";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank"
    );
  });
}

initializeWhatsappOrder();
