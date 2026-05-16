const axios = require('axios');

exports.getCoordinates = async (locationName) => {

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "bus-routes-api"
    }
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("No se pudieron obtener coordenadas");
  }

  return {
    latitude: parseFloat(response.data[0].lat),
    longitude: parseFloat(response.data[0].lon)
  };
};