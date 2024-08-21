import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { z } from 'zod';
import { genSalt, hash, compare } from "bcrypt-ts";
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
    try {
    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ error: 'User with this email already exists' }, 400);
    }

    // Hash the password before storing it
    const hashedPassword = await genSalt(10).then((salt) => hash(password, salt));
    console.log("Hashed Password:", hashedPassword);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email:email,
        password:hashedPassword,
        name: name
      },
    });

    // Generate a JWT token
    const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

    // Return the token as a response
    return c.json({ token }, 201);
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return c.json({ success: false, errors }, 400);
    }

    // Log the error for debugging (optional)
    console.error('Error during user signup:', err);

    // Return a generic error message
    return c.json({ error: 'An unexpected error occurred. Please try again.' }, 500);
  }
});

userRouter.post('/signin', zValidator('json', signinSchema), async (c) => {
  const prisma = c.get('prisma');
  const { email, password } = c.req.valid('json');

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      c.status(401);
      return c.json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const result = await compare(password, user.password);
      if (result) {
        // Generate JWT token
        const token = await sign({ userId: user.id }, c.env.JWT_SECRET);
        // Return the token in the response
        return c.json({ token }, 200);
      }
      else {
        c.status(401);
        return c.json({ "error": 'Invalid credentials' },401);
      }

  } catch (err) {
    console.error('Error during signin:', err);
    return c.json({ error: 'An unexpected error occurred. Please try again.' }, 500);
  }
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