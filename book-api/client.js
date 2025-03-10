const net = require('net');
const readline = require('readline');

const HOST = '127.0.0.1';
const PORT = 8080;

// Crear interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Crear cliente TCP
const client = new net.Socket();

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Ejemplos de comandos
const commandExamples = {
  'GET books': 'Obtener todos los libros',
  'GET book 1': 'Obtener el libro con ID 1',
  'CREATE book': {
    title: "Nuevo Libro",
    authorId: 1,
    publisherId: 1,
    year: 2024,
    isbn: "978-0123456789"
  },
  'UPDATE book 1': {
    year: 2025,
    isbn: "978-9876543210"
  },
  'DELETE book 1': 'Eliminar el libro con ID 1',
  'GET authors': 'Obtener todos los autores',
  'GET author 1': 'Obtener el autor con ID 1',
  'CREATE author': {
    name: "Nuevo Autor",
    nationality: "Argentina",
    birthYear: 1980
  },
  'GET publishers': 'Obtener todas las editoriales',
  'CREATE publisher': {
    name: "Nueva Editorial",
    country: "España",
    founded: 2000
  }
};

// Función para mostrar el menú principal
function showMainMenu() {
  console.log(`${colors.bright}${colors.cyan}=== Cliente TCP para API de Libros ===${colors.reset}`);
  console.log(`${colors.yellow}Comandos disponibles:${colors.reset}`);
  console.log('1. Gestión de Libros');
  console.log('2. Gestión de Autores');
  console.log('3. Gestión de Editoriales');
  console.log('4. Ver ejemplos de comandos');
  console.log('5. Modo comando directo');
  console.log('6. Salir');
  console.log();
  rl.question(`${colors.green}Seleccione una opción (1-6): ${colors.reset}`, handleMainMenuChoice);
}

// Función para manejar la elección del menú principal
function handleMainMenuChoice(choice) {
  switch (choice) {
    case '1':
      showBooksMenu();
      break;
    case '2':
      showAuthorsMenu();
      break;
    case '3':
      showPublishersMenu();
      break;
    case '4':
      showCommandExamples();
      break;
    case '5':
      startDirectCommandMode();
      break;
    case '6':
      console.log(`${colors.yellow}¡Hasta luego!${colors.reset}`);
      client.end();
      rl.close();
      break;
    default:
      console.log(`${colors.red}Opción no válida${colors.reset}`);
      showMainMenu();
  }
}

// Función para mostrar el menú de libros
function showBooksMenu() {
  console.log(`${colors.cyan}\n=== Gestión de Libros ===${colors.reset}`);
  console.log('1. Listar todos los libros');
  console.log('2. Buscar libro por ID');
  console.log('3. Crear nuevo libro');
  console.log('4. Actualizar libro');
  console.log('5. Eliminar libro');
  console.log('6. Volver al menú principal');
  console.log();
  rl.question(`${colors.green}Seleccione una opción (1-6): ${colors.reset}`, handleBooksMenuChoice);
}

// Función para mostrar el menú de autores
function showAuthorsMenu() {
  console.log(`${colors.cyan}\n=== Gestión de Autores ===${colors.reset}`);
  console.log('1. Listar todos los autores');
  console.log('2. Buscar autor por ID');
  console.log('3. Crear nuevo autor');
  console.log('4. Actualizar autor');
  console.log('5. Eliminar autor');
  console.log('6. Volver al menú principal');
  console.log();
  rl.question(`${colors.green}Seleccione una opción (1-6): ${colors.reset}`, handleAuthorsMenuChoice);
}

// Función para mostrar el menú de editoriales
function showPublishersMenu() {
  console.log(`${colors.cyan}\n=== Gestión de Editoriales ===${colors.reset}`);
  console.log('1. Listar todas las editoriales');
  console.log('2. Buscar editorial por ID');
  console.log('3. Crear nueva editorial');
  console.log('4. Actualizar editorial');
  console.log('5. Eliminar editorial');
  console.log('6. Volver al menú principal');
  console.log();
  rl.question(`${colors.green}Seleccione una opción (1-6): ${colors.reset}`, handlePublishersMenuChoice);
}

// Función para manejar las opciones del menú de libros
function handleBooksMenuChoice(choice) {
  switch (choice) {
    case '1':
      sendCommand('GET books');
      setTimeout(showBooksMenu, 1000);
      break;
    case '2':
      rl.question('Ingrese el ID del libro: ', (id) => {
        sendCommand(`GET book ${id}`);
        setTimeout(showBooksMenu, 1000);
      });
      break;
    case '3':
      console.log('Ingrese los datos del libro:');
      const bookData = {};
      rl.question('Título: ', (title) => {
        bookData.title = title;
        rl.question('ID del autor: ', (authorId) => {
          bookData.authorId = parseInt(authorId);
          rl.question('ID de la editorial: ', (publisherId) => {
            bookData.publisherId = parseInt(publisherId);
            rl.question('Año: ', (year) => {
              bookData.year = parseInt(year);
              rl.question('ISBN: ', (isbn) => {
                bookData.isbn = isbn;
                sendCommand(`CREATE book ${JSON.stringify(bookData)}`);
                setTimeout(showBooksMenu, 1000);
              });
            });
          });
        });
      });
      break;
    case '4':
      rl.question('ID del libro a actualizar: ', (id) => {
        rl.question('Nuevos datos (en formato JSON): ', (data) => {
          sendCommand(`UPDATE book ${id} ${data}`);
          setTimeout(showBooksMenu, 1000);
        });
      });
      break;
    case '5':
      rl.question('ID del libro a eliminar: ', (id) => {
        sendCommand(`DELETE book ${id}`);
        setTimeout(showBooksMenu, 1000);
      });
      break;
    case '6':
      showMainMenu();
      break;
    default:
      console.log(`${colors.red}Opción no válida${colors.reset}`);
      showBooksMenu();
  }
}

