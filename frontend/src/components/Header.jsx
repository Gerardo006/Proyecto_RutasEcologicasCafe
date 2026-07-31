import React from 'react';

export default function Header() {
  return (
    <div className="app-header">
      <span className="kicker">🌱 Logística sostenible</span>
      <h1>☕ Ruta Ecológica para Transporte de Pulpa de Café</h1>
      <p>
        Selecciona el origen (finca) y destino (planta de procesamiento) para calcular
        automáticamente la ruta más ecológica según distancia, clima, altitud, estado de la vía,
        emisiones de CO₂ y riesgo de deterioro de la pulpa.
      </p>
    </div>
  );
}
