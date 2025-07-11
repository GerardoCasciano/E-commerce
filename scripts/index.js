const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYmI0MDc4Y2RkZjAwMTU1ZDY3YTAiLCJpYXQiOjE3NTIyMTg0MzIsImV4cCI6MTc1MzQyODAzMn0.ldAX_N3JG68PREIwbpflrkTX6bx7aOHpkg5Y_10rszM",
};

const container = document.getElementById("product-list");

async function loadProducts() {
  try {
    const response = await fetch(endpoint, { headers });
    if (!response.ok) throw new Error("Errore nel caricamento prodotti");
    const products = await response.json();

    container.innerHTML = ""; // pulisce il contenuto

    products.forEach((prod) => {
      // crea una card con Bootstrap e tuo stile
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${prod.imageUrl}" alt="${prod.name}" />
        <h5>${prod.name}</h5>
        <p>${prod.description}</p>
        <p><strong>€${prod.price.toFixed(2)}</strong></p>
        <a href="backoffice.html?id=${
          prod._id
        }" class="btn btn-primary btn-sm me-2">Modifica</a>
        <a href="detail.html?id=${
          prod._id
        }" class="btn btn-outline-secondary btn-sm">Dettagli</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="text-danger">Errore nel caricamento dei prodotti.</p>';
  }
}

loadProducts();
