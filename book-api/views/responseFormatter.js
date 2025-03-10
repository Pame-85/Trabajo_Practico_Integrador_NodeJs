class ResponseFormatter {
  static success(data, message = 'Operación exitosa') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message = 'Error en la operación', statusCode = 500) {
    return {
      success: false,
      message,
      statusCode
    };
  }
}

module.exports = ResponseFormatter; 