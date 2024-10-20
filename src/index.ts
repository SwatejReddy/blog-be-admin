import { Hono } from 'hono'
import { authRouter } from './router/auth.router'
import { blogRouter } from './router/blog.router'
import { seriesRouter } from './router/series.router'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRouter);
app.route('/blog', blogRouter);
app.route('/series', seriesRouter);

export default app
