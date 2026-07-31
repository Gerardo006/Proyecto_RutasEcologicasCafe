/**
 * Paleta de colores para diferenciar visualmente cada ruta alternativa en el mapa
 * y en la tabla comparativa. La ruta recomendada SIEMPRE usa el verde reservado
 * (COLOR_RUTA_RECOMENDADA), sin importar su posición en la lista.
 */
export const PALETA_COLORES_RUTAS = [
  '#1f77b4', // azul
  '#ff7f0e', // naranja
  '#9467bd', // morado
  '#e377c2', // rosa
  '#17becf', // cian
  '#8c564b', // marrón
  '#bcbd22', // oliva
  '#d62728', // rojo
];

export const COLOR_RUTA_RECOMENDADA = '#2e7d32';

/**
 * Devuelve el color asignado a una ruta según su posición en la lista de
 * rutas evaluadas. Si es la ruta recomendada, siempre devuelve el verde
 * reservado para destacarla del resto.
 */
export function obtenerColorRuta(index, esRecomendada) {
  if (esRecomendada) return COLOR_RUTA_RECOMENDADA;
  return PALETA_COLORES_RUTAS[index % PALETA_COLORES_RUTAS.length];
}
