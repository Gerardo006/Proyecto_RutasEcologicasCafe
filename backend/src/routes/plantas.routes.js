const express = require('express');
const router = express.Router();
const Planta = require('../models/Planta');
const { obtenerAltitudes } = require('../services/elevationService');

// Listar todas las plantas de procesamiento
router.get('/', async (req, res, next) => {
  try {
    const plantas = await Planta.find().sort({ createdAt: -1 });
    res.json(plantas);
  } catch (error) {
    next(error);
  }
});

// Obtener una planta por ID
router.get('/:id', async (req, res, next) => {
  try {
    const planta = await Planta.findById(req.params.id);
    if (!planta) return res.status(404).json({ error: true, mensaje: 'Planta no encontrada' });
    res.json(planta);
  } catch (error) {
    next(error);
  }
});

// Registrar una nueva planta de procesamiento
router.post('/', async (req, res, next) => {
  try {
    const { nombre, ubicacion, capacidadRecepcionKgDia, contacto } = req.body;

    if (!nombre || !ubicacion?.lat || !ubicacion?.lng) {
      return res.status(400).json({ error: true, mensaje: 'nombre y ubicacion (lat, lng) son obligatorios' });
    }

    let altitud = req.body.altitud;
    if (altitud === undefined) {
      const [alt] = await obtenerAltitudes([{ lat: ubicacion.lat, lng: ubicacion.lng }]);
      altitud = alt;
    }

    const planta = await Planta.create({
      nombre,
      ubicacion,
      altitud,
      capacidadRecepcionKgDia,
      contacto,
    });

    res.status(201).json(planta);
  } catch (error) {
    next(error);
  }
});

// Actualizar una planta
router.put('/:id', async (req, res, next) => {
  try {
    const planta = await Planta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!planta) return res.status(404).json({ error: true, mensaje: 'Planta no encontrada' });
    res.json(planta);
  } catch (error) {
    next(error);
  }
});

// Eliminar una planta
router.delete('/:id', async (req, res, next) => {
  try {
    const planta = await Planta.findByIdAndDelete(req.params.id);
    if (!planta) return res.status(404).json({ error: true, mensaje: 'Planta no encontrada' });
    res.json({ mensaje: 'Planta eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
