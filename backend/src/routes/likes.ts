import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth-middleware';

const likeRouter = new Hono();

// Apply the authMiddleware to all routes under likeRouter
likeRouter.use('*', authMiddleware);

const likeSchema = z.object({
  postId: z.string().uuid(),
});

// Like a post
likeRouter.post('/', zValidator('json', likeSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { postId } = c.req.valid('json');

  // Check if the user has already liked the post
  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existingLike) {
    c.status(400);
    return c.json({ error: 'You have already liked this post' });
  }

  const like = await prisma.like.create({
    data: {
      postId,
      userId,
    },
  });

  return c.json(like);
});

// Unlike a post
likeRouter.delete('/', zValidator('json', likeSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { postId } = c.req.valid('json');

  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (!existingLike) {
    c.status(404);
    return c.json({ error: 'Like not found' });
  }

  await prisma.like.delete({
    where: { userId_postId: { userId, postId } },
  });

  return c.json({ message: 'Post unliked successfully' });
});

// Get all likes for a specific post
likeRouter.get('/post/:postId/likes', async (c) => {
  const prisma = c.get('prisma');
  const postId = c.req.param('postId');

  const likes = await prisma.like.findMany({
    where: { postId },
    include: { user: { select: { name: true } } },
  });

  return c.json(likes);
});

export { likeRouter };
