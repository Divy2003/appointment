// Middleware to attach socket.io instance to request object
export const attachSocketIO = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};