import express from 'express';
import { ErrorMiddleware } from './modules/common/errors/error.middleware';
import identityRouter from './routes/identity.routes';
import dotenv from 'dotenv';
import dmsRouter from './routes/dms.routes';
import ServiceBootrapper from './modules/common/service-bootstrapper';
import blogRouter from './routes/blogs.routes';
import subscriptionRouter from './routes/subscription.routes';
import notificationRouter from './routes/notifcation.routes';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

new ServiceBootrapper().initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
  });
});

app.use('/api/identity', identityRouter);
app.use('/api/dms', dmsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/notification', notificationRouter);

app.use(ErrorMiddleware);
