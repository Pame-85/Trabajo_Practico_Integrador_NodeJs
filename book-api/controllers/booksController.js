const express = require('express');
const router = express.Router();
const BooksModel = require('../models/booksModel');

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await BooksModel.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
});

// Obtener un libro por ID
router.get('/:id', async (req, res) => {
  try {
    const book = await BooksModel.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el libro' });
  }
});

module.exports = router; 