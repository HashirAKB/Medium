import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const blogRouter = new Hono();

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().optional(),
});

blogRouter.post('/', zValidator('json', postSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { title, content, published } = c.req.valid('json');

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: published || false,
      authorId: userId,
    },
  });

  return c.json(post);
});

blogRouter.get('/', async (c) => {
  const prisma = c.get('prisma');
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
  });

  return c.json(posts);
});

blogRouter.get('/:id', async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!post) {
    c.status(404);
    return c.json({ error: 'Post not found' });
  }

  return c.json(post);
});

blogRouter.put('/:id', zValidator('json', postSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const id = c.req.param('id');
  const { title, content, published } = c.req.valid('json');

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== userId) {
    c.status(403);
    return c.json({ error: 'Not authorized to update this post' });
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: { title, content, published },
  });

  return c.json(updatedPost);
});

blogRouter.delete('/:id', async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const id = c.req.param('id');

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== userId) {
    c.status(403);
    return c.json({ error: 'Not authorized to delete this post' });
  }

  await prisma.post.delete({ where: { id } });

  return c.json({ message: 'Post deleted successfully' });
});

export { blogRouter };