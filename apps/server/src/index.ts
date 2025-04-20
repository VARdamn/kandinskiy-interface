import { Hono } from 'hono'
import {cors} from 'hono/cors'
import imagesRouter from 'routes/images.routes'

const app = new Hono().basePath('/api')

app.use('*', cors());

app.get('/ping', (c) => {
	return c.text('pong')
})

app.route('/images', imagesRouter)

export default {
	port: 5000,
	fetch: app.fetch
}
