import rateLimit from 'express-rate-limit';
const RateLimitMiddleware = (limit = 300, window = 30 * 60 * 1000) => {
  return rateLimit({
    windowMs: window, // in milliseconds
    max: limit,
    message: 'Too many requests from this client, try again later ...',
    standardHeaders: true,
    legacyHeaders: false,
  });
};
export default RateLimitMiddleware;
