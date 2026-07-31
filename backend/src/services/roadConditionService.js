/**
 * Servicio de estado de carreteras.
 *
 * No existe una API pública gratuita estándar para "estado físico de la vía"
 * (pavimentada/destapada, huecos, derrumbes) en toda Latinoamérica. Este servicio
 * usa una heurística basada en la VELOCIDAD PROMEDIO real reportada por OSRM
 * (distancia / duración): vías en buen estado (pavimentadas, nacionales) permiten
 * mayor velocidad promedio; vías destapadas, rurales o montañosas obligan a
 * velocidades bajas. Es una heurística razonable porque OSRM ya modela límites de
 * velocidad y tipo de vía de OpenStreetMap al calcular la duración del trayecto.
 *
 * Para una integración más precisa en producción, esto puede sustituirse o
 * complementarse con datos reales de superficie vial, por ejemplo consultando el
 * tag `surface` de OpenStreetMap vía la Overpass API, reportes de INVÍAS, o un
 * sistema propio de reportes viales alimentado por los conductores.
 */

const UMBRAL_BUENO_KMH = 55; // vías pavimentadas/nacionales normalmente permiten esta velocidad o más
const UMBRAL_REGULAR_KMH = 32; // vías secundarias/mixtas

/**
 * Evalúa el estado de la carretera a partir de la velocidad promedio de la ruta.
 * @param {{distanciaKm:number, duracionMin:number}} ruta
 * Retorna: 'bueno' | 'regular' | 'malo' junto con un factor de riesgo 0-1.
 */
function evaluarEstadoCarretera(ruta) {
  const horas = ruta.duracionMin / 60;
  const velocidadPromedioKmh = horas > 0 ? ruta.distanciaKm / horas : 0;

  if (velocidadPromedioKmh >= UMBRAL_BUENO_KMH) {
    return { estado: 'bueno', factorRiesgo: 0.15, velocidadPromedioKmh: round1(velocidadPromedioKmh) };
  }
  if (velocidadPromedioKmh >= UMBRAL_REGULAR_KMH) {
    return { estado: 'regular', factorRiesgo: 0.5, velocidadPromedioKmh: round1(velocidadPromedioKmh) };
  }
  return { estado: 'malo', factorRiesgo: 0.85, velocidadPromedioKmh: round1(velocidadPromedioKmh) };
}

function round1(n) {
  return Number(n.toFixed(1));
}

module.exports = { evaluarEstadoCarretera };
