const BASE_URL = "https://reading-list-backend-mhgp.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

export async function register(firstName, lastName, email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function addBook(book) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(book),
  });
  return res.json();
}

export async function updateBook(book) {
  const res = await fetch(`${BASE_URL}/books/${book.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(book),
  });
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}