// Función para manejar las opciones del menú de autores
function handleAuthorsMenuChoice(choice) {
  switch (choice) {
    case '1':
      sendCommand('GET authors');
      setTimeout(showAuthorsMenu, 1000);
      break;
    case '2':
      rl.question('Ingrese el ID del autor: ', (id) => {
        sendCommand(`GET author ${id}`);
        setTimeout(showAuthorsMenu, 1000);
      });
      break;
    case '3':
      console.log('Ingrese los datos del autor:');
      const authorData = {};
      rl.question('Nombre: ', (name) => {
        authorData.name = name;
        rl.question('Nacionalidad: ', (nationality) => {
          authorData.nationality = nationality;
          rl.question('Año de nacimiento: ', (birthYear) => {
            authorData.birthYear = parseInt(birthYear);
            sendCommand(`CREATE author ${JSON.stringify(authorData)}`);
            setTimeout(showAuthorsMenu, 1000);
          });
        });
      });
      break;
    case '6':
      showMainMenu();
      break;
    default:
      console.log(`${colors.red}Opción no válida${colors.reset}`);
      showAuthorsMenu();
  }
}

// Función para manejar las opciones del menú de editoriales
function handlePublishersMenuChoice(choice) {
  switch (choice) {
    case '1':
      sendCommand('GET publishers');
      setTimeout(showPublishersMenu, 1000);
      break;
    case '2':
      rl.question('Ingrese el ID de la editorial: ', (id) => {
        sendCommand(`GET publisher ${id}`);
        setTimeout(showPublishersMenu, 1000);
      });
      break;
    case '3':
      console.log('Ingrese los datos de la editorial:');
      const publisherData = {};
      rl.question('Nombre: ', (name) => {
        publisherData.name = name;
        rl.question('País: ', (country) => {
          publisherData.country = country;
          rl.question('Año de fundación: ', (founded) => {
            publisherData.founded = parseInt(founded);
            sendCommand(`CREATE publisher ${JSON.stringify(publisherData)}`);
            setTimeout(showPublishersMenu, 1000);
          });
        });
      });
      break;
    case '6':
      showMainMenu();
      break;
    default:
      console.log(`${colors.red}Opción no válida${colors.reset}`);
      showPublishersMenu();
  }
}

// Función para mostrar ejemplos de comandos
function showCommandExamples() {
  console.log(`${colors.cyan}\n=== Ejemplos de Comandos ===${colors.reset}`);
  for (const [command, example] of Object.entries(commandExamples)) {
    console.log(`${colors.yellow}${command}${colors.reset}`);
    console.log(JSON.stringify(example, null, 2));
    console.log();
  }
  showMainMenu();
}

// Función para iniciar el modo de comando directo
function startDirectCommandMode() {
  console.log(`${colors.cyan}\n=== Modo Comando Directo ===${colors.reset}`);
  console.log('Ingrese los comandos directamente (escriba "menu" para volver al menú principal)');
  console.log('Ejemplos: "GET books", "GET book 1", etc.');
  console.log();
  
  rl.on('line', (input) => {
    if (input.toLowerCase() === 'menu') {
      showMainMenu();
      return;
    }
    sendCommand(input);
  });
}

// Función para enviar comandos al servidor
function sendCommand(command) {
  console.log(`${colors.blue}Enviando comando: ${command}${colors.reset}`);
  client.write(command);
}

// Conectar al servidor
client.connect(PORT, HOST, () => {
  console.log(`${colors.green}Conectado al servidor ${HOST}:${PORT}${colors.reset}\n`);
  showMainMenu();
});

// Configurar codificación UTF-8
client.setEncoding('utf8');

// Manejar datos recibidos del servidor
client.on('data', (data) => {
  try {
    const response = JSON.parse(data);
    if (response.status === 'success') {
      console.log(`${colors.green}Respuesta exitosa:${colors.reset}`);
    } else {
      console.log(`${colors.red}Error:${colors.reset}`);
    }
    console.log(JSON.stringify(response, null, 2));
    console.log();
  } catch (error) {
    console.error(`${colors.red}Error al procesar la respuesta:${colors.reset}`, error);
  }
});

// Manejar cierre de conexión
client.on('close', () => {
  console.log(`${colors.yellow}Conexión cerrada${colors.reset}`);
  process.exit(0);
});

// Manejar errores
client.on('error', (error) => {
  console.error(`${colors.red}Error de conexión:${colors.reset}`, error);
  process.exit(1);
}); 