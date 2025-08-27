// — Forms & Interaction Logic —

// Contact form submission
document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const resp = document.getElementById("contactResponse");
  resp.classList.remove("hidden");
  setTimeout(() => resp.classList.add("hidden"), 3000);
  this.reset();
});

// Question form submission
document.getElementById("questionForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("questionInput");
  const msg = document.getElementById("responseMsg");
  if (input.value.trim()) {
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 3000);
    input.value = "";
  }
});

// Global cart array & pricing
let cartItems = [];
const priceMap = {
  "Irish Coffee": 4.5,
  "Mocha": 3.75,
  "Cappuccino": 4.0,
  "Americano": 4.5,
  "Turkish Coffee": 5.0,
  "Flat White": 4.2
};

// Utility: HTML escaping
function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Render products dynamically
const products = [
  { name: "Irish Coffee", price: 4.5, image: "images/services2.jpg", desc: "Bold with a hint of whiskey essence." },
  { name: "Mocha", price: 3.75, image: "images/services4.jpg", desc: "Chocolatey indulgence." },
  { name: "Cappuccino", price: 4.0, image: "images/services5.jpg", desc: "Creamy classic." },
  { name: "Americano", price: 4.5, image: "images/services8.jpg", desc: "Smooth & rich." },
  { name: "Turkish Coffee", price: 5.0, image: "images/services6.jpg", desc: "Intense aroma." },
  { name: "Flat White", price: 4.2, image: "images/services9.jpg", desc: "Velvety espresso." }
];
const grid = document.querySelector('.products-grid');
if (grid) {
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-aos', 'fade-up');
    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div class="product-meta">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button onclick="addToCart('${p.name}')">Add to Cart</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

// Cart logic
function addToCart(name) {
  const price = priceMap[name];
  if (price === undefined) return alert("Price unavailable.");

  const found = cartItems.find(i => i.name === name);
  found ? found.quantity++ : cartItems.push({ name, price, quantity: 1 });
  updateCart();
  openCartTemporarily();
}

function updateCart() {
  const container = document.getElementById("cart-items");
  const totalItemsElem = document.getElementById("total-items");
  const totalAmountElem = document.getElementById("total-amount");
  const countElem = document.getElementById("cart-count");
  if (!container || !totalItemsElem || !totalAmountElem || !countElem) return;

  container.innerHTML = "";
  let totalItems = 0, totalAmount = 0;

  cartItems.forEach((item, idx) => {
    totalItems += item.quantity;
    totalAmount += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item-box";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.name)}</strong><br>
        $${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
      </div>
      <div class="cart-item-actions">
        <button onclick="changeQuantity(${idx}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${idx}, 1)">+</button>
      </div>`;
    container.appendChild(row);
  });

  totalItemsElem.textContent = totalItems;
  totalAmountElem.textContent = totalAmount.toFixed(2);
  countElem.textContent = totalItems;

  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function changeQuantity(index, delta) {
  if (!cartItems[index]) return;
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity <= 0) cartItems.splice(index, 1);
  updateCart();
}

function clearCart() {
  cartItems = [];
  updateCart();
}

function checkoutCart() {
  if (!cartItems.length) return alert("Your cart is empty!");
  alert("✅ Thank you for your purchase!");
  clearCart();
  toggleCart();
}

// Toggle cart panel
function toggleCart() {
  const cart = document.getElementById("cart");
  if (!cart) return;
  if (cart.classList.contains("hidden")) {
    cart.classList.remove("hidden");
    setTimeout(() => cart.classList.add("cart-open"), 20);
  } else {
    cart.classList.remove("cart-open");
    setTimeout(() => cart.classList.add("hidden"), 300);
  }
}

// Auto-show cart temporarily
function openCartTemporarily() {
  const cart = document.getElementById("cart");
  if (!cart || !cart.classList.contains("hidden")) return;
  cart.classList.remove("hidden");
  setTimeout(() => cart.classList.add("cart-open"), 20);
  setTimeout(() => {
    cart.classList.remove("cart-open");
    setTimeout(() => cart.classList.add("hidden"), 300);
  }, 1200);
}

// Close cart on outside click
document.addEventListener("click", ev => {
  const cart = document.getElementById("cart");
  const btn = document.querySelector(".cart-btn");
  if (!cart || cart.classList.contains("hidden")) return;
  if (!cart.contains(ev.target) && !(btn && btn.contains(ev.target))) {
    cart.classList.remove("cart-open");
    setTimeout(() => cart.classList.add("hidden"), 300);
  }
});

// Load cart from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("cart");
  if (stored) cartItems = JSON.parse(stored);
  updateCart();
});

// Smooth scroll helper
window.scrollToSection = id => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

// Mobile nav toggle
function toggleMenu() {
  document.querySelector(".navlist")?.classList.toggle("show");
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
