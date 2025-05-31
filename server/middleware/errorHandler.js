export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.status === 429 ? 
    'Too many requests, please try again later' : 
    err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 