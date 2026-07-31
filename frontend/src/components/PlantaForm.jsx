import React, { useState } from 'react';
import { crearPlanta } from '../api/api';

export default function PlantaForm({ puntoSeleccionado, onCreada }) {
  const [form, setForm] = useState({
    nombre: '',
    lat: puntoSeleccionado?.lat || '',
    lng: puntoSeleccionado?.lng || '',
    capacidadRecepcionKgDia: '',
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
      const nuevaPlanta = await crearPlanta({
        nombre: form.nombre,
        ubicacion: { lat: Number(form.lat), lng: Number(form.lng) },
        capacidadRecepcionKgDia: Number(form.capacidadRecepcionKgDia) || 0,
        contacto: form.contacto,
      });
      setMensaje('✅ Planta registrada correctamente');
      onCreada?.(nuevaPlanta);
    } catch (error) {
      setMensaje('❌ Error al registrar la planta: ' + (error.response?.data?.mensaje || error.message));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>🏭 Registrar Planta de Procesamiento</h2>

      <label>Nombre de la planta</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} required />

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

      <label>Capacidad de recepción (kg/día)</label>
      <input
        name="capacidadRecepcionKgDia"
        type="number"
        value={form.capacidadRecepcionKgDia}
        onChange={handleChange}
      />

      <label>Contacto</label>
      <input name="contacto" value={form.contacto} onChange={handleChange} />

      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Registrar planta'}
      </button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
