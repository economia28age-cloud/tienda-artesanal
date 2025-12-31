let cart = [];

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function addToCart(name, price) {
  cart.push({name, price});
  updateCart();
}

function updateCart() {
  const items = document.getElementById("cart-items");
  items.innerHTML = "";
  let total = 0;

  cart.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - $${p.price}`;
    items.appendChild(li);
    total += p.price;
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.length;
}

function sendWhatsApp() {
  let msg = "Hola, quiero comprar:%0A";
  cart.forEach(p => msg += `- ${p.name} $${p.price}%0A`);
  window.open(`https://wa.me/2321134388?text=${msg}`);
}
