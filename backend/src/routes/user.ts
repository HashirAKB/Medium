import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { z } from 'zod';
import { hashSync } from 'bcryptjs';
import { signinSchema, signupSchema } from '@hashirakb/common4medium';

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
    include: {
      posts: {
        where: {
          published: true,
        },
        include: {
          tags: true,
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      },
      comments: {
        include: {
          post: true,
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
      likes: {
        include: {
          post: true,
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
      following: {
        include: {
          following: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
      TagFollow: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!user) {
    c.status(404);
    return c.json({ error: 'User not found' });
  }

  return c.json(user);
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
  followingIds: z.array(z.string()).optional(),
  tagFollowIds: z.array(z.string()).optional(),
});

// type UserUpdateInput = z.infer<typeof userUpdateSchema>;

userRouter.patch('/me', zValidator('json', userUpdateSchema), authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { name, password, bio, profileImage, followingIds, tagFollowIds } = c.req.valid('json');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name,
      password: password ? hashSync(password, 10) : undefined,
      bio: bio,
      profileImage: profileImage,
      following: {
        set: [],
        connect: followingIds?.map((id) => ({ id })),
      },
      TagFollow: {
        set: [],
        connect: tagFollowIds?.map((id) => ({ id })),
      },
    },
    include: {
      following: {
        select: {
          id: true,
        },
      },
      TagFollow: {
        include: {
          tag: true,
        },
      },
    },
  });

  return c.json(updatedUser);
});

export { userRouter };