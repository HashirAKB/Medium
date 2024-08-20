import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { z } from 'zod';

const userRouter = new Hono();

userRouter.use('/me', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    c.status(401);
    return c.json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    console.log(token);
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('userId', payload.userId);
  } catch (e) {
    c.status(401);
    return c.json({ error: 'Invalid token' });
  }

  await next();
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

userRouter.post('/signup', zValidator('json', signupSchema), async (c) => {
  const prisma = c.get('prisma');
  const { email, password, name } = c.req.valid('json');

  const user = await prisma.user.create({
    data: {
      email,
      password, // Remember to hash this password before storing
      name,
    },
  });

  const token = await sign({ userId: user.id }, c.env.JWT_SECRET);
  return c.json({ token });
});

userRouter.post('/signin', zValidator('json', signinSchema), async (c) => {
  const prisma = c.get('prisma');
  const { email, password } = c.req.valid('json');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    c.status(401);
    return c.json({ error: 'Invalid credentials' });
  }

  // TODO: Implement password comparison logic here

  console.log(c.env.JWT_SECRET);
  const token = await sign({ userId: user.id }, c.env.JWT_SECRET);
  console.log(token);
  return c.json({ token });
});

userRouter.get('/me', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, bio: true, profileImage: true },
  });

  if (!user) {
    c.status(404);
    return c.json({ error: 'User not found' });
  }

  return c.json(user);
});

export { userRouter };