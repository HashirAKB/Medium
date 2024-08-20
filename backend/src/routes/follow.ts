import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { followSchema } from '@hashirakb/common4medium';
const followRouter = new Hono();

followRouter.use('*', authMiddleware);

followRouter.post('/', zValidator('json', followSchema), async (c) => {
  const prisma = c.get('prisma');
  const followerId = c.get('userId');
  const { followingId } = c.req.valid('json');

  // Check if the user is already following the specified user
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    c.status(400);
    return c.json({ error: 'You are already following this user' });
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return c.json(follow);
});

followRouter.delete('/', zValidator('json', followSchema), async (c) => {
  const prisma = c.get('prisma');
  const followerId = c.get('userId');
  const { followingId } = c.req.valid('json');

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (!follow) {
    c.status(404);
    return c.json({ error: 'You are not following this user' });
  }

  await prisma.follow.delete({
    where: {
      id: follow.id,
    },
  });

  return c.json({ message: 'Unfollowed user successfully' });
});

followRouter.get('/:userId/followers', async (c) => {
  const prisma = c.get('prisma');
  const userId = c.req.param('userId');

  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profileImage: true,
        },
      },
    },
  });

  return c.json(followers);
});

followRouter.get('/:userId/following', async (c) => {
  const prisma = c.get('prisma');
  const userId = c.req.param('userId');

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profileImage: true,
          posts: {
            where: {
              published: true,
            },
            select:{
                id: true,
                title: true,
                content: true,
                createdAt: true,
                tags: {
                    select: {
                      id: true,
                      name: true,
                },
            },
        },
      },
    },
    },
  },
});

  return c.json(following);
});

export { followRouter };