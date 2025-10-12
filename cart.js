// cart.js - Cart management using localStorage

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.title === product.title && item.size === product.size);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  alert('Termék hozzáadva a kosárhoz!');
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCart();
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('#cartBadge');
  badges.forEach(badge => {
    badge.textContent = totalItems;
  });
}

function displayCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = parseFloat(item.price.replace(' Ft', '').replace(',', '')) * item.quantity;
    total += itemTotal;
    cartItems.innerHTML += `
      <div class="cart-item d-flex justify-content-between align-items-center">
        <div>
          <h5>${item.title}</h5>
          <p>Méret: ${item.size} | Mennyiség: ${item.quantity}</p>
          <p>Ár: ${itemTotal} Ft</p>
        </div>
        <button class="btn btn-outline-danger" onclick="removeFromCart(${index})">Eltávolítás</button>
      </div>
    `;
  });

  cartTotal.innerHTML = `<h4>Összesen: ${total} Ft</h4>`;
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  if (document.getElementById('cartItems')) {
    displayCart();
  }

  // Checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!isLoggedIn()) {
        alert('Kérjük, jelentkezzen be a fizetéshez!');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
      }
      const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
      checkoutModal.show();
      // Update total
      const cart = getCart();
      let total = 0;
      cart.forEach(item => {
        total += parseFloat(item.price.replace(' Ft', '').replace(',', '')) * item.quantity;
      });
      document.getElementById('checkoutTotal').textContent = `Összesen: ${total} Ft`;
    });
  }

  // Payment method change
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const details = document.getElementById('creditCardDetails');
      if (radio.value === 'creditCard') {
        details.style.display = 'block';
      } else {
        details.style.display = 'none';
      }
    });
  });

  // Checkout form submit
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Validate billing
      const name = document.getElementById('billingName').value.trim();
      const email = document.getElementById('billingEmail').value.trim();
      const address = document.getElementById('billingAddress').value.trim();
      const city = document.getElementById('billingCity').value.trim();
      const zip = document.getElementById('billingZip').value.trim();
      const phone = document.getElementById('billingPhone').value.trim();
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

      if (!name || !email || !address || !city || !zip || !phone) {
        alert('Kérjük, töltse ki az összes számlázási mezőt!');
        return;
      }

      if (paymentMethod === 'creditCard') {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCvv = document.getElementById('cardCvv').value.trim();
        if (!cardNumber || !cardExpiry || !cardCvv) {
          alert('Kérjük, töltse ki a kártyaadatokat!');
          return;
        }
        // Simple validation
        if (cardNumber.replace(/\s/g, '').length < 16 || cardExpiry.length !== 5 || cardCvv.length !== 3) {
          alert('Érvénytelen kártya adatok!');
          return;
        }
      }

      // Simulate payment
      alert('Fizetés sikeres! Köszönjük a vásárlást.');
      // Clear cart
      saveCart([]);
      displayCart();
      updateCartBadge();
      // Close modal
      const checkoutModalEl = document.getElementById('checkoutModal');
      const modal = bootstrap.Modal.getInstance(checkoutModalEl);
      modal.hide();
    });
  }
});
