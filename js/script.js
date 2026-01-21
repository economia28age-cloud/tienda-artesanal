/* ==================================================
   ESTADO GLOBAL
================================================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ==================================================
   PRODUCTOS
   Cada producto tiene UNA imagen (simple y estable)
================================================== */
const products = [
  { name: "Vela de Sándalo y Cedro", price: 24.99, image: "https://i.pinimg.com/1200x/5e/b8/4a/5eb84acec8f111bc1f1e9b65261c2976.jpg", category: "velas", desc: "Aroma cálido y envolvente." },
  { name: "Vela de Lavanda Relajante", price: 24.99, image: "https://i.pinimg.com/736x/57/1a/31/571a313824842ee15e5c33cf61c6d6d5.jpg", category: "velas", desc: "Calma la mente y el cuerpo." },
  { name: "Vela Cítrica de Verano", price: 22.99, image: "img/img1.jpeg", category: "velas", desc: "Fresca y energizante." },
  { name: "Vela de Canela Especiada", price: 22.99, image: "img/img2.jpeg", category: "velas", desc: "Aroma intenso y acogedor." },
  { name: "Anillo de Hueso “Luna”", price: 45.00, image: "img/img3.jpeg", category: "anillos" },
  { name: "Anillo Minimalista", price: 35.00, image: "img/img4.jpeg", category: "anillos" },
  { name: "Anillo Geométrico", price: 49.99, image: "img/img6.jpeg", category: "anillos" },
  { name: "Anillo Turquesa", price: 55.00, image: "img/img7.jpeg", category: "anillos" }
];

/* ==================================================
   ELEMENTOS DOM
================================================== */
const cartBtn = document.querySelector(".cart-btn");
const cartElement = document.getElementById("cart");
const closeBtn = document.querySelector(".close-cart");
// Evita que los clicks dentro del carrito lo cierren
cartElement.addEventListener("click", (e) => {
  e.stopPropagation();
});
/* ==================================================
   CIERRE DEL CARRITO AL HACER CLICK FUERA
================================================== */
document.addEventListener("click", (e) => {
  // si el carrito NO está abierto, no hacemos nada
  if (!cartElement.classList.contains("open")) return;

  // si el click fue dentro del carrito, no cerramos
  if (cartElement.contains(e.target)) return;

  // si el click fue en el botón del carrito, no cerramos
  if (cartBtn.contains(e.target)) return;

  // en cualquier otro caso, cerramos
  cartElement.classList.remove("open");
});
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

/* ==================================================
   INIT
================================================== */
renderProducts();
updateCart();

/* ==================================================
   EVENTOS UI
================================================== */
cartBtn?.addEventListener("click", () => cartElement.classList.toggle("open"));
closeBtn?.addEventListener("click", () => cartElement.classList.remove("open"));

/* ==================================================
   RENDER DE PRODUCTOS
================================================== */
function renderProducts() {
  const velas = document.querySelector("#velas .grid");
  const anillos = document.querySelector("#anillos .grid");

  velas.innerHTML = "";
  anillos.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="product-img">
      <h3>${p.name}</h3>
      ${p.desc ? `<p>${p.desc}</p>` : ""}
      <span class="price">$${p.price}</span>
      <button>Agregar al carrito</button>
    `;

    // carrito
    card.querySelector("button").onclick = () => addToCart(p.name, p.price);

    // lightbox
    card.querySelector("img").onclick = () => openLightbox(p.image);

    if (p.category === "velas") velas.appendChild(card);
    if (p.category === "anillos") anillos.appendChild(card);
  });
}

/* ==================================================
   LIGHTBOX
================================================== */
function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.style.display = "flex";
}

lightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});

/* ==================================================
   CARRITO
================================================== */
function addToCart(name, price) {
  const item = cart.find(p => p.name === name);
  item ? item.qty++ : cart.push({ name, price, qty: 1 });
  saveCart();
  updateCart();
  showMessage();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  const items = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart");
  const whatsappBtn = document.querySelector(".whatsapp-btn");

  items.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    emptyMsg.style.display = "block";
    whatsappBtn.disabled = true;
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  emptyMsg.style.display = "none";
  whatsappBtn.disabled = false;

  cart.forEach((p, i) => {
    const subtotal = p.price * p.qty;
    total += subtotal;

    items.innerHTML += `
      <li>
        <strong>${p.name}</strong><br>
        $${p.price} x ${p.qty} = $${subtotal.toFixed(2)}<br>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">−</button>
        <button onclick="removeItem(${i})">❌</button>
      </li>
    `;
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.reduce((s, p) => s + p.qty, 0);
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
  updateCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  updateCart();
}

function showMessage() {
  const msg = document.getElementById("cart-msg");
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 1200);
}
