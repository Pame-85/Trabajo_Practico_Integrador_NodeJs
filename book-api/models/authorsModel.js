const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const authorsFilePath = path.join(__dirname, '../data/authors.json');

class AuthorsModel {
  static async getAllAuthors() {
    try {
      const data = await fs.readFile(authorsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo authors.json:', error);
      throw new Error('Error al obtener los autores');
    }
  }

  static async getAuthorById(id) {
    try {
      const authors = await this.getAllAuthors();
      return authors.find(a => a.id === parseInt(id));
    } catch (error) {
      console.error('Error al buscar el autor:', error);
      throw new Error('Error al obtener el autor');
    }
  }

  static async searchAuthors(criteria) {
    try {
      const authors = await this.getAllAuthors();
      return authors.filter(author => {
        const matchesName = criteria.name ? 
          author.name.toLowerCase().includes(criteria.name.toLowerCase()) : true;
        
        const matchesNationality = criteria.nationality ? 
          author.nationality.toLowerCase() === criteria.nationality.toLowerCase() : true;
        
        const matchesBirthYear = criteria.birthYear ? 
          author.birthYear === parseInt(criteria.birthYear) : true;

        return matchesName && matchesNationality && matchesBirthYear;
      });
    } catch (error) {
      console.error('Error al buscar autores:', error);
      throw new Error('Error al buscar autores');
    }
  }

  static async getAuthorsByNationality(nationality) {
    try {
      const authors = await this.getAllAuthors();
      return authors.filter(a => 
        a.nationality.toLowerCase() === nationality.toLowerCase()
      );
    } catch (error) {
      console.error('Error al buscar autores por nacionalidad:', error);
      throw new Error('Error al buscar autores por nacionalidad');
    }
  }

  static async createAuthor(authorData) {
    try {
      const authors = await this.getAllAuthors();
      const newAuthor = {
        id: authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1,
        name: authorData.name,
        nationality: authorData.nationality,
        birthYear: parseInt(authorData.birthYear),
        biography: authorData.biography || '',
        awards: authorData.awards || []
      };
      authors.push(newAuthor);
      await fs.writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
      return newAuthor;
    } catch (error) {
      console.error('Error al crear el autor:', error);
      throw new Error('Error al crear el autor');
    }
  }

  static async updateAuthor(id, authorData) {
    try {
      const authors = await this.getAllAuthors();
      const index = authors.findIndex(a => a.id === parseInt(id));
      if (index === -1) return null;
      
      authors[index] = { 
        ...authors[index], 
        ...authorData,
        id: authors[index].id // Mantener el ID original
      };
      
      await fs.writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
      return authors[index];
    } catch (error) {
      console.error('Error al actualizar el autor:', error);
      throw new Error('Error al actualizar el autor');
    }
  }

  static async deleteAuthor(id) {
    try {
      const authors = await this.getAllAuthors();
      const filteredAuthors = authors.filter(a => a.id !== parseInt(id));
      if (filteredAuthors.length === authors.length) return false;
      
      await fs.writeFile(authorsFilePath, JSON.stringify(filteredAuthors, null, 2));
      return true;
    } catch (error) {
      console.error('Error al eliminar el autor:', error);
      throw new Error('Error al eliminar el autor');
    }
  }

  static async addAward(id, award) {
    try {
      const authors = await this.getAllAuthors();
      const index = authors.findIndex(a => a.id === parseInt(id));
      if (index === -1) return null;

      if (!authors[index].awards) {
        authors[index].awards = [];
      }
      
      authors[index].awards.push(award);
      await fs.writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
      return authors[index];
    } catch (error) {
      console.error('Error al añadir premio al autor:', error);
      throw new Error('Error al añadir premio al autor');
    }
  }
}

module.exports = AuthorsModel; 