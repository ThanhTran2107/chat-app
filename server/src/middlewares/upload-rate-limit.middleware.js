const windowMs = 60 * 1000;
const maxRequests = 30;

const clients = new Map();

const cleanup = () => {
  const now = Date.now();

  for (const [key, data] of clients) {
    if (now - data.windowStart > windowMs) clients.delete(key);
  }
};

setInterval(cleanup, windowMs);

export const uploadRateLimiter = (req, res, next) => {
  const userId = req.user?._id?.toString();

  if (!userId) return next();

  const now = Date.now();
  const client = clients.get(userId) || { count: 0, windowStart: now };

  if (now - client.windowStart > windowMs) {
    client.count = 0;
    client.windowStart = now;
  }

  client.count += 1;
  clients.set(userId, client);

  if (client.count > maxRequests) {
    return res.status(429).json({
      message: "Too many requests. Please slow down.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  next();
};
