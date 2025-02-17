document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const cart = document.getElementById("cart");
    const cartCount = document.getElementById("cart-count");
    const productsContainer = document.getElementById("products");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalAmount = document.getElementById("total-amount");
    const closeCart = document.getElementById("close-cart");
  
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutModal = document.getElementById("checkout-modal");
    const closeModal = document.getElementById("close-modal");
    const orderIdElem = document.getElementById("order-id");
    const orderTotalElem = document.getElementById("order-total");
    const confirmPaymentBtn = document.getElementById("confirm-payment");
  
    let cartItems = [];
  
    // Atidaryti ir uždaryti krepšelį
    cartIcon.addEventListener("click", () => {
      cart.style.display = cart.style.display === "block" ? "none" : "block";
    });
  
    closeCart.addEventListener("click", () => {
      cart.style.display = "none";
    });
  
    // Prekės ir krepšelio logika
    const products = [
      { id: 1, name: "Rožė", price: 5, image: "https://images.unsplash.com/photo-1548460464-2a68877c7a5f?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 2, name: "Tulpė", price: 3.5, image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHVsaXB8ZW58MHx8MHx8fDA%3D" },
      { id: 3, name: "Puokštė Rožių", price: 80, image: "https://media.istockphoto.com/id/1456626236/photo/beautiful-emotional-woman-holding-bouquet-of-flowers.jpg?s=2048x2048&w=is&k=20&c=ZEElyWy-OGkcVQOwviPxZ4ce3P2mrxhFLDAm05kJ90s=" },
      { id: 4, name: "Puokštė Tulpių", price: 60, image: "https://media.istockphoto.com/id/501339287/photo/bunch-of-tulips.webp?a=1&b=1&s=612x612&w=0&k=20&c=ATwfJNDw0LZHpNRFC-OCK8yD2PV7u6Ek8MEZ-BJGV48=" }
    ];
  
    // Sukurti produktų sąrašą
    products.forEach(product => {
      const productEl = document.createElement("div");
      productEl.classList.add("product");
      productEl.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h2>${product.name}</h2>
        <p class="product-price">${product.price} €</p>
        <div class="quantity-controls">
          <button class="decrease">−</button>
          <input type="number" value="1" min="1" class="quantity">
          <button class="increase">+</button>
        </div>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Pridėti į krepšelį</button>
      `;
      productsContainer.appendChild(productEl);
    });
  
    // Kiekio padidinimo ir mažinimo funkcionalumas
    document.querySelectorAll(".increase").forEach(button => {
      button.addEventListener("click", (event) => {
        const productEl = event.target.closest(".product");
        const quantityInput = productEl.querySelector(".quantity");
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
      });
    });
  
    document.querySelectorAll(".decrease").forEach(button => {
      button.addEventListener("click", (event) => {
        const productEl = event.target.closest(".product");
        const quantityInput = productEl.querySelector(".quantity");
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
          quantityInput.value = quantity - 1;
        }
      });
    });
  
    // Pridėti prekes į krepšelį
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", (event) => {
        const productEl = event.target.closest(".product");
        const id = event.target.dataset.id;
        const name = event.target.dataset.name;
        const price = parseFloat(event.target.dataset.price);
        const quantity = parseInt(productEl.querySelector(".quantity").value);
  
        const existingItem = cartItems.find(item => item.id === id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cartItems.push({ id, name, price, quantity });
        }
  
        updateCartUI();
      });
    });
  
    // Atnaujinti krepšelio turinį
    function updateCartUI() {
      cartItemsContainer.innerHTML = "";
  
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `<p>Krepšelis tuščias.</p>`;
        checkoutBtn.style.display = "none"; // Paslėpti atsiskaitymo mygtuką
        cartCount.textContent = "0"; // Krepšelio skaičius turi būti 0
      } else {
        cartItems.forEach(item => {
          const cartItemEl = document.createElement("div");
          cartItemEl.classList.add("cart-item");
          cartItemEl.innerHTML = `
            <h3>${item.name}</h3>
            <p>Kiekis: ${item.quantity}</p>
            <p class="product-price">${(item.price * item.quantity).toFixed(2)} €</p>
            <button class="remove-item" data-id="${item.id}">Pašalinti</button>
          `;
          cartItemsContainer.appendChild(cartItemEl);
        });
  
        document.querySelectorAll(".remove-item").forEach(button => {
          button.addEventListener("click", (event) => {
            const id = event.target.dataset.id;
            cartItems = cartItems.filter(item => item.id !== id); // Pašaliname prekę
            updateCartUI(); // Atnaujiname krepšelio vaizdą
          });
        });
  
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalAmount.textContent = `Viso: ${total.toFixed(2)} €`;
        cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0); // Atnaujiname krepšelio prekių kiekį
        checkoutBtn.style.display = "block"; // Rodyti atsiskaitymo mygtuką
      }
    }
  
    // Atsiskaitymo funkcionalumas
    checkoutBtn.addEventListener("click", () => {
      if (cartItems.length > 0) {
        const orderId = Math.floor(Math.random() * 1000000);
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
        orderIdElem.textContent = orderId;
        orderTotalElem.textContent = total.toFixed(2);
  
        checkoutModal.style.display = "flex";
      } else {
        alert("Krepšelis tuščias. Prašome pridėti prekių.");
      }
    });
  
    closeModal.addEventListener("click", () => {
      checkoutModal.style.display = "none";
    });
  
    confirmPaymentBtn.addEventListener("click", () => {
      alert("Ačiū už užsakymą! Atsiskaitymas sėkmingas.");
      checkoutModal.style.display = "none";
      cartItems = [];
      updateCartUI();
    });
  });
  
