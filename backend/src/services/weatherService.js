const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Consulta el clima actual en un punto geográfico.
 * @param {{lat:number, lng:number}} punto
 */
async function obtenerClima(punto) {
  if (!OPENWEATHER_API_KEY) {
    return simularClima();
  }

  try {
    const { data } = await axios.get(WEATHER_URL, {
      params: {
        lat: punto.lat,
        lon: punto.lng,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'es',
      },
    });

    return {
      descripcion: data.weather?.[0]?.description || 'No disponible',
      temperatura: data.main?.temp ?? null,
      humedad: data.main?.humidity ?? null,
      lluviaMm: data.rain?.['1h'] ?? 0,
      viento: data.wind?.speed ?? null,
    };
  } catch (error) {
    console.error('Error consultando OpenWeatherMap:', error.message);
    return simularClima();
  }
}

/**
 * Obtiene el clima promedio a lo largo de varios puntos de una ruta.
 */
async function obtenerClimaPromedioRuta(puntos) {
  const resultados = await Promise.all(puntos.map((p) => obtenerClima(p)));
  const validos = resultados.filter((r) => r.temperatura !== null);
  if (validos.length === 0) return simularClima();

  const promedio = (campo) =>
    validos.reduce((acc, r) => acc + (r[campo] || 0), 0) / validos.length;

  return {
    descripcion: validos[Math.floor(validos.length / 2)].descripcion,
    temperatura: Number(promedio('temperatura').toFixed(1)),
    humedad: Number(promedio('humedad').toFixed(1)),
    lluviaMm: Number(promedio('lluviaMm').toFixed(2)),
    viento: Number(promedio('viento').toFixed(1)),
  };
}

/** Clima simulado para modo demo sin API key */
function simularClima() {
  const opciones = [
    { descripcion: 'cielo claro', temperatura: 24, humedad: 55, lluviaMm: 0, viento: 2 },
    { descripcion: 'nubes dispersas', temperatura: 21, humedad: 70, lluviaMm: 0.5, viento: 3 },
    { descripcion: 'lluvia ligera', temperatura: 19, humedad: 85, lluviaMm: 3.2, viento: 4 },
    { descripcion: 'tormenta', temperatura: 18, humedad: 92, lluviaMm: 12, viento: 6 },
  ];
  return opciones[Math.floor(Math.random() * opciones.length)];
}

module.exports = { obtenerClima, obtenerClimaPromedioRuta };
