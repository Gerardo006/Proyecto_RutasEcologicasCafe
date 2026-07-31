const mongoose = require('mongoose');

const FincaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    propietario: { type: String, trim: true },
    ubicacion: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      direccion: { type: String, trim: true },
    },
    altitud: { type: Number }, // msnm, se puede calcular con Google Elevation API
    produccionEstimadaKgDia: { type: Number, default: 0 },
    contacto: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Finca', FincaSchema);
