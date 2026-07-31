import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { decodificarPolyline } from '../utils/polyline';
import { obtenerColorRuta } from '../utils/routeColors';

// Corrige el problema conocido de Webpack/CRA con las rutas de los íconos por defecto de Leaflet,
// cargando los íconos desde un CDN público (unpkg) en vez de rutas locales rotas.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const containerStyle = { width: '100%', height: '450px', borderRadius: '12px' };
const centroDefault = [4.8143, -75.6946]; // Zona cafetera (Colombia) como referencia

/**
 * Captura los clics sobre el mapa de Leaflet y determina si corresponden al
 * origen (finca) o al destino (planta), sin necesidad de ninguna API key
 * (usa mosaicos de OpenStreetMap, que son gratuitos y de código abierto).
 */
function ManejadorClicMapa({ origen, destino, onSeleccionar }) {
  useMapEvents({
    click(e) {
      const punto = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (!origen) {
        onSeleccionar({ origen: punto, destino });
      } else if (!destino) {
        onSeleccionar({ origen, destino: punto });
      } else {
        // Reiniciar selección
        onSeleccionar({ origen: punto, destino: null });
      }
    },
  });
  return null;
}

/**
 * Ajusta automáticamente el zoom/centro del mapa cuando cambian origen/destino
 * o cuando se dibujan rutas nuevas sobre el mapa (para que todas queden visibles).
 */
