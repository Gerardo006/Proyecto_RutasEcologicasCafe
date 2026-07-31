/**
 * Calcula un índice de riesgo de deterioro de la pulpa de café (0 a 100).
 *
 * La pulpa de café es altamente perecedera: comienza procesos de fermentación
 * y descomposición aceleran con:
 *  - Mayor tiempo de transporte (más horas = más fermentación).
 *  - Temperaturas ambiente altas (aceleran actividad microbiana).
 *  - Alta humedad relativa y lluvia (favorecen fermentación anaerobia y hongos).
 *  - Mal estado de la vía (más vibración/compactación, favorece exudado de líquidos).
 *  - Grandes variaciones de altitud (cambios bruscos de temperatura por gradiente térmico).
 */
function calcularRiesgoDeterioro({
  duracionMin,
  temperatura,
  humedad,
  lluviaMm,
  factorRiesgoCarretera,
  variacionAltitud,
}) {
  // Normalización de cada componente a una escala 0-1
  const tiempoNorm = clamp(duracionMin / 180, 0, 1); // 3 horas como referencia de riesgo máximo
  const temperaturaNorm = clamp((temperatura - 15) / 20, 0, 1); // >35°C = riesgo máximo, <15°C = mínimo
  const humedadNorm = clamp((humedad - 40) / 60, 0, 1); // >100% saturación teórica
  const lluviaNorm = clamp(lluviaMm / 15, 0, 1); // >=15mm/h se considera lluvia fuerte
  const carreteraNorm = clamp(factorRiesgoCarretera, 0, 1);
  const altitudNorm = clamp(variacionAltitud / 800, 0, 1); // 800m de variación como referencia alta

  // Pesos relativos de cada factor en el riesgo total (suman 1.0)
  const pesos = {
    tiempo: 0.3,
    temperatura: 0.2,
    humedad: 0.15,
    lluvia: 0.15,
    carretera: 0.1,
    altitud: 0.1,
  };

  const riesgo =
    tiempoNorm * pesos.tiempo +
    temperaturaNorm * pesos.temperatura +
    humedadNorm * pesos.humedad +
    lluviaNorm * pesos.lluvia +
    carreteraNorm * pesos.carretera +
    altitudNorm * pesos.altitud;

  return Number((riesgo * 100).toFixed(1)); // 0 a 100
}

function clamp(valor, min, max) {
  return Math.min(Math.max(valor, min), max);
}

module.exports = { calcularRiesgoDeterioro };
