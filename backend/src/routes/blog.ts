import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { postSchema } from '@hashirakb/common4medium';

const blogRouter = new Hono();
blogRouter.use('*', authMiddleware);

blogRouter.post('/', zValidator('json', postSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { title, content, published, tags, readingTime } = c.req.valid('json');

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: published || true,
      authorId: userId,
      readingTime,
      tags: {
        connect: tags?.map((tagId) => ({ id: tagId})),
      },
    },
    include:{ tags: true},
  });

  return c.json(post);
});

blogRouter.get('/', async (c) => {
  const prisma = c.get('prisma');
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { 
      tags: true, 
      author: { 
        select: { 
          id: true, 
          name: true, 
          profileImage: true, 
          following: true,
        }
      },  
      likes: true, 
      comments: true 
      },
  });

  return c.json(posts);
});

blogRouter.get('/:id', async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');

  const post = await prisma.post.findUnique({
    where: { id },
    include: { 
      tags: true, 
      author: { 
        select: { 
          id: true, 
          name: true, 
          profileImage: true, 
          following: true,
        }
      },  
      likes: true, 
      comments: true 
      },
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
  const { title, content, published, tags } = c.req.valid('json');

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== userId) {
    c.status(403);
    return c.json({ error: 'Not authorized to update this post' });
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: { title, content, published,
      tags: {
        connect: tags?.map((tagId) => ({ id: tagId})),
      },
     },
     include:{ tags: true},
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

// Link an existing tag to an existing post
blogRouter.post('/:postId/tag/:tagId', async (c) => {
  const prisma = c.get('prisma');
  const { postId, tagId } = c.req.param();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });

  if (!post) {
    c.status(404);
    return c.json({ error: 'Post not found' });
  }

  if (!tag) {
    c.status(404);
    return c.json({ error: 'Tag not found' });
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
  });

  return c.json({ message: 'Tag linked to post successfully' });
});

// Remove a tag from an existing post
blogRouter.delete('/:postId/tag/:tagId', async (c) => {
  const prisma = c.get('prisma');
  const { postId, tagId } = c.req.param();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });

  if (!post) {
    c.status(404);
    return c.json({ error: 'Post not found' });
  }

  if (!tag) {
    c.status(404);
    return c.json({ error: 'Tag not found' });
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
  });

  return c.json({ message: 'Tag removed from post successfully' });
});

export { blogRouter };