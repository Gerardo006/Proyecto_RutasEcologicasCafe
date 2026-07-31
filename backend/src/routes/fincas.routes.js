const express = require('express');
const router = express.Router();
const Finca = require('../models/Finca');
const { obtenerAltitudes } = require('../services/elevationService');

// Listar todas las fincas
router.get('/', async (req, res, next) => {
  try {
    const fincas = await Finca.find().sort({ createdAt: -1 });
    res.json(fincas);
  } catch (error) {
    next(error);
  }
});

// Obtener una finca por ID
router.get('/:id', async (req, res, next) => {
  try {
    const finca = await Finca.findById(req.params.id);
    if (!finca) return res.status(404).json({ error: true, mensaje: 'Finca no encontrada' });
    res.json(finca);
  } catch (error) {
    next(error);
  }
});

// Registrar una nueva finca
router.post('/', async (req, res, next) => {
  try {
    const { nombre, propietario, ubicacion, produccionEstimadaKgDia, contacto } = req.body;

    if (!nombre || !ubicacion?.lat || !ubicacion?.lng) {
      return res.status(400).json({ error: true, mensaje: 'nombre y ubicacion (lat, lng) son obligatorios' });
    }

    // Calcula automáticamente la altitud de la finca si no se especifica
    let altitud = req.body.altitud;
    if (altitud === undefined) {
      const [alt] = await obtenerAltitudes([{ lat: ubicacion.lat, lng: ubicacion.lng }]);
      altitud = alt;
    }

    const finca = await Finca.create({
      nombre,
      propietario,
      ubicacion,
      altitud,
      produccionEstimadaKgDia,
      contacto,
    });

    res.status(201).json(finca);
  } catch (error) {
    next(error);
  }
});

// Actualizar una finca
router.put('/:id', async (req, res, next) => {
  try {
    const finca = await Finca.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!finca) return res.status(404).json({ error: true, mensaje: 'Finca no encontrada' });
    res.json(finca);
  } catch (error) {
    next(error);
  }
});

// Eliminar una finca
router.delete('/:id', async (req, res, next) => {
  try {
    const finca = await Finca.findByIdAndDelete(req.params.id);
    if (!finca) return res.status(404).json({ error: true, mensaje: 'Finca no encontrada' });
    res.json({ mensaje: 'Finca eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
