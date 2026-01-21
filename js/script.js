/* =========================
   ESTADO INICIAL
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products = [
  // ===== Velas =====
  { name: "Vela de Sándalo y Cedro", price: 24.99, image: "https://i.pinimg.com/1200x/5e/b8/4a/5eb84acec8f111bc1f1e9b65261c2976.jpg", category: "velas", desc: "Aroma cálido y envolvente." },
  { name: "Vela de Lavanda Relajante", price: 24.99, image: "https://i.pinimg.com/736x/57/1a/31/571a313824842ee15e5c33cf61c6d6d5.jpg", category: "velas", desc: "Calma la mente y el cuerpo." },
  { name: "Vela Cítrica de Verano", price: 22.99, image: "img/img1.jpeg", category: "velas", desc: "Fresca y energizante." },
  { name: "Vela de Canela Especiada", price: 22.99, image: "img/img2.jpeg", category: "velas", desc: "Aroma intenso y acogedor." },
  // ===== Anillos =====
  { name: "Anillo de Hueso “Luna”", price: 45.00, image: "img/img3.jpeg", category: "anillos" },
  { name: "Anillo Minimalista", price: 35.00, image: "img/img4.jpeg", category: "anillos" },
  { name: "Anillo Geométrico", price: 49.99, image: "img/img6.jpeg", category: "anillos" },
  { name: "Anillo Turquesa", price: 55.00, image: "img/img7.jpeg", category: "anillos" }
];

/* =========================
   INIT
========================= */
renderProducts();
updateCart();

/* =========================
   EVENTOS DE INTERFAZ
========================= */
const cartBtn = document.querySelector(".cart-btn");
const cartElement = document.getElementById("cart");
const closeBtn = document.querySelector(".close-cart");

if(cartBtn) cartBtn.addEventListener("click", () => cartElement.classList.toggle("open"));
if(closeBtn) closeBtn.addEventListener("click", () => cartElement.classList.remove("open"));

/* =========================
   FUNCIONES DEL CARRITO
========================= */
function addToCart(name, price) {
  let item = cart.find(p => p.name === name);
  if(item) item.qty += 1;
  else cart.push({name, price, qty:1});

  saveCart();
  updateCart();
  showMessage();
}

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

/* Render productos en la tienda */
function renderProducts() {
  const velasContainer = document.querySelector("#velas .grid");
  const anillosContainer = document.querySelector("#anillos .grid");

  velasContainer.innerHTML = "";
  anillosContainer.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      ${p.desc ? `<p>${p.desc}</p>` : ""}
      <span class="price">$${p.price}</span>
      <button>Agregar al carrito</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(p.name, p.price));

    if(p.category === "velas") velasContainer.appendChild(card);
    if(p.category === "anillos") anillosContainer.appendChild(card);
  });
}

/* Actualizar carrito y total */
function updateCart() {
  const items = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart");
  const whatsappBtn = document.querySelector(".whatsapp-btn");

  items.innerHTML = "";
  let total = 0;

  if(cart.length === 0) {
    emptyMsg.style.display = "block";
    if(whatsappBtn) { whatsappBtn.disabled = true; whatsappBtn.style.opacity = "0.6"; }
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  emptyMsg.style.display = "none";
  if(whatsappBtn) { whatsappBtn.disabled = false; whatsappBtn.style.opacity = "1"; }

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
  document.getElementById("cart-count").textContent = cart.reduce((sum,p) => sum+p.qty,0);
}

/* Cambiar cantidad de producto en carrito */
function changeQty(index, delta) {
  cart[index].qty += delta;
  if(cart[index].qty <= 0) cart.splice(index,1);
  saveCart();
  updateCart();
}

/* Eliminar producto del carrito */
function removeItem(index) {
  cart.splice(index,1);
  saveCart();
  updateCart();
}

/* Vaciar carrito */
const clearBtn = document.querySelector(".clear-cart");
if(clearBtn) clearBtn.addEventListener("click", () => {
  if(!confirm("¿Vaciar todo el carrito?")) return;
  cart = [];
  saveCart();
  updateCart();
});

/* Mostrar mensaje temporal al agregar producto */
function showMessage() {
  const msg = document.getElementById("cart-msg");
  if(!msg) return;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none",1200);
}

/* WhatsApp: enviar pedido completo */
const whatsappBtn = document.querySelector(".whatsapp-btn");
if(whatsappBtn) whatsappBtn.addEventListener("click", () => {
  if(cart.length === 0) { alert("El carrito está vacío"); return; }

  let msg = "Hola 👋%0AQuiero realizar el siguiente pedido:%0A%0A";
  let total = 0;

  cart.forEach(p => {
    const subtotal = p.price * p.qty;
    total += subtotal;
    msg += `🛒 ${p.name}%0ACantidad: ${p.qty}%0ASubtotal: $${subtotal.toFixed(2)}%0A%0A`;
  });

  msg += `💰 Total: $${total.toFixed(2)}%0A%0AGracias.`;
  window.open("https://wa.me/2321134388?text=" + msg);
});

/* =========================
   CIERRE AUTOMÁTICO DEL CARRITO
========================= */
document.addEventListener("click", function(e) {
  const cartBtn = document.querySelector(".cart-btn");
  if(!cartElement.classList.contains("open")) return;
  if(cartBtn && cartBtn.contains(e.target)) return;
  cartElement.classList.remove("open");
});
cartElement.addEventListener("click", e => e.stopPropagation());


// =========================
// LIGHTBOX
// =========================
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

// Abrir lightbox al hacer clic en cualquier imagen del producto
document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex"; // mostrar
  });
});

// Cerrar lightbox al hacer clic en la imagen
lightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});
