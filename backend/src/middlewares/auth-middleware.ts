import { Hono } from 'hono';
import { verify } from 'hono/jwt'

const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    c.status(401);
    return c.json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('userId', payload.userId);
  } catch (e) {
    c.status(401);
    return c.json({ error: 'Invalid token' });
  }

  await next();
};

export { authMiddleware };
