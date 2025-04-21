let url ="https://doc.clickup.com/9018533739/d/h/8crqtvb-1018/fe4eeb198a3ffeb";
let postUrl = "https://randomuser.me/api/?results=10";

const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchInput");
const genderFilter = document.getElementById("genderFilter");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const savedUsersContainer = document.getElementById("savedUsers");

let allUsers = [];

async function fetchUsers(count = 10) {
    try {
        const response = await fetch(`${postUrl}&results=${count}`);
        const data = await response.json();
        allUsers = data.results;
        renderUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

fetchUsers();

function renderUsers() {
  const searchTerm = searchInput.value.toLowerCase();
  const gender = genderFilter.value;

  const filtered = allUsers.filter(user => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    const matchesName = fullName.includes(searchTerm);
    const matchesGender = gender === "all" || user.gender === gender;
    return matchesName && matchesGender;
  });

  userList.innerHTML = "";
  filtered.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture.medium}" alt="${user.name.first}" />
      <h3>${user.name.first} ${user.name.last}</h3>
      <p>${user.email}</p>
      <p>${user.gender}, ${user.location.country}</p>
      <button onclick='saveUser(${JSON.stringify(user)})'>Save</button>
    `;
    userList.appendChild(card);
  });
}

function saveUser(user) {
  let saved = JSON.parse(localStorage.getItem("savedUsers")) || [];
  const exists = saved.find(u => u.email === user.email);
  if (!exists) {
    saved.push(user);
    localStorage.setItem("savedUsers", JSON.stringify(saved));
    renderSavedUsers();
  }
}

function renderSavedUsers() {
  const saved = JSON.parse(localStorage.getItem("savedUsers")) || [];
  savedUsersContainer.innerHTML = "";
  saved.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture.medium}" alt="${user.name.first}" />
      <h3>${user.name.first} ${user.name.last}</h3>
      <p>${user.email}</p>
      <p>${user.gender}, ${user.location.country}</p>
    `;
    savedUsersContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", renderUsers);
genderFilter.addEventListener("change", renderUsers);
loadMoreBtn.addEventListener("click", () => fetchUsers(10));

window.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  renderSavedUsers();
});