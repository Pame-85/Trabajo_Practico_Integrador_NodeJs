const express = require('express');
const router = express.Router();
const AuthorsModel = require('../models/authorsModel');

// Obtener todos los autores
router.get('/', async (req, res) => {
  try {
    const authors = await AuthorsModel.getAllAuthors();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los autores' });
  }
});

// Obtener un autor por ID
router.get('/:id', async (req, res) => {
  try {
    const author = await AuthorsModel.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el autor' });
  }
});

module.exports = router; 