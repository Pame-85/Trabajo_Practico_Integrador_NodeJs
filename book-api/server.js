/**
 * Servidor TCP para la gestión de libros, autores y editoriales
 * Este servidor implementa un protocolo basado en comandos de texto
 * y respuestas JSON para manejar operaciones CRUD y búsquedas.
 */

const net = require('net');
const BooksModel = require('./models/booksModel');
const AuthorsModel = require('./models/authorsModel');
const PublishersModel = require('./models/publishersModel');

// Configuración del servidor
const PORT = 8080;
const HOST = '127.0.0.1';

// Crear el servidor TCP
const server = net.createServer();

/**
 * Manejador de conexiones de clientes
 * Se ejecuta cada vez que un cliente se conecta al servidor
 * Configura los eventos y el protocolo de comunicación
 */
server.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.remoteAddress);

  // Configurar codificación UTF-8 para manejar caracteres especiales
  socket.setEncoding('utf8');

  // Enviar mensaje de bienvenida con la lista de comandos disponibles
  socket.write(JSON.stringify({
    status: 'success',
    message: 'Bienvenido al servidor de libros. Comandos disponibles:',
    commands: [
      'GET books',
      'GET book <id>',
      'CREATE book <json_data>',
      'UPDATE book <id> <json_data>',
      'DELETE book <id>',
      'GET authors',
      'GET author <id>',
      'SEARCH authors <json_criteria>',
      'GET authors/nationality/<nationality>',
      'CREATE author <json_data>',
      'UPDATE author <id> <json_data>',
      'DELETE author <id>',
      'ADD author/award <id> <award_json>',
      'GET publishers',
      'GET publisher <id>',
      'SEARCH publishers <json_criteria>',
      'GET publishers/country/<country>',
      'CREATE publisher <json_data>',
      'UPDATE publisher <id> <json_data>',
      'DELETE publisher <id>',
      'ADD publisher/genre <id> <genre>'
    ]
  }) + '\n');

  /**
   * Manejador de datos recibidos del cliente
   * Procesa los comandos recibidos y ejecuta las operaciones correspondientes
   */
  socket.on('data', async (data) => {
    try {
      // Parsear el comando recibido
      const command = data.trim().split(' ');
      const action = command[0].toUpperCase();
      const resource = command[1].toLowerCase();

      let response;
      
      // Procesar el comando según la acción y el recurso
      switch (`${action} ${resource}`) {
        // === Operaciones de Libros ===
        case 'GET books':
          response = await BooksModel.getAllBooks();
          break;
        
        case 'GET book':
          const bookId = parseInt(command[2]);
          response = await BooksModel.getBookById(bookId);
          if (!response) {
            throw new Error('Libro no encontrado');
          }
          break;

        case 'CREATE book':
          const bookData = JSON.parse(command.slice(2).join(' '));
          response = await BooksModel.createBook(bookData);
          break;

        case 'UPDATE book':
          const updateBookId = parseInt(command[2]);
          const updateBookData = JSON.parse(command.slice(3).join(' '));
          response = await BooksModel.updateBook(updateBookId, updateBookData);
          if (!response) {
            throw new Error('Libro no encontrado');
          }
          break;

        case 'DELETE book':
          const deleteBookId = parseInt(command[2]);
          response = await BooksModel.deleteBook(deleteBookId);
          if (!response) {
            throw new Error('Libro no encontrado');
          }
          break;

        // === Operaciones de Autores ===
        case 'GET authors':
          response = await AuthorsModel.getAllAuthors();
          break;

        case 'GET author':
          const authorId = parseInt(command[2]);
          response = await AuthorsModel.getAuthorById(authorId);
          if (!response) {
            throw new Error('Autor no encontrado');
          }
          break;

        case 'SEARCH authors':
          const authorCriteria = JSON.parse(command.slice(2).join(' '));
          response = await AuthorsModel.searchAuthors(authorCriteria);
          break;

        case 'GET authors/nationality':
          const nationality = command[2];
          response = await AuthorsModel.getAuthorsByNationality(nationality);
          break;

        case 'CREATE author':
          const authorData = JSON.parse(command.slice(2).join(' '));
          response = await AuthorsModel.createAuthor(authorData);
          break;

        case 'UPDATE author':
          const updateAuthorId = parseInt(command[2]);
          const updateAuthorData = JSON.parse(command.slice(3).join(' '));
          response = await AuthorsModel.updateAuthor(updateAuthorId, updateAuthorData);
          if (!response) {
            throw new Error('Autor no encontrado');
          }
          break;

        case 'DELETE author':
          const deleteAuthorId = parseInt(command[2]);
          response = await AuthorsModel.deleteAuthor(deleteAuthorId);
          if (!response) {
            throw new Error('Autor no encontrado');
          }
          break;

        case 'ADD author/award':
          const awardAuthorId = parseInt(command[2]);
          const award = JSON.parse(command.slice(3).join(' '));
          response = await AuthorsModel.addAward(awardAuthorId, award);
          if (!response) {
            throw new Error('Autor no encontrado');
          }
          break;

        // === Operaciones de Editoriales ===
        case 'GET publishers':
          response = await PublishersModel.getAllPublishers();
          break;

        case 'GET publisher':
          const publisherId = parseInt(command[2]);
          response = await PublishersModel.getPublisherById(publisherId);
          if (!response) {
            throw new Error('Editorial no encontrada');
          }
          break;

        case 'SEARCH publishers':
          const publisherCriteria = JSON.parse(command.slice(2).join(' '));
          response = await PublishersModel.searchPublishers(publisherCriteria);
          break;

        case 'GET publishers/country':
          const country = command[2];
          response = await PublishersModel.getPublishersByCountry(country);
          break;

        case 'CREATE publisher':
          const publisherData = JSON.parse(command.slice(2).join(' '));
          response = await PublishersModel.createPublisher(publisherData);
          break;

        case 'UPDATE publisher':
          const updatePublisherId = parseInt(command[2]);
          const updatePublisherData = JSON.parse(command.slice(3).join(' '));
          response = await PublishersModel.updatePublisher(updatePublisherId, updatePublisherData);
          if (!response) {
            throw new Error('Editorial no encontrada');
          }
          break;

        case 'DELETE publisher':
          const deletePublisherId = parseInt(command[2]);
          response = await PublishersModel.deletePublisher(deletePublisherId);
          if (!response) {
            throw new Error('Editorial no encontrada');
          }
          break;

        case 'ADD publisher/genre':
          const genrePublisherId = parseInt(command[2]);
          const genre = command.slice(3).join(' ');
          response = await PublishersModel.addGenre(genrePublisherId, genre);
          if (!response) {
            throw new Error('Editorial no encontrada');
          }
          break;

        default:
          throw new Error('Comando no válido');
      }

      // Enviar respuesta exitosa al cliente
      socket.write(JSON.stringify({
        status: 'success',
        data: response
      }) + '\n');

    } catch (error) {
      // Enviar respuesta de error al cliente
      socket.write(JSON.stringify({
        status: 'error',
        message: error.message
      }) + '\n');
    }
  });

  /**
   * Manejador de desconexión del cliente
   * Se ejecuta cuando el cliente cierra la conexión
   */
  socket.on('end', () => {
    console.log('Cliente desconectado:', socket.remoteAddress);
  });

  /**
   * Manejador de errores de socket
   * Se ejecuta cuando ocurre un error en la conexión
   */
  socket.on('error', (error) => {
    console.error('Error de socket:', error);
  });
});

/**
 * Manejador de errores del servidor
 * Se ejecuta cuando ocurre un error en el servidor
 */
server.on('error', (error) => {
  console.error('Error del servidor:', error);
});

/**
 * Iniciar el servidor TCP
 * Comienza a escuchar conexiones en el puerto y host especificados
 */
server.listen(PORT, HOST, () => {
  console.log(`Servidor TCP escuchando en ${HOST}:${PORT}`);
}); 