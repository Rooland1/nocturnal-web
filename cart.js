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
});
