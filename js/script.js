

/* ========================
   ESTADO DEL CARRITO
======================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ========================
   INIT
======================== */
updateCart();

/* ========================
   ABRIR / CERRAR CARRITO
======================== */
function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

/* ========================
   AGREGAR PRODUCTOS
======================== */
function addToCart(name, price) {
  document.getElementById("cart").classList.add("open");

  let item = cart.find(p => p.name === name);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
  updateCart();
  showMessage();
}

/* ========================
   GUARDADO
======================== */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ========================
   RENDER CARRITO
======================== */
function updateCart() {
  const items = document.getElementById("cart-items");
  items.innerHTML = "";
  let total = 0;

  cart.forEach((p, index) => {
    const subtotal = p.price * p.qty;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.name}</strong><br>
      $${p.price} x ${p.qty} = $${subtotal.toFixed(2)}<br>
      <button onclick="changeQty(${index}, 1)">+</button>
      <button onclick="changeQty(${index}, -1)">−</button>
      <button onclick="removeItem(${index})">❌</button>
    `;
    items.appendChild(li);
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent =
    cart.reduce((sum, p) => sum + p.qty, 0);
}

/* ========================
   CAMBIAR CANTIDAD
======================== */
function changeQty(index, delta) {
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  cart = [];
  saveCart();
  updateCart();
}

/* ========================
   MENSAJES
======================== */
function showMessage() {
  const msg = document.getElementById("cart-msg");
  if (!msg) return;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 1200);
}

/* ========================
   WHATSAPP
======================== */
function sendWhatsApp() {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let msg = "Hola, quiero comprar:%0A";
  cart.forEach(p => {
    msg += `- ${p.name} x${p.qty} = $${(p.price * p.qty).toFixed(2)}%0A`;
  });

  window.open("https://wa.me/2321134388?text=" + msg);
}

/* ========================
   CIERRE AL TOCAR FUERA
======================== */
document.addEventListener("click", function (e) {
  const cart = document.getElementById("cart");
  const cartBtn = document.querySelector(".cart-btn");

  if (!cart.classList.contains("open")) return;
  if (cartBtn.contains(e.target)) return;

  cart.classList.remove("open");
});

/* ========================
   FIX PC: NO CERRAR AL TOCAR DENTRO
======================== */
const cartElement = document.getElementById("cart");
cartElement.addEventListener("click", function (e) {
  e.stopPropagation();
});


