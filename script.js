// URL de la API de CoinGecko para obtener los precios de criptomonedas
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,litecoin,ripple,cardano,dogecoin,polkadot,uniswap,binancecoin,solana&order=market_cap_desc';

// Función para obtener datos de la API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Obtener el cuerpo de la tabla
    const tableBody = document.getElementById("crypto-table-body");
    data.forEach(crypto => {
      const row = document.createElement("tr");

      // Crear celdas con la información de cada criptomoneda
      row.innerHTML = `
        <td>${crypto.name}</td>
        <td>${crypto.current_price.toFixed(2)} USD</td>
        <td>${crypto.price_change_percentage_24h.toFixed(2)}%</td>
        <td>${crypto.total_volume.toLocaleString()} USD</td>
        <td>${crypto.circulating_supply.toLocaleString()}</td>
        <td>Proyección 5 días: ${getPricePrediction(crypto.name)}</td>
        <td>${getRecommendation(crypto.price_change_percentage_24h)}</td>
        <td>${recommendBuyOrNot(crypto.price_change_percentage_24h)}</td>
      `;

      // Añadir la fila a la tabla
      tableBody.appendChild(row);
    });

    // Crear el gráfico con los datos de las criptomonedas
    createPriceChart(data);
  })
  .catch(error => {
    console.error("Error al cargar los datos de la API:", error);
  });

// Función para generar una proyección ficticia de 5 días
function getPricePrediction(cryptoName) {
  if (cryptoName === "Bitcoin") return "Posible aumento de 3%";
  if (cryptoName === "Ethereum") return "Posible aumento de 5%";
  if (cryptoName === "Dogecoin") return "Posible aumento de 8%";
  if (cryptoName === "Cardano") return "Posible aumento de 4%";
  return "Proyección incierta";
}

// Función para dar recomendaciones de compra basadas en el cambio de 24 horas
function getRecommendation(changePercentage) {
  if (changePercentage > 5) {
    return "Recomendación: Comprar (Aumento considerable)";
  } else if (changePercentage < -5) {
    return "Recomendación: No comprar (Gran caída)";
  } else if (changePercentage > 0) {
    return "Recomendación: Comprar con cautela";
  } else {
    return "Recomendación: Esperar";
  }
}

// Función para recomendar si se debe comprar o no basado en el cambio porcentual
function recommendBuyOrNot(changePercentage) {
  if (changePercentage > 5) {
    return "Comprar ahora!";
  } else if (changePercentage < -5) {
    return "No comprar";
  } else {
    return "Esperar más información";
  }
}

// Función para crear el gráfico de precios
function createPriceChart(data) {
  const ctx = document.getElementById('priceChart').getContext('2d');
  const labels = data.map(crypto => crypto.name);
  const prices = data.map(crypto => crypto.current_price);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Precio de criptomonedas (USD)',
        data: prices,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}