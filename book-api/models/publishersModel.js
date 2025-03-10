const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const publishersFilePath = path.join(__dirname, '../data/publishers.json');

class PublishersModel {
  static async getAllPublishers() {
    try {
      const data = await fs.readFile(publishersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo publishers.json:', error);
      throw new Error('Error al obtener las editoriales');
    }
  }

  static async getPublisherById(id) {
    try {
      const publishers = await this.getAllPublishers();
      return publishers.find(p => p.id === parseInt(id));
    } catch (error) {
      console.error('Error al buscar la editorial:', error);
      throw new Error('Error al obtener la editorial');
    }
  }

  static async searchPublishers(criteria) {
    try {
      const publishers = await this.getAllPublishers();
      return publishers.filter(publisher => {
        const matchesName = criteria.name ? 
          publisher.name.toLowerCase().includes(criteria.name.toLowerCase()) : true;
        
        const matchesCountry = criteria.country ? 
          publisher.country.toLowerCase() === criteria.country.toLowerCase() : true;
        
        const matchesFounded = criteria.founded ? 
          publisher.founded === parseInt(criteria.founded) : true;

        return matchesName && matchesCountry && matchesFounded;
      });
    } catch (error) {
      console.error('Error al buscar editoriales:', error);
      throw new Error('Error al buscar editoriales');
    }
  }

  static async getPublishersByCountry(country) {
    try {
      const publishers = await this.getAllPublishers();
      return publishers.filter(p => 
        p.country.toLowerCase() === country.toLowerCase()
      );
    } catch (error) {
      console.error('Error al buscar editoriales por país:', error);
      throw new Error('Error al buscar editoriales por país');
    }
  }

  static async createPublisher(publisherData) {
    try {
      const publishers = await this.getAllPublishers();
      const newPublisher = {
        id: publishers.length > 0 ? Math.max(...publishers.map(p => p.id)) + 1 : 1,
        name: publisherData.name,
        country: publisherData.country,
        founded: parseInt(publisherData.founded),
        website: publisherData.website || '',
        genres: publisherData.genres || [],
        description: publisherData.description || ''
      };
      publishers.push(newPublisher);
      await fs.writeFile(publishersFilePath, JSON.stringify(publishers, null, 2));
      return newPublisher;
    } catch (error) {
      console.error('Error al crear la editorial:', error);
      throw new Error('Error al crear la editorial');
    }
  }

  static async updatePublisher(id, publisherData) {
    try {
      const publishers = await this.getAllPublishers();
      const index = publishers.findIndex(p => p.id === parseInt(id));
      if (index === -1) return null;
      
      publishers[index] = { 
        ...publishers[index], 
        ...publisherData,
        id: publishers[index].id // Mantener el ID original
      };
      
      await fs.writeFile(publishersFilePath, JSON.stringify(publishers, null, 2));
      return publishers[index];
    } catch (error) {
      console.error('Error al actualizar la editorial:', error);
      throw new Error('Error al actualizar la editorial');
    }
  }

  static async deletePublisher(id) {
    try {
      const publishers = await this.getAllPublishers();
      const filteredPublishers = publishers.filter(p => p.id !== parseInt(id));
      if (filteredPublishers.length === publishers.length) return false;
      
      await fs.writeFile(publishersFilePath, JSON.stringify(filteredPublishers, null, 2));
      return true;
    } catch (error) {
      console.error('Error al eliminar la editorial:', error);
      throw new Error('Error al eliminar la editorial');
    }
  }

  static async addGenre(id, genre) {
    try {
      const publishers = await this.getAllPublishers();
      const index = publishers.findIndex(p => p.id === parseInt(id));
      if (index === -1) return null;

      if (!publishers[index].genres) {
        publishers[index].genres = [];
      }
      
      if (!publishers[index].genres.includes(genre)) {
        publishers[index].genres.push(genre);
        await fs.writeFile(publishersFilePath, JSON.stringify(publishers, null, 2));
      }
      
      return publishers[index];
    } catch (error) {
      console.error('Error al añadir género a la editorial:', error);
      throw new Error('Error al añadir género a la editorial');
    }
  }
}

module.exports = PublishersModel; 