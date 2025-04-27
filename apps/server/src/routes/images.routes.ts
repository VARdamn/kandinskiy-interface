import { generateImageQueue } from 'app/bull';
import ImageModel from 'db/images.schema';
import { Hono } from 'hono';
import mongoose from 'mongoose';
import { TGenerateImageRequest } from 'utils/images.types';

const app = new Hono();

app.on('POST', '/generate', async (c) => {
    const data = (await c.req.json()) as TGenerateImageRequest;
	const image = await ImageModel.create({
		userId: data.userId,
		status: 'pending',
	});
    await generateImageQueue.add(image._id.toString(), {...data, id: image._id.toString()});
    return c.json({imageId: image._id.toString()});
});

app.on('GET', '/status', async (c) => {
    const imageId = c.req.query('id');
    if (!imageId) throw new Error('Image id is required');
	const image = await ImageModel.findOne({_id: new mongoose.Types.ObjectId(imageId)})
    return c.json({image: image?.image || null});
});

export default app;
