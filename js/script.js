/* ========================
   ESTADO DEL CARRITO
======================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [
  /* ========================
     PRODUCTOS
  ========================= */
  {
    name: "Vela de Sándalo y Cedro",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
    category: "velas",
    desc: "Aroma cálido y envolvente.",
  },
  {
    name: "Vela de Lavanda Relajante",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1615486364057-8b8f56e9a5e6",
    category: "velas",
    desc: "Calma la mente y el cuerpo.",
  },
  {
    name: "Vela Cítrica de Verano",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
    category: "velas",
    desc: "Fresca y energizante.",
    
  },
  {
    name: "Vela de Canela Especiada",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1615484477201-9f4953340fab",
    category: "velas",
    desc: "Aroma intenso y acogedor.",
    stock: 5
  },
  {
    name: "Anillo de Hueso “Luna”",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    category: "anillos",
  },
  {
    name: "Anillo Minimalista",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
    category: "anillos",
    
  },
  {
    name: "Anillo Geométrico",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    category: "anillos",
  },
  {
    name: "Anillo Turquesa",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    category: "anillos",
    
  }
];

/* ========================
   INIT
======================== */
renderProducts();
updateCart();

/* ========================
   ABRIR / CERRAR CARRITO
======================== */
const cartBtn = document.querySelector(".cart-btn");
const cartElement = document.getElementById("cart");
const closeBtn = document.querySelector(".close-cart");

if(cartBtn) cartBtn.addEventListener("click", () => cartElement.classList.toggle("open"));
if(closeBtn) closeBtn.addEventListener("click", () => cartElement.classList.remove("open"));

/* ========================
   AGREGAR PRODUCTOS
======================== */
function addToCart(name, price, btn) {
  const product = products.find(p => p.name === name);
  if (!product || product.stock <= 0) return;

  product.stock -= 1;
  renderProducts();

  if (btn) {
    btn.disabled = true;
    setTimeout(() => btn.disabled = false, 800);
  }

  cartElement.classList.add("open");

  let item = cart.find(p => p.name === name);
  if(item) item.qty += 1;
  else cart.push({name, price, qty:1});

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

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

/* ========================
   RENDER PRODUCTOS
======================== */
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
      <p class="stock">Stock: ${p.stock}</p>
      <button ${p.stock === 0 ? "disabled" : ""}>
        ${p.stock === 0 ? "Agotado" : "Agregar al carrito"}
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => addToCart(p.name, p.price, card.querySelector("button")));

    if(p.category === "velas") velasContainer.appendChild(card);
    if(p.category === "anillos") anillosContainer.appendChild(card);
  });
}

/* ========================
   RENDER CARRITO
======================== */
function updateCart() {
  const items = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart");
  const whatsappBtn = document.querySelector(".whatsapp-btn");

  items.innerHTML = "";
  let total = 0;

  if(cart.length === 0) {
    emptyMsg.style.display = "block";
    if(whatsappBtn) {
      whatsappBtn.disabled = true;
      whatsappBtn.style.opacity = "0.6";
    }
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  emptyMsg.style.display = "none";
  if(whatsappBtn) {
    whatsappBtn.disabled = false;
    whatsappBtn.style.opacity = "1";
  }

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

/* ========================
   CAMBIAR CANTIDAD
======================== */
function changeQty(index, delta) {
  cart[index].qty += delta;
  if(cart[index].qty <= 0) cart.splice(index,1);
  renderProducts();
  saveCart();
  updateCart();
}

function removeItem(index) {
  const product = products.find(p => p.name === cart[index].name);
  if(product) product.stock += cart[index].qty;
  cart.splice(index,1);
  renderProducts();
  saveCart();
  updateCart();
}

/* ========================
   VACIAR CARRITO
======================== */
const clearBtn = document.querySelector(".clear-cart");
if(clearBtn) clearBtn.addEventListener("click", () => {
  if(!confirm("¿Vaciar todo el carrito?")) return;

  cart.forEach(item => {
    const product = products.find(p => p.name === item.name);
    if(product) product.stock += item.qty;
  });

  cart = [];
  renderProducts();
  saveCart();
  updateCart();
});

/* ========================
   MENSAJES
======================== */
function showMessage() {
  const msg = document.getElementById("cart-msg");
  if(!msg) return;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none",1200);
}

/* ========================
   WHATSAPP
======================== */
const whatsappBtn = document.querySelector(".whatsapp-btn");
if(whatsappBtn) whatsappBtn.addEventListener("click", () => {
  if(cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

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

/* ========================
   CIERRE AL TOCAR FUERA DEL CARRITO
======================== */
document.addEventListener("click", function(e) {
  const cartBtn = document.querySelector(".cart-btn");
  if(!cartElement.classList.contains("open")) return;
  if(cartBtn && cartBtn.contains(e.target)) return;
  cartElement.classList.remove("open");
});

cartElement.addEventListener("click", e => e.stopPropagation());
