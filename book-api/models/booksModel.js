const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const booksFilePath = path.join(__dirname, '../data/books.json');

class BooksModel {
  static async getAllBooks() {
    try {
      const data = await fs.readFile(booksFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo books.json:', error);
      throw new Error('Error al obtener los libros');
    }
  }

  static async getBookById(id) {
    try {
      const books = await this.getAllBooks();
      return books.find(b => b.id === parseInt(id));
    } catch (error) {
      console.error('Error al buscar el libro:', error);
      throw new Error('Error al obtener el libro');
    }
  }

  static async createBook(bookData) {
    try {
      const books = await this.getAllBooks();
      const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        ...bookData
      };
      books.push(newBook);
      await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
      return newBook;
    } catch (error) {
      console.error('Error al crear el libro:', error);
      throw new Error('Error al crear el libro');
    }
  }

  static async updateBook(id, bookData) {
    try {
      const books = await this.getAllBooks();
      const index = books.findIndex(b => b.id === parseInt(id));
      if (index === -1) return null;
      
      books[index] = { ...books[index], ...bookData };
      await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
      return books[index];
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      throw new Error('Error al actualizar el libro');
    }
  }

  static async deleteBook(id) {
    try {
      const books = await this.getAllBooks();
      const filteredBooks = books.filter(b => b.id !== parseInt(id));
      if (filteredBooks.length === books.length) return false;
      
      await fs.writeFile(booksFilePath, JSON.stringify(filteredBooks, null, 2));
      return true;
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      throw new Error('Error al eliminar el libro');
    }
  }
}

module.exports = BooksModel; 