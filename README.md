# API de Gestión de Libros, Autores y Editoriales

Este proyecto implementa una API TCP para la gestión de libros, autores y editoriales, permitiendo realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y búsquedas avanzadas.

## Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Ejecución](#ejecución)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Comandos Disponibles](#comandos-disponibles)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Manejo de Errores](#manejo-de-errores)
8. [Pruebas](#pruebas)

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Pame-85/Trabajo_Practico_Integrador_Nodejs
cd book-api
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecución

1. Iniciar el servidor:
```bash
node server.js
```
El servidor escuchará en el puerto 8080.

2. En otra terminal, iniciar el cliente:
```bash
node client.js
```

## Estructura del Proyecto

```
book-api/
├── controllers/     # Controladores de la API
├── models/         # Modelos de datos y lógica de negocio
├── views/          # Formateadores de respuesta
├── data/          # Archivos JSON de datos
├── server.js      # Servidor TCP
├── client.js      # Cliente TCP interactivo
└── package.json   # Configuración del proyecto
```

## Comandos Disponibles

### Gestión de Libros

- `GET books` - Obtener todos los libros
- `GET book <id>` - Obtener un libro específico
- `CREATE book <json_data>` - Crear un nuevo libro
- `UPDATE book <id> <json_data>` - Actualizar un libro
- `DELETE book <id>` - Eliminar un libro

### Gestión de Autores

- `GET authors` - Obtener todos los autores
- `GET author <id>` - Obtener un autor específico
- `SEARCH authors <json_criteria>` - Buscar autores por criterios
- `GET authors/nationality/<nationality>` - Buscar autores por nacionalidad
- `CREATE author <json_data>` - Crear un nuevo autor
- `UPDATE author <id> <json_data>` - Actualizar un autor
- `DELETE author <id>` - Eliminar un autor
- `ADD author/award <id> <award_json>` - Añadir premio a un autor

### Gestión de Editoriales

- `GET publishers` - Obtener todas las editoriales
- `GET publisher <id>` - Obtener una editorial específica
- `SEARCH publishers <json_criteria>` - Buscar editoriales por criterios
- `GET publishers/country/<country>` - Buscar editoriales por país
- `CREATE publisher <json_data>` - Crear una nueva editorial
- `UPDATE publisher <id> <json_data>` - Actualizar una editorial
- `DELETE publisher <id>` - Eliminar una editorial
- `ADD publisher/genre <id> <genre>` - Añadir género a una editorial

## Ejemplos de Uso

### 1. Crear un Autor
```bash
CREATE author 
{
  "name": "Gabriel García Márquez",
  "nationality": "Colombiano",
  "birthYear": 1927,
  "biography": "Escritor colombiano, ganador del Premio Nobel de Literatura"
}
```
Respuesta esperada:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Gabriel García Márquez",
    "nationality": "Colombiano",
    "birthYear": 1927,
    "biography": "Escritor colombiano, ganador del Premio Nobel de Literatura",
    "awards": []
  }
}
```

### 2. Crear una Editorial
```bash
CREATE publisher 
{
  "name": "Editorial Sudamericana",
  "country": "Argentina",
  "founded": 1939,
  "website": "www.sudamericana.com"
}
```

### 3. Crear un Libro
```bash
CREATE book 
{
  "title": "Cien años de soledad",
  "authorId": 1,
  "publisherId": 1,
  "year": 1967,
  "isbn": "978-0307474728"
}
```

### 4. Buscar Autores por Nacionalidad
```bash
GET authors/nationality/Colombiano
```

### 5. Buscar Editoriales por Criterios
```bash
SEARCH publishers 
{
  "country": "Argentina",
  "founded": 1939
}
```

## Manejo de Errores

El sistema maneja los siguientes tipos de errores:

1. **Errores de formato JSON**
```json
{
  "status": "error",
  "message": "JSON inválido"
}
```

2. **Recursos no encontrados**
```json
{
  "status": "error",
  "message": "Autor/Libro/Editorial no encontrado"
}
```

3. **Datos inválidos**
```json
{
  "status": "error",
  "message": "Datos inválidos o incompletos"
}
```

## Pruebas

Para probar el sistema:

1. Asegúrate de que el servidor esté corriendo:
```bash
node server.js
```

2. En otra terminal, inicia el cliente:
```bash
node client.js
```

3. El cliente proporciona una interfaz interactiva con las siguientes opciones:
- Gestión de Libros
- Gestión de Autores
- Gestión de Editoriales
- Ver ejemplos de comandos
- Modo comando directo

4. Puedes usar el modo comando directo para probar comandos específicos o usar los menús interactivos para una experiencia más guiada.

### Secuencia de Prueba Recomendada

1. Crear una editorial
2. Crear un autor
3. Crear un libro (usando los IDs del autor y editorial creados)
4. Buscar el libro creado
5. Actualizar algún dato
6. Verificar que la actualización se realizó correctamente
7. Probar las búsquedas por criterios
8. Probar el manejo de errores con datos inválidos

## Notas Adicionales

- Todos los comandos son case-insensitive (GET = get)
- Los IDs son generados automáticamente
- Los datos se persisten en archivos JSON
- Las búsquedas son case-insensitive para textos
- Las respuestas siempre incluyen un campo "status" indicando éxito o error 