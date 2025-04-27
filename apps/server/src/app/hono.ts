import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import imagesRouter from 'routes/images.routes';

const app = new OpenAPIHono().basePath('/api');

app.use('*', cors());

app.get('/ping', (c) => {
    return c.text('pong');
});

app.route('/images', imagesRouter);

app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
    },
});

app.get('/ui', swaggerUI({ url: '/api/doc' }));

export default {
    port: 5000,
    fetch: app.fetch,
};
