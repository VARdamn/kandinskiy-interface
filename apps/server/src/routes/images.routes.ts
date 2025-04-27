import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { generateImageQueue } from 'app/bull';
import ImageModel from 'db/images.schema';
import { Hono } from 'hono';
import mongoose from 'mongoose';
import { z } from 'zod';
import { GenerateImageRequestZod, TGenerateImageRequest } from 'utils/images.types';

const app = new OpenAPIHono();

const generateImageRoute = createRoute({
    method: 'post',
    path: '/generate',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: GenerateImageRequestZod,
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.strictObject({
                        imageId: z.string(),
                    }),
                },
            },
            description: 'Изображение успешно создано',
        },
    },
});

const checkImageStatusRoute = createRoute({
    method: 'get',
    path: '/status',
    request: {
        query: z.strictObject({
            id: z.string().openapi({ param: { name: 'id', in: 'query' }, type: 'string' }),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.strictObject({
                        image: z.string().nullable(),
                    }),
                },
            },
            description: 'Созданное изображение',
        },
    },
});

app.openapi(generateImageRoute, async (c) => {
    const data = (await c.req.json()) as TGenerateImageRequest;
    const image = await ImageModel.create({
        userId: data.userId,
        status: 'pending',
    });
    await generateImageQueue.add(image._id.toString(), { ...data, id: image._id.toString() });
    return c.json({ imageId: image._id.toString() });
});

app.openapi(checkImageStatusRoute, async (c) => {
    const imageId = c.req.query('id');
    if (!imageId) throw new Error('Image id is required');
    const image = await ImageModel.findOne({ _id: new mongoose.Types.ObjectId(imageId) });
    return c.json({ image: image?.image || null });
});

// app.on('POST', '/generate', async (c) => {
//     const data = (await c.req.json()) as TGenerateImageRequest;
// 	const image = await ImageModel.create({
// 		userId: data.userId,
// 		status: 'pending',
// 	});
//     await generateImageQueue.add(image._id.toString(), {...data, id: image._id.toString()});
//     return c.json({imageId: image._id.toString()});
// });

// app.on('GET', '/status', async (c) => {
//     const imageId = c.req.query('id');
//     if (!imageId) throw new Error('Image id is required');
// 	const image = await ImageModel.findOne({_id: new mongoose.Types.ObjectId(imageId)})
//     return c.json({image: image?.image || null});
// });

export default app;
