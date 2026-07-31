import React from 'react';
import { obtenerColorRuta } from '../utils/routeColors';
import { CRITERIOS } from '../utils/criterios';

export default function RouteResults({
  resultado,
  rutaSeleccionadaId,
  onSeleccionarRuta,
  criterioActivo,
  onSeleccionarCriterio,
}) {
  if (!resultado) return null;

  const { rutasEvaluadas, rutaRecomendada } = resultado;

  const rutaActiva =
    rutasEvaluadas.find((r) => r.id === rutaSeleccionadaId) || rutaRecomendada;

  // Etiqueta de "por qué" quedó seleccionada la ruta activa: por un criterio
  // predefinido (botón) o por selección manual (clic directo en el mapa/tabla).
  const criterioInfo = CRITERIOS.find((c) => c.key === criterioActivo);
  const razonSeleccion = criterioInfo
    ? `Seleccionada por: ${criterioInfo.label}`
    : 'Seleccionada manualmente';

  return (
    <div className="card">
      <h2>Resultado de la evaluación</h2>
      <p>
        Se evaluaron <strong>{rutasEvaluadas.length}</strong> rutas alternativas. La ruta más
        ecológica (según el puntaje combinado) es:
      </p>

      <div className="ruta-card recomendada">
        <h3>
          🏆 {rutaRecomendada.resumen}
          <span className={`badge ${rutaRecomendada.estadoCarretera}`}>
            {rutaRecomendada.estadoCarretera.toUpperCase()}
          </span>
        </h3>
        <IndicadoresRuta ruta={rutaRecomendada} />
      </div>

      <h3 style={{ marginTop: 24 }}>🎯 Elegir la ruta por un parámetro específico</h3>
      <p style={{ marginTop: -8, color: '#5b4636', fontSize: 14 }}>
        Ya con las rutas calculadas, puedes ver cuál gana en cada parámetro individual — no
        siempre es la misma ruta que el puntaje ecológico combinado. Al elegir uno, se resalta esa
        ruta tanto en la tabla como en el mapa.
      </p>
      <SelectorCriterios criterioActivo={criterioActivo} onSeleccionarCriterio={onSeleccionarCriterio} />

      <h3 style={{ marginTop: 24 }}>📊 Panel comparativo de rutas</h3>
      <p style={{ marginTop: -8, color: '#5b4636', fontSize: 14 }}>
        También puedes hacer clic directamente en una fila (o en una ruta dentro del mapa) para
        verla en detalle. La fila en verde 🏆 es la ruta más ecológica; la fila con borde azul es
        la que tienes seleccionada actualmente.
      </p>

      <TablaComparativa
        rutas={rutasEvaluadas}
        rutaRecomendadaId={rutaRecomendada.id}
        rutaSeleccionadaId={rutaActiva.id}
        onSeleccionarRuta={onSeleccionarRuta}
      />

      <h3 style={{ marginTop: 24 }}>Detalle de la ruta seleccionada</h3>
      <div
        className={`ruta-card ${rutaActiva.id === rutaRecomendada.id ? 'recomendada' : 'seleccionada'}`}
      >
        <h4>
          {rutaActiva.id === rutaRecomendada.id ? '🏆 ' : '🎯 '}
          {rutaActiva.resumen}
          <span className={`badge ${rutaActiva.estadoCarretera}`}>
            {rutaActiva.estadoCarretera.toUpperCase()}
          </span>
        </h4>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5b4636', fontWeight: 600 }}>
          {razonSeleccion}
        </p>
        <IndicadoresRuta ruta={rutaActiva} />
      </div>

      <h3 style={{ marginTop: 24 }}>Todas las rutas evaluadas</h3>
      {rutasEvaluadas.map((ruta, index) => {
        const esRecomendada = ruta.id === rutaRecomendada.id;
        const estaSeleccionada = ruta.id === rutaActiva.id;
        return (
          <div
            key={ruta.id}
            className={`ruta-card ${esRecomendada ? 'recomendada' : ''} ${
              estaSeleccionada && !esRecomendada ? 'seleccionada' : ''
            }`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSeleccionarRuta && onSeleccionarRuta(ruta.id)}
          >
            <h4>
              <span
                className="leyenda-swatch"
                style={{ backgroundColor: obtenerColorRuta(index, esRecomendada) }}
              />
              {esRecomendada ? '🏆 ' : ''}
              {ruta.resumen}
              <span className={`badge ${ruta.estadoCarretera}`}>
                {ruta.estadoCarretera.toUpperCase()}
              </span>
            </h4>
            <IndicadoresRuta ruta={ruta} />
          </div>
        );
      })}
    </div>
  );
}

