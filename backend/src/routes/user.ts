import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { z } from 'zod';
import { genSalt, hash, compare } from "bcrypt-ts";
import { SigninSchema, signupSchema } from '@hashirakb/common4medium';

export interface Env {
  MEDIUM_IMAGE_ASSETS: KVNamespace;
}

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
    // console.log("Hashed Password:", hashedPassword);

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

userRouter.post('/signin', zValidator('json', SigninSchema), async (c) => {
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
  confirmPassword: z.string().optional(),
  bio: z.string().optional(),
  profileImageKey: z.string().optional(),
  followingIds: z.array(z.string()).optional(),
  tagFollowIds: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// type UserUpdateInput = z.infer<typeof userUpdateSchema>;

userRouter.patch('/me', zValidator('json', userUpdateSchema), authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { name, password, bio, profileImageKey, followingIds, tagFollowIds } = c.req.valid('json');
  const hashedPassword = await genSalt(10).then((salt) => hash(password, salt));

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name,
      password: hashedPassword,
      bio: bio,
      profileImage: profileImageKey,
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

userRouter.post('/upload-image', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image');

    if (!file) {
      return c.json({ error: 'No image file uploaded' }, 400);
    }

    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Generate a unique key for the image
    const imageKey = `image_${Date.now()}`;
    // Store the image in KV directly as an ArrayBuffer
    const response = await c.env.MEDIUM_IMAGE_ASSETS.put(imageKey, arrayBuffer);
    console.log(`Image stored with key: ${imageKey}`);

    return c.json({ message: 'Image uploaded successfully', key: imageKey }, 200);
  } catch (err) {
    console.error('Error uploading image:', err);
    return c.json({ error: 'Error uploading image' }, 500);
  }
});

userRouter.get('/get-image/:key', authMiddleware, async (c) => {
  const imageKey = c.req.param('key');
  const arrayBuffer = await c.env.MEDIUM_IMAGE_ASSETS.get(imageKey, 'arrayBuffer');
  if (!arrayBuffer) {
    return c.json({ error: 'Image not found' }, 404);
  }
  return new Response(arrayBuffer, {
    headers: {
      'Content-Type': 'image/jpeg', // Adjust as needed
    },
  });
})

export { userRouter };