function AjustarVista({ origen, destino, rutasDecodificadas }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;

    if (rutasDecodificadas && rutasDecodificadas.length > 0) {
      const todosLosPuntos = rutasDecodificadas.flatMap((r) =>
        r.puntos.map((p) => [p.lat, p.lng])
      );
      if (todosLosPuntos.length > 0) {
        map.fitBounds(L.latLngBounds(todosLosPuntos), { padding: [40, 40] });
        return;
      }
    }

    if (origen && destino) {
      const bounds = L.latLngBounds([
        [origen.lat, origen.lng],
        [destino.lat, destino.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (origen) {
      map.setView([origen.lat, origen.lng], 12);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origen, destino, rutasDecodificadas]);
  return null;
}

/**
 * Mapa interactivo basado en OpenStreetMap (Leaflet), sin necesidad de ninguna API key:
 * - Primer clic define el ORIGEN (finca).
 * - Segundo clic define el DESTINO (planta).
 * - Un tercer clic reinicia la selección.
 * - Si se reciben rutas evaluadas, se dibujan TODAS sobre el mapa: la recomendada
 *   en verde y con mayor grosor, y cada alternativa con un color distinto.
 * - Se puede hacer clic sobre cualquier ruta dibujada para seleccionarla.
 * Además incluye un formulario para ingresar coordenadas manualmente como alternativa.
 */
export default function MapSelector({
  origen,
  destino,
  onSeleccionar,
  rutas = [],
  rutaRecomendadaId = null,
  rutaSeleccionadaId = null,
  onSeleccionarRuta = () => {},
}) {
  // Decodifica la polyline de cada ruta evaluada y le asigna su color/estilo
  const rutasDecodificadas = useMemo(() => {
    return rutas.map((ruta, index) => {
      const esRecomendada = ruta.id === rutaRecomendadaId;
      return {
        id: ruta.id,
        resumen: ruta.resumen,
        puntos: decodificarPolyline(ruta.polyline),
        color: obtenerColorRuta(index, esRecomendada),
        esRecomendada,
      };
    });
  }, [rutas, rutaRecomendadaId]);

  // Dibuja primero las rutas normales y al final la seleccionada/recomendada,
  // para que siempre queden visibles por encima de las demás.
  const rutasOrdenadasParaDibujar = useMemo(() => {
    return [...rutasDecodificadas].sort((a, b) => {
      const pesoA = a.id === rutaSeleccionadaId ? 2 : a.esRecomendada ? 1 : 0;
      const pesoB = b.id === rutaSeleccionadaId ? 2 : b.esRecomendada ? 1 : 0;
      return pesoA - pesoB;
    });
  }, [rutasDecodificadas, rutaSeleccionadaId]);

  const centroInicial = origen ? [origen.lat, origen.lng] : centroDefault;

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        📍 Haz clic en el mapa: primer clic = <strong>finca (origen)</strong>, segundo clic ={' '}
        <strong>planta (destino)</strong>. Un tercer clic reinicia la selección.
        {rutas.length > 0 && (
          <>
            {' '}
            🖱️ También puedes hacer clic sobre <strong>cualquier ruta dibujada</strong> para
            seleccionarla y ver sus detalles.
          </>
        )}{' '}
        También puedes escribir las coordenadas manualmente abajo.
      </p>

      <MapContainer center={centroInicial} zoom={7} style={containerStyle} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ManejadorClicMapa origen={origen} destino={destino} onSeleccionar={onSeleccionar} />
        <AjustarVista origen={origen} destino={destino} rutasDecodificadas={rutasDecodificadas} />
        {origen && <Marker position={[origen.lat, origen.lng]} title="Finca (origen)" />}
        {destino && <Marker position={[destino.lat, destino.lng]} title="Planta (destino)" />}

        {rutasOrdenadasParaDibujar.map((ruta) => {
          const estaSeleccionada = ruta.id === rutaSeleccionadaId;
          const latLngs = ruta.puntos.map((p) => [p.lat, p.lng]);
          if (latLngs.length === 0) return null;

          return (
            <Polyline
              key={ruta.id}
              positions={latLngs}
              pathOptions={{
                color: ruta.color,
                weight: ruta.esRecomendada ? 7 : estaSeleccionada ? 6 : 4,
                opacity: estaSeleccionada || ruta.esRecomendada ? 0.95 : 0.65,
                dashArray: estaSeleccionada && !ruta.esRecomendada ? '8 6' : null,
                lineCap: 'round',
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  onSeleccionarRuta(ruta.id);
                },
                mouseover: (e) => e.target.setStyle({ opacity: 1 }),
                mouseout: (e) =>
                  e.target.setStyle({
                    opacity: estaSeleccionada || ruta.esRecomendada ? 0.95 : 0.65,
                  }),
              }}
            />
          );
        })}
      </MapContainer>

      {rutasDecodificadas.length > 0 && (
        <div className="leyenda-rutas">
          {rutasDecodificadas.map((ruta) => (
            <button
              key={ruta.id}
              type="button"
              className={`leyenda-item ${ruta.id === rutaSeleccionadaId ? 'activa' : ''}`}
              onClick={() => onSeleccionarRuta(ruta.id)}
            >
              <span className="leyenda-swatch" style={{ backgroundColor: ruta.color }} />
              {ruta.esRecomendada ? '⭐ ' : ''}
              {ruta.resumen}
              {ruta.esRecomendada ? ' (recomendada)' : ''}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <p>
          Origen: {origen ? `${origen.lat.toFixed(5)}, ${origen.lng.toFixed(5)}` : 'no seleccionado'}
          {'  |  '}
          Destino: {destino ? `${destino.lat.toFixed(5)}, ${destino.lng.toFixed(5)}` : 'no seleccionado'}
        </p>
      </div>

      <CoordenadasManualForm origen={origen} destino={destino} onSeleccionar={onSeleccionar} />
    </div>
  );
}

/**
 * Formulario alterno para ingresar las coordenadas de origen y destino a mano,
 * útil si prefieres escribir las coordenadas en vez de hacer clic en el mapa
 * (por ejemplo, copiándolas desde Google Maps o desde el registro de una finca).
 */
function CoordenadasManualForm({ origen, destino, onSeleccionar }) {
  const [form, setForm] = useState({
    origenLat: origen?.lat ?? '',
    origenLng: origen?.lng ?? '',
    destinoLat: destino?.lat ?? '',
    destinoLng: destino?.lng ?? '',
  });
  const [errorLocal, setErrorLocal] = useState(null);

  useEffect(() => {
    setForm({
      origenLat: origen?.lat ?? '',
      origenLng: origen?.lng ?? '',
      destinoLat: destino?.lat ?? '',
      destinoLng: destino?.lng ?? '',
    });
  }, [origen, destino]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAplicar = () => {
    const { origenLat, origenLng, destinoLat, destinoLng } = form;

    if (origenLat === '' || origenLng === '' || destinoLat === '' || destinoLng === '') {
      setErrorLocal('Completa las 4 coordenadas (latitud y longitud de origen y destino).');
      return;
    }

    const nuevoOrigen = { lat: Number(origenLat), lng: Number(origenLng) };
    const nuevoDestino = { lat: Number(destinoLat), lng: Number(destinoLng) };

    if ([nuevoOrigen.lat, nuevoOrigen.lng, nuevoDestino.lat, nuevoDestino.lng].some(Number.isNaN)) {
      setErrorLocal('Las coordenadas deben ser números válidos (ej: 4.8143, -75.6946).');
      return;
    }

    setErrorLocal(null);
    onSeleccionar({ origen: nuevoOrigen, destino: nuevoDestino });
  };

  const handleLimpiar = () => {
    setForm({ origenLat: '', origenLng: '', destinoLat: '', destinoLng: '' });
    onSeleccionar({ origen: null, destino: null });
  };

  return (
    <div style={{ marginTop: 10 }}>
      <h4 style={{ marginBottom: 6 }}>📍 O ingresa las coordenadas manualmente</h4>
      <div className="grid-2">
        <div>
          <label>Latitud finca (origen)</label>
          <input
            name="origenLat"
            type="number"
            step="any"
            placeholder="Ej: 4.8143"
            value={form.origenLat}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Longitud finca (origen)</label>
          <input
            name="origenLng"
            type="number"
            step="any"
            placeholder="Ej: -75.6946"
            value={form.origenLng}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Latitud planta (destino)</label>
          <input
            name="destinoLat"
            type="number"
            step="any"
            placeholder="Ej: 4.9020"
            value={form.destinoLat}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Longitud planta (destino)</label>
          <input
            name="destinoLng"
            type="number"
            step="any"
            placeholder="Ej: -75.8120"
            value={form.destinoLng}
            onChange={handleChange}
          />
        </div>
      </div>

      {errorLocal && <p style={{ color: '#b03a2e' }}>{errorLocal}</p>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={handleAplicar}>
          Usar estas coordenadas
        </button>
        <button type="button" onClick={handleLimpiar} style={{ backgroundColor: '#8a7a68' }}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
