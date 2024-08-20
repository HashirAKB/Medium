import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { z } from 'zod';

const commentRouter = new Hono();
commentRouter.use('*', authMiddleware);

const commentSchema = z.object({
  content: z.string().min(1),
  postId: z.string().uuid(),
});

// Create a new comment
commentRouter.post('/', zValidator('json', commentSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { content, postId } = c.req.valid('json');

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
  });

  return c.json(comment);
});

// Get a specific comment by ID
commentRouter.get('/:id', async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { author: { select: { name: true } }, post: true },
  });

  if (!comment) {
    c.status(404);
    return c.json({ error: 'Comment not found' });
  }

  return c.json(comment);
});

// Update a comment by ID
commentRouter.put('/:id', zValidator('json', commentSchema.partial()), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const id = c.req.param('id');
  const { content } = c.req.valid('json');

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment || comment.authorId !== userId) {
    c.status(403);
    return c.json({ error: 'Not authorized to update this comment' });
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return c.json(updatedComment);
});

// Delete a comment by ID
commentRouter.delete('/:id', async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const id = c.req.param('id');

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment || comment.authorId !== userId) {
    c.status(403);
    return c.json({ error: 'Not authorized to delete this comment' });
  }

  await prisma.comment.delete({ where: { id } });

  return c.json({ message: 'Comment deleted successfully' });
});

// Get all comments for a specific post
commentRouter.get('/post/:postId/comments', async (c) => {
  const prisma = c.get('prisma');
  const postId = c.req.param('postId');

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { author: { select: { name: true } } },
  });

  return c.json(comments);
});

export { commentRouter };
