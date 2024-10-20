import { Hono } from "hono";
import { loginCheck } from "../middlewares/auth.middleware";
import { addBlogToSeries, createBlog, deleteBlog, editBlog, removeBlogFromSeries } from "../controllers/blog.controller";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: String,
        SECRET_KEY: String
    }
    variables: {
        adminId: string
    }
}>();

blogRouter.use('/new').post(loginCheck, createBlog);
blogRouter.use('/edit/:id').put(loginCheck, editBlog);
blogRouter.use('/delete/:id').delete(loginCheck, deleteBlog);
blogRouter.use('/add-to-series/:blogId/:seriesId').post(loginCheck, addBlogToSeries);
blogRouter.use('/delete-from-series/:blogId').delete(loginCheck, removeBlogFromSeries);