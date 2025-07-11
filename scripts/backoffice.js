const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYmI0MDc4Y2RkZjAwMTU1ZDY3YTAiLCJpYXQiOjE3NTIyMTg0MzIsImV4cCI6MTc1MzQyODAzMn0.ldAX_N3JG68PREIwbpflrkTX6bx7aOHpkg5Y_10rszM",
};

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const form = document.getElementById("bike-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const imageUrlField = document.getElementById("imageUrl");
const previewImg = document.getElementById("preview");

const fallbackUrl =
  "https://cdn.shopify.com/s/files/1/0532/7139/6534/files/Scott-Scale-940-Florida-Red-Scott-Biciclette-1_360x.jpg?v=1743244456";

const mtbImages = [
  "https://cdn.shopify.com/s/files/1/0532/7139/6534/files/Scott-Scale-925-Candy-Yellow-Flakes-Scott-Biciclet-0_360x.jpg?v=1743245987",
  "https://cdn.shopify.com/s/files/1/0532/7139/6534/files/Bici-MTB-Front-Focus-Whistler-3.5-2022-Biciclett-0_360x.jpg?v=1743245987",
  "https://cdn.shopify.com/s/files/1/0532/7139/6534/files/Bici-MTB-Full-Mondraker-Foxy-Carbon-R-2023-Bicic-0_360x.jpg?v=1743245987",
  "https://cdn.shopify.com/s/files/1/0532/7139/6534/files/Bici-MTB-Full-Santa-Cruz-Hightower-3-Carbon-C-S-2023-Bici-0_360x.jpg?v=1743245987",
];

function getRandomMtbImage() {
  const index = Math.floor(Math.random() * mtbImages.length);
  return mtbImages[index];
}

if (!productId) {
  const randomImage = getRandomMtbImage();
  imageUrlField.value = randomImage;
  previewImg.src = randomImage;
}

if (productId) {
  fetch(endpoint + productId, { headers })
    .then((res) => {
      if (!res.ok) throw new Error("Prodotto non trovato");
      return res.json();
    })
    .then((p) => {
      nameInput.value = p.name;
      descriptionInput.value = p.description;
      priceInput.value = p.price;
      document.getElementById("brand").value = p.brand;
      imageUrlField.value = p.imageUrl;
      previewImg.src = p.imageUrl;
      document.getElementById("deleteBtn").style.display = "inline-block";
    })
    .catch((err) => {
      console.error("Errore nel recupero:", err);
      alert("Errore nel caricamento del prodotto.");
    });
}

function updatePreviewAndFields() {
  const name = nameInput.value.trim();

  let newUrl = fallbackUrl;

  if (name.length > 2) {
    newUrl = getRandomMtbImage();
  }

  imageUrlField.value = newUrl;
  previewImg.src = newUrl;

  const lowerName = name.toLowerCase();
  let price = 0;
  if (lowerName.includes("pro")) {
    price = 1200;
  } else if (lowerName.includes("basic")) {
    price = 300;
  } else if (name.length > 0) {
    price = 600;
  }
  priceInput.value = price.toFixed(2);

  let description = "";
  if (lowerName.includes("pro")) {
    description =
      "Bici professionale con componenti di alta qualità e prestazioni elevate.";
  } else if (lowerName.includes("basic")) {
    description = "Bici economica adatta per principianti e uso cittadino.";
  } else if (name.length > 0) {
    description = "Bici versatile adatta a molteplici terreni e usi.";
  }
  descriptionInput.value = description;
}

nameInput.addEventListener("input", updatePreviewAndFields);

// Gestione invio form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bike = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    brand: document.getElementById("brand").value.trim(),
    imageUrl: imageUrlField.value.trim(),
    price: parseFloat(priceInput.value.trim()),
  };

  try {
    let response;
    if (productId) {
      response = await fetch(endpoint + productId, {
        method: "PUT",
        headers,
        body: JSON.stringify(bike),
      });
    } else {
      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(bike),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Errore API: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log("Risposta API:", data);
    alert(productId ? "Prodotto aggiornato!" : "Prodotto creato!");
    location.href = "index.html";
  } catch (err) {
    console.error("Errore salvataggio:", err);
    alert("Errore durante il salvataggio: " + err.message);
  }
});
