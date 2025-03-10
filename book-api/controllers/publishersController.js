const express = require('express');
const router = express.Router();
const PublishersModel = require('../models/publishersModel');

// Obtener todas las editoriales
router.get('/', async (req, res) => {
  try {
    const publishers = await PublishersModel.getAllPublishers();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las editoriales' });
  }
});

// Obtener una editorial por ID
router.get('/:id', async (req, res) => {
  try {
    const publisher = await PublishersModel.getPublisherById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ error: 'Editorial no encontrada' });
    }
    res.json(publisher);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la editorial' });
  }
});

module.exports = router; 