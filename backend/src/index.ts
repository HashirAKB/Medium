import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { commentRouter } from './routes/comments';
import { likeRouter } from './routes/likes';
import { tagRouter } from './routes/tag';
import { tagFollowRouter } from './routes/tagFollow';
import { followRouter } from './routes/follow';
import { feedRouter } from './routes/feed';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	},
	Variables : {
		userId: string,
    prisma: any
	}
}>();

app.use('*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set('prisma', prisma)
  await next();
});

app.route('/api/v1/user',userRouter);
app.route('/api/v1/blog',blogRouter);
app.route('/api/v1/comment',commentRouter);
app.route('/api/v1/like',likeRouter);
app.route('/api/v1/tag',tagRouter);
app.route('/api/v1/follow',followRouter);
app.route('/api/v1/tag-follow',tagFollowRouter);
app.route('/api/v1/feed',feedRouter);

export default app;