/**
 * Decodifica una polyline codificada (formato de Google Maps) a un arreglo de {lat, lng}.
 * Referencia del algoritmo: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function decodificarPolyline(encoded) {
  if (!encoded) return [];

  let index = 0;
  let lat = 0;
  let lng = 0;
  const puntos = [];

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    puntos.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return puntos;
}
