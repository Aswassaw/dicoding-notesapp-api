const errorHandler = (error, h) => {
  const response = h.response({
    status: 'error',
    message: error.message,
  });
  response.code(500);
  return response;
};

module.exports = errorHandler;
