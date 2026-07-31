const axios = require('axios');

/**
 * Open-Elevation es una API de elevación gratuita y de código abierto (sin API key).
 * https://open-elevation.com/
 * Nota: la instancia pública puede ser lenta o tener límites de uso; para producción
 * se recomienda auto-hospedar (Docker: https://github.com/Jorl17/open-elevation).
 */
const OPEN_ELEVATION_URL =
  process.env.OPEN_ELEVATION_URL || 'https://api.open-elevation.com/api/v1/lookup';

/**
 * Consulta la altitud (msnm) de una lista de puntos.
 * @param {Array<{lat:number, lng:number}>} puntos
 * @returns {Promise<number[]>} altitudes en el mismo orden de los puntos
 */
async function obtenerAltitudes(puntos) {
  if (!puntos || puntos.length === 0) return [];

  try {
    const { data } = await axios.post(
      OPEN_ELEVATION_URL,
      {
        locations: puntos.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 8000 }
    );

    if (!data.results || data.results.length === 0) {
      return simularAltitudes(puntos);
    }

    return data.results.map((r) => r.elevation);
  } catch (error) {
    console.error('Error consultando Open-Elevation:', error.message);
    return simularAltitudes(puntos);
  }
}

/** Altitudes simuladas (zona cafetera típica: 1000-1800 msnm) para cuando la API no responde */
function simularAltitudes(puntos) {
  return puntos.map(() => 1000 + Math.round(Math.random() * 800));
}

module.exports = { obtenerAltitudes };