/** Fila de botones tipo "pill" para elegir la ruta ganadora de un parámetro individual */
function SelectorCriterios({ criterioActivo, onSeleccionarCriterio }) {
  return (
    <div className="criterios-selector">
      {CRITERIOS.map((c) => (
        <button
          key={c.key}
          type="button"
          className={`criterio-btn ${criterioActivo === c.key ? 'activo' : ''}`}
          onClick={() => onSeleccionarCriterio && onSeleccionarCriterio(c.key)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

/** Tabla comparativa con las estadísticas clave de todas las rutas evaluadas */
function TablaComparativa({ rutas, rutaRecomendadaId, rutaSeleccionadaId, onSeleccionarRuta }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="tabla-comparativa">
        <thead>
          <tr>
            <th></th>
            <th>Ruta</th>
            <th>📏 Distancia</th>
            <th>⏱️ Duración</th>
            <th>⛰️ Altitud prom.</th>
            <th>🍃 CO₂</th>
            <th>⚠️ Riesgo deterioro</th>
            <th>🚦 Estado vía</th>
            <th>🏆 Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((ruta, index) => {
            const esRecomendada = ruta.id === rutaRecomendadaId;
            const estaSeleccionada = ruta.id === rutaSeleccionadaId;
            return (
              <tr
                key={ruta.id}
                className={`fila-ruta ${esRecomendada ? 'fila-recomendada' : ''} ${
                  estaSeleccionada ? 'fila-seleccionada' : ''
                }`}
                onClick={() => onSeleccionarRuta && onSeleccionarRuta(ruta.id)}
              >
                <td>
                  <span
                    className="leyenda-swatch"
                    style={{ backgroundColor: obtenerColorRuta(index, esRecomendada) }}
                  />
                </td>
                <td>
                  {esRecomendada ? '🏆 ' : ''}
                  {ruta.resumen}
                </td>
                <td>{ruta.distanciaKm.toFixed(1)} km</td>
                <td>{Math.round(ruta.duracionMin)} min</td>
                <td>{ruta.altitudPromedio} msnm</td>
                <td>{ruta.emisionesCO2Kg} kg</td>
                <td>{ruta.riesgoDeterioro}/100</td>
                <td>
                  <span className={`badge ${ruta.estadoCarretera}`}>
                    {ruta.estadoCarretera.toUpperCase()}
                  </span>
                </td>
                <td>
                  <strong>{ruta.puntajeEcologico}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IndicadoresRuta({ ruta }) {
  return (
    <div className="indicadores">
      <div className="indicador">📏 Distancia: <strong>{ruta.distanciaKm.toFixed(1)} km</strong></div>
      <div className="indicador">⏱️ Duración: <strong>{Math.round(ruta.duracionMin)} min</strong></div>
      <div className="indicador">⛰️ Altitud prom.: <strong>{ruta.altitudPromedio} msnm</strong></div>
      <div className="indicador">🌦️ Clima: <strong>{ruta.clima.descripcion}</strong> ({ruta.clima.temperatura}°C, {ruta.clima.humedad}% hum.)</div>
      <div className="indicador">🍃 CO₂: <strong>{ruta.emisionesCO2Kg} kg</strong></div>
      <div className="indicador">⚠️ Riesgo deterioro pulpa: <strong>{ruta.riesgoDeterioro}/100</strong></div>
      <div className="indicador" style={{ gridColumn: 'span 3', background: '#fff8e6' }}>
        🏆 Puntaje ecológico (menor = mejor): <strong>{ruta.puntajeEcologico}</strong>
      </div>
    </div>
  );
}
