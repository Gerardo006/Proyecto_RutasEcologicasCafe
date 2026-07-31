import React, { useState } from 'react';
import { crearFinca } from '../api/api';

export default function FincaForm({ puntoSeleccionado, onCreada }) {
  const [form, setForm] = useState({
    nombre: '',
    propietario: '',
    lat: puntoSeleccionado?.lat || '',
    lng: puntoSeleccionado?.lng || '',
    produccionEstimadaKgDia: '',
    contacto: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const nuevaFinca = await crearFinca({
        nombre: form.nombre,
        propietario: form.propietario,
        ubicacion: { lat: Number(form.lat), lng: Number(form.lng) },
        produccionEstimadaKgDia: Number(form.produccionEstimadaKgDia) || 0,
        contacto: form.contacto,
      });
      setMensaje('✅ Finca registrada correctamente');
      onCreada?.(nuevaFinca);
    } catch (error) {
      setMensaje('❌ Error al registrar la finca: ' + (error.response?.data?.mensaje || error.message));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>🏡 Registrar Finca Cafetera</h2>

      <label>Nombre de la finca</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} required />

      <label>Propietario</label>
      <input name="propietario" value={form.propietario} onChange={handleChange} />

      <div className="grid-2">
        <div>
          <label>Latitud</label>
          <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required />
        </div>
        <div>
          <label>Longitud</label>
          <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required />
        </div>
      </div>

      <label>Producción estimada (kg/día)</label>
      <input
        name="produccionEstimadaKgDia"
        type="number"
        value={form.produccionEstimadaKgDia}
        onChange={handleChange}
      />

      <label>Contacto</label>
      <input name="contacto" value={form.contacto} onChange={handleChange} />

      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Registrar finca'}
      </button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
