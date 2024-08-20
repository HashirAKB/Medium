import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const userRouter = new Hono();

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

  const token = await sign({ userId: user.id }, c.env.JWT_SECRET);
  return c.json({ token });
});

userRouter.get('/me', async (c) => {
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