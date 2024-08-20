import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth-middleware';

const tagFollowRouter = new Hono();

tagFollowRouter.use('*', authMiddleware);

const tagFollowSchema = z.object({
  tagId: z.string(),
});

tagFollowRouter.post('/', zValidator('json', tagFollowSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { tagId } = c.req.valid('json');

  // Check if the user is already following the specified tag
  const existingTagFollow = await prisma.tagFollow.findUnique({
    where: {
      userId_tagId: {
        userId,
        tagId,
      },
    },
  });

  if (existingTagFollow) {
    c.status(400);
    return c.json({ error: 'You are already following this tag' });
  }

  const tagFollow = await prisma.tagFollow.create({
    data: {
      userId,
      tagId,
    },
  });

  return c.json(tagFollow);
});

tagFollowRouter.delete('/', zValidator('json', tagFollowSchema), async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const { tagId } = c.req.valid('json');

  const tagFollow = await prisma.tagFollow.findUnique({
    where: {
      userId_tagId: {
        userId,
        tagId,
      },
    },
  });

  if (!tagFollow) {
    c.status(404);
    return c.json({ error: 'You are not following this tag' });
  }

  await prisma.tagFollow.delete({
    where: {
      id: tagFollow.id,
    },
  });

  return c.json({ message: 'Unfollowed tag successfully' });
});

export { tagFollowRouter };