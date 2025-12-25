/******** AUTH ********/
function signup() {
  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("userType").value
  };

  if (!user.name || !user.email || !user.password) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("linkmeUser", JSON.stringify(user));
  alert("Account created successfully");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const user = JSON.parse(localStorage.getItem("linkmeUser"));

  if (!user || user.email !== email || user.password !== password) {
    alert("Invalid email or password");
    return;
  }

  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

/************ WORKERS ************/
function loadWorkers() {
  const workers = JSON.parse(localStorage.getItem("linkmeWorkers")) || [];
  const box = document.getElementById("workersBox");
  if (!box) return;

  box.innerHTML = "";

  workers.forEach(w => {
    box.innerHTML += `
      <div class="card" onclick='previewWorker(${JSON.stringify(w)})'>
        <h3>${w.profession}</h3>
        <p>${w.name}</p>
        <small>${w.workArea}</small>
      </div>
    `;
  });
}

function previewWorker(w) {
  openModal(`
    <h3>${w.name}</h3>
    <p><b>Profession:</b> ${w.profession}</p>
    <p><b>Phone:</b> ${w.phone}</p>
    <p><b>Area:</b> ${w.workArea}</p>
    <p>${w.skills}</p>
  `);
}

/************ ITEMS ************/
function loadMarketplace() {
  const items = JSON.parse(localStorage.getItem("linkmeItems")) || [];
  const box = document.getElementById("itemsBox");
  if (!box) return;

  box.innerHTML = "";

  items.filter(i => i.approved).forEach(i => {
    box.innerHTML += `
      <div class="card" onclick='previewItem(${JSON.stringify(i)})'>
        <h3>${i.title}</h3>
        <p>${i.type}</p>
        <b>${i.price} ETB</b>
      </div>
    `;
  });
}

function previewItem(i) {
  openModal(`
    <h3>${i.title}</h3>
    <p><b>Type:</b> ${i.type}</p>
    <p><b>Price:</b> ${i.price} ETB</p>
    <p><b>Seller:</b> ${i.seller}</p>
  `);
}

/************ SEARCH ************/
function globalSearch() {
  const q = document.getElementById("globalSearch").value.toLowerCase();
  loadWorkers();
  loadMarketplace();

  document.querySelectorAll(".card").forEach(c => {
    c.style.display = c.innerText.toLowerCase().includes(q) ? "block" : "none";
  });
}

/************ MODAL ************/
function openModal(html) {
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("previewModal").style.display = "block";
}

function closeModal() {
  document.getElementById("previewModal").style.display = "none";
}

/************ UPLOAD ITEM ************/
function uploadItem(e) {
  e.preventDefault();
  const user = getUser();
  if (!user) return alert("Login required");

  const items = JSON.parse(localStorage.getItem("linkmeItems")) || [];

  items.push({
    id: Date.now(),
    title: itemTitle.value,
    type: itemType.value,
    price: itemPrice.value,
    seller: user.email,
    approved: false
  });

  localStorage.setItem("linkmeItems", JSON.stringify(items));
  alert("Item sent for admin approval");
  e.target.reset();
}

/************ ADMIN ************/
function approveItem(id) {
  const items = JSON.parse(localStorage.getItem("linkmeItems")) || [];
  const item = items.find(i => i.id === id);
  if (item) item.approved = true;
  localStorage.setItem("linkmeItems", JSON.stringify(items));
}
