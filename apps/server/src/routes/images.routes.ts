import axios from 'axios';
import { $$kandinskiy } from 'entities/kandinskiy';
import { Hono } from 'hono';

const app = new Hono()

app.on('POST', '/generate', async (c) => {
	const data = await c.req.json()
	const pipelineId: string = await $$kandinskiy.getPipelineId();
	const {status, uuid} = await $$kandinskiy.generateImage({data, pipelineId});
	return c.json({status, uuid})
})

app.on('GET', '/status', async (c) => {
	const uuid = c.req.query('uuid')
	if (!uuid) throw new Error('uuid is required')
	const response = await $$kandinskiy.checkImageStatus(uuid);
	return c.json(response)
})

export default app;