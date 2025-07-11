const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYmI0MDc4Y2RkZjAwMTU1ZDY3YTAiLCJpYXQiOjE3NTIyMTg0MzIsImV4cCI6MTc1MzQyODAzMn0.ldAX_N3JG68PREIwbpflrkTX6bx7aOHpkg5Y_10rszM",
};

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const container = document.getElementById("product-detail");

if (!productId) {
  container.innerHTML = "<p class='text-danger'>ID prodotto mancante!</p>";
} else {
  fetch(endpoint + productId, { headers })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Prodotto non trovato");
      }
      return res.json();
    })
    .then((p) => {
      container.innerHTML = `
        <img src="${p.imageUrl}" alt="${p.name}" />
        <h2 class="mt-3">${p.name}</h2>
        <h5 class="text-muted">${p.brand}</h5>
        <p>${p.description}</p>
        <p class="fw-bold">Prezzo: ${p.price}€</p>
      `;
    })
    .catch((err) => {
      console.error("Errore nel caricamento:", err);
      container.innerHTML =
        "<p class='text-danger'>Errore nel caricamento del prodotto.</p>";
    });
}
