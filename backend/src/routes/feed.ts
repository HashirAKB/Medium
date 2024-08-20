import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth-middleware';

const feedRouter = new Hono();

feedRouter.use('*', authMiddleware);

feedRouter.get('/me', async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');

//   Fetch posts from users the current user is following
  const followingPosts = await prisma.post.findMany({
    where: {
      author: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch posts with tags that the current user is following
  const tagFollowPosts = await prisma.post.findMany({
    where: {
      tags: {
        some: {
          TagFollow: {
            some: {
              userId,
            },
          },
        },
      },
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const feed = [...tagFollowPosts, ...followingPosts];
  feed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return c.json(feed);
});

export { feedRouter };