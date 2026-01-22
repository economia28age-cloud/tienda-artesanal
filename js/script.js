/* ==================================================
   ESTADO GLOBAL
================================================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ==================================================
   PRODUCTOS
================================================== */
let products = [
  {
    name: "Vela de Sándalo y Cedro",
    price: 24.99,
    images: [
      "https://i.pinimg.com/1200x/5e/b8/4a/5eb84acec8f111bc1f1e9b65261c2976.jpg"
    ],
    category: "velas",
    desc: "Aroma cálido y envolvente."
  },
  {
    name: "Vela de Lavanda Relajante",
    price: 24.99,
    images: [
      "https://i.pinimg.com/736x/57/1a/31/571a313824842ee15e5c33cf61c6d6d5.jpg"
    ],
    category: "velas",
    desc: "Calma la mente y el cuerpo."
  },
  {
    name: "Vela Cítrica de Verano",
    price: 22.99,
    images: [
      "img/img1.jpeg",
      "img/img8.jpeg",
      "img/img9.jpeg"
    ],
    category: "velas",
    desc: "Fresca y energizante."
  },
  {
    name: "Vela de Canela Especiada",
    price: 22.99,
    images: ["img/img2.jpeg"],
    category: "velas",
    desc: "Aroma intenso y acogedor."
  },
  {
    name: "Anillo de Hueso “Luna”",
    price: 45.00,
    images: ["img/img3.jpeg"],
    category: "anillos"
  },
  {
    name: "Anillo Minimalista",
    price: 35.00,
    images: ["img/img4.jpeg"],
    category: "anillos"
  },
  {
    name: "Anillo Geométrico",
    price: 49.99,
    images: ["img/img6.jpeg"],
    category: "anillos"
  },
  {
    name: "Anillo Turquesa",
    price: 55.00,
    images: ["img/img7.jpeg"],
    category: "anillos"
  }
];

/* ==================================================
   ELEMENTOS DOM
================================================== */
const cartBtn = document.querySelector(".cart-btn");
const cartElement = document.getElementById("cart");
const closeBtn = document.querySelector(".close-cart");

// LIGHTBOX (SE DECLARA SOLO AQUÍ)
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const prevBtn = lightbox.querySelector(".prev");
const nextBtn = lightbox.querySelector(".next");
const closeLightboxBtn = document.querySelector(".close");
// botón WhatsApp
const whatsappBtn = document.querySelector(".whatsapp-btn"); // botón WhatsApp




/* ==================================================
   LIGHTBOX – ESTADO
================================================== */
let currentImages = [];
let currentIndex = 0;
let startX = 0;

/* ==================================================
   INIT
================================================== */
renderProducts();
updateCart();

/* ==================================================
   EVENTOS CARRITO
================================================== */
cartBtn.onclick = () => cartElement.classList.toggle("open");
closeBtn.onclick = () => cartElement.classList.remove("open");

cartElement.addEventListener("click", e => e.stopPropagation());

document.addEventListener("click", e => {
  if (!cartElement.classList.contains("open")) return;
  if (cartElement.contains(e.target)) return;
  if (cartBtn.contains(e.target)) return;
  cartElement.classList.remove("open");
});
// enviar carrito por WhatsApp
whatsappBtn.addEventListener("click", sendWhatsApp); 
/* ==================================================
   RENDER PRODUCTOS
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
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      ${p.desc ? `<p>${p.desc}</p>` : ""}
      <span class="price">$${p.price}</span>
      <button>Agregar al carrito</button>
    `;

    card.querySelector("button").onclick = () =>
      addToCart(p.name, p.price);

    card.querySelector("img").onclick = () =>
      openLightbox(p.images, 0);

    if (p.category === "velas") velas.appendChild(card);
    if (p.category === "anillos") anillos.appendChild(card);
  });
}

/* ==================================================
   CARRITO
================================================== */
function addToCart(name, price) {
  const item = cart.find(p => p.name === name);
  item ? item.qty++ : cart.push({ name, price, qty: 1 });
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  const items = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart");

  items.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    emptyMsg.style.display = "block";
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  emptyMsg.style.display = "none";

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
  document.getElementById("cart-count").textContent =
    cart.reduce((s, p) => s + p.qty, 0);
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
/* ==================================================
   VACIAR CARRITO COMPLETO
================================================== */
function clearCart() {
  console.log("🗑️ Carrito vaciado");
  cart = [];
  saveCart();
  updateCart();
  document.getElementById("cart-msg").textContent = "Carrito vacío 🗑️";
document.getElementById("cart-msg").style.display = "block";
setTimeout(() => {
  document.getElementById("cart-msg").style.display = "none";
}, 1200);

}
/* ==================================================
   EVENTO BOTÓN VACIAR CARRITO
================================================== */
const clearCartBtn = document.querySelector(".clear-cart");

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evita cerrar el carrito
    clearCart();
  });
}


/* ==================================================
   LIGHTBOX – FUNCIONES
================================================== */

// abrir
function openLightbox(images, index = 0) {
  currentImages = images;
  currentIndex = index;
  lightboxImg.classList.remove("zoomed"); // reset zoom
  lightboxImg.src = currentImages[currentIndex];
  lightbox.classList.remove("hidden");
}

// cerrar
function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImg.classList.remove("zoomed");
}

/* ==================================================
   LIGHTBOX – EVENTOS
================================================== */

// cerrar
closeLightboxBtn.onclick = closeLightbox;
lightbox.onclick = closeLightbox;

// evitar cierre + zoom
lightboxImg.onclick = (e) => {
  e.stopPropagation();
  lightboxImg.classList.toggle("zoomed");
};

// navegación
function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  lightboxImg.classList.remove("zoomed");
  lightboxImg.src = currentImages[currentIndex];
}

function prevImage() {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  lightboxImg.classList.remove("zoomed");
  lightboxImg.src = currentImages[currentIndex];
}

nextBtn.onclick = (e) => {
  e.stopPropagation();
  nextImage();
};

prevBtn.onclick = (e) => {
  e.stopPropagation();
  prevImage();
};

// swipe móvil
lightboxImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightboxImg.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (diff > 50) nextImage();
  if (diff < -50) prevImage();
});


/* ==================================================
   MODO OSCURO
================================================== */

// referencias
const themeToggle = document.getElementById("theme-toggle");

// cargar preferencia guardada
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// click botón
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  // cambiar icono
  themeToggle.textContent = isDark ? "☀️" : "🌙";

  // guardar preferencia
  localStorage.setItem("theme", isDark ? "dark" : "light");
});


// ==================================================
// Enviar pedido por WhatsApp
// ==================================================
function sendWhatsApp() {

  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = 
`Hola,
Quiero realizar el siguiente pedido:\n\n`;

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    mensaje += 
`${item.name}
Cantidad: ${item.qty}
Subtotal: $${subtotal.toFixed(2)}\n\n`;
  });

  mensaje += `Total: $${total.toFixed(2)}\n\nGracias.`;

  window.open(
    `https://wa.me/5212321134388?text=${encodeURIComponent(mensaje)}`,
    "_blank"
  );
}
