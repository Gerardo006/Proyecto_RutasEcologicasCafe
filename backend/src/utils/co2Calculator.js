/**
 * Calcula las emisiones estimadas de CO2 para recorrer una ruta.
 *
 * Fórmula base: emisiones (kg) = distancia (km) * factor de emisión (kg CO2/km)
 * El factor de emisión se ajusta según el estado de la carretera, ya que vías en
 * mal estado incrementan el consumo de combustible (menor eficiencia, más frenados
 * y aceleraciones, mayor uso de bajas marchas en tramos destapados/montañosos).
 */
function calcularEmisionesCO2({ distanciaKm, factorRiesgoCarretera = 0.3, factorBase }) {
  const FACTOR_BASE = factorBase || Number(process.env.CO2_EMISSION_FACTOR_KG_KM) || 0.9;

  // Penalización de hasta +40% de emisiones por mal estado de la vía
  const factorAjustado = FACTOR_BASE * (1 + factorRiesgoCarretera * 0.4);

  const emisionesKg = distanciaKm * factorAjustado;
  return Number(emisionesKg.toFixed(2));
}

module.exports = { calcularEmisionesCO2 };
