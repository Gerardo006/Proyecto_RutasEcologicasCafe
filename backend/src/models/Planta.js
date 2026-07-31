const mongoose = require('mongoose');

const PlantaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    ubicacion: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      direccion: { type: String, trim: true },
    },
    altitud: { type: Number },
    capacidadRecepcionKgDia: { type: Number, default: 0 },
    contacto: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Planta', PlantaSchema);
