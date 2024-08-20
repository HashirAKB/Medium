import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth-middleware';
import { tagSchema } from '@hashirakb/common4medium';
const tagRouter = new Hono();

// Apply the authMiddleware to routes that require authentication
tagRouter.use('*', authMiddleware);

// Create a new tag (requires authentication)
tagRouter.post('/', zValidator('json', tagSchema), async (c) => {
  const prisma = c.get('prisma');
  const { name } = c.req.valid('json');

  const existingTag = await prisma.tag.findUnique({
    where: { name },
  });

  if (existingTag) {
    console.log("Existing Tag");
    c.status(400);
    return c.json({ error: 'Tag already exists' });
  }

  const tag = await prisma.tag.create({
    data: { name },
  });

  return c.json(tag);
});

// Get all tags
tagRouter.get('/', async (c) => {
  const prisma = c.get('prisma');

  const tags = await prisma.tag.findMany({
    include: {
      posts: {
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });

  return c.json(tags);
});

// Get a specific tag by ID
tagRouter.get('/:id', async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');

  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
          posts: {
            include: {
              author: {
                select: { name: true },
              },
            },
          },
        },
  });

  if (!tag) {
    c.status(404);
    return c.json({ error: 'Tag not found' });
  }

  return c.json(tag);
});

// Update a tag by ID (requires authentication)
tagRouter.put('/:id', zValidator('json', tagSchema), async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');
  const { name } = c.req.valid('json');

  const existingTag = await prisma.tag.findUnique({ where: { id } });

  if (!existingTag) {
    c.status(404);
    return c.json({ error: 'Tag not found' });
  }

  const updatedTag = await prisma.tag.update({
    where: { id },
    data: { name },
  });

  return c.json(updatedTag);
});

// Delete a tag by ID (requires authentication)
tagRouter.delete('/:id', async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');

  const existingTag = await prisma.tag.findUnique({ where: { id } });

  if (!existingTag) {
    c.status(404);
    return c.json({ error: 'Tag not found' });
  }

  await prisma.tag.delete({
    where: { id },
  });

  return c.json({ message: 'Tag deleted successfully' });
});

// Fetch all posts associated with a specific tag
tagRouter.get('/:tagId/posts', async (c) => {
    const prisma = c.get('prisma');
    const tagId = c.req.param('tagId');
  
    // Find the tag by ID
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        posts: {
          include: {
            author: {
              select: { name: true },
            },
          },
        },
      },
    });
  
    if (!tag) {
      c.status(404);
      return c.json({ error: 'Tag not found' });
    }
  
    return c.json(tag.posts);
});


export { tagRouter };