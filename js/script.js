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

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
lightboxImg.addEventListener("click", (e) => {
  e.stopPropagation();
});
const prevBtn = lightbox.querySelector(".prev");
const nextBtn = lightbox.querySelector(".next");
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
});


/* ==================================================
   LIGHTBOX ESTADO
================================================== */
let currentImages = [];
let currentIndex = 0;

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
   LIGHTBOX FUNCIONES
================================================== */
function openLightbox(images, index) {
  if (!images || !images.length) return;

  currentImages = images;
  currentIndex = index;
  lightboxImg.src = currentImages[currentIndex];
  lightbox.style.display = "flex";
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  lightboxImg.src = currentImages[currentIndex];
}

function showPrev() {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  lightboxImg.src = currentImages[currentIndex];
}

nextBtn.onclick = e => {
  e.stopPropagation();
  showNext();
};

prevBtn.onclick = e => {
  e.stopPropagation();
  showPrev();
};

lightbox.onclick = e => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
};

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
