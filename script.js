const API_KEY = "uDZicaK3xrGEdJV93SPObkNSTxmDG6RbxLtKYaEg";

const dataBusca = document.getElementById("dataBusca");
const resultado = document.getElementById("resultado");

const totalSpan = document.getElementById("total");
const perigososSpan = document.getElementById("perigosos");
const proximoSpan = document.getElementById("proximo");

dataBusca.value = new Date().toISOString().split("T")[0];

document
  .getElementById("buscarBtn")
  .addEventListener("click", buscarAsteroides);

async function buscarAsteroides() {

  const data = dataBusca.value;

  const url =
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${data}&end_date=${data}&api_key=${API_KEY}`;

  try {

    resultado.innerHTML =
      "<tr><td colspan='4'>Carregando...</td></tr>";

    const resposta = await fetch(url);

    const dados = await resposta.json();

    const lista = dados.near_earth_objects[data];

    resultado.innerHTML = "";

    let perigosos = 0;
    let menorDistancia = Infinity;

    lista.forEach(ast => {

      const distancia =
        Number(ast.close_approach_data[0]
        .miss_distance.kilometers);

      const diametro =
        ast.estimated_diameter
        .meters
        .estimated_diameter_max;

      if (
        ast.is_potentially_hazardous_asteroid
      ) {
        perigosos++;
      }

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
      }

      resultado.innerHTML += `
        <tr>
          <td>${ast.name}</td>
          <td>${diametro.toFixed(2)} m</td>
          <td>${distancia.toLocaleString()} km</td>
          <td class="${
            ast.is_potentially_hazardous_asteroid
              ? "perigoso"
              : "seguro"
          }">
            ${
              ast.is_potentially_hazardous_asteroid
                ? "⚠️ Sim"
                : "✅ Não"
            }
          </td>
        </tr>
      `;
    });

    totalSpan.textContent = lista.length;
    perigososSpan.textContent = perigosos;
    proximoSpan.textContent =
      menorDistancia.toLocaleString() + " km";

  } catch (erro) {

    resultado.innerHTML =
      "<tr><td colspan='4'>Erro ao carregar dados.</td></tr>";

    console.error(erro);
  }
}

buscarAsteroides();

// ================================
// GALERIA DE IMAGENS NASA
// ================================

const searchInput = document.getElementById("searchInput");
const galleryGrid = document.getElementById("galleryGrid");

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    buscarImagensNASA();
  }
});

async function buscarImagensNASA() {

  const termo = searchInput.value.trim();

  if (!termo) return;

  galleryGrid.innerHTML =
    "<p>Carregando imagens...</p>";

  try {

    const resposta = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(termo)}&media_type=image`
    );

    const dados = await resposta.json();

    const imagens =
      dados.collection.items.slice(0, 12);

    galleryGrid.innerHTML = "";

    if (imagens.length === 0) {

      galleryGrid.innerHTML =
        "<p>Nenhuma imagem encontrada.</p>";

      return;
    }

    imagens.forEach(item => {

      const imagem = item.links?.[0]?.href;

      const titulo =
        item.data?.[0]?.title || "Sem título";

      const descricao =
        item.data?.[0]?.description || "";

      if (!imagem) return;

      galleryGrid.innerHTML += `
        <div class="gallery-card">

          <img src="${imagem}" alt="${titulo}">

          <div class="gallery-content">

            <h3>${titulo}</h3>

            <p>
              ${descricao.substring(0, 150)}...
            </p>

          </div>

        </div>
      `;
    });

  } catch (erro) {

    console.error(erro);

    galleryGrid.innerHTML =
      "<p>Erro ao carregar imagens.</p>";
  }
}