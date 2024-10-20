import { Context } from "hono";
import { initPrismaClient } from "../utils/prisma";
import { createBlogInput } from "../schemas/zodSchemas";
import { BlogError } from "../errors/BlogError";
import { ApiError } from "../errors/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { handleError } from "../errors/ErrorHandler";

export const createBlog = async (c: Context) => {
    try {
        const prisma = initPrismaClient(c);
        const adminId = c.get('id');
        const body = await c.req.json();
        const dataIsValid = createBlogInput.safeParse(body);

        if (!dataIsValid.success) throw ApiError.validationFailed("Invalid Inputs", dataIsValid.error.errors);

        const blog = await prisma.blog.create({
            data: {
                title: dataIsValid.data.title,
                content: dataIsValid.data.content,
                adminId: adminId,
                //seriesId is optional in the db
                seriesId: Number(dataIsValid.data.seriesId)
            },
        })

        if (!blog) throw BlogError.cannotCreateBlog();

        return c.json(new ApiResponse(200, blog, "Blog Created Successfully"), 200);
    } catch (error: any) {
        return handleError(c, error);
    }
}

export const editBlog = async (c: Context) => {
    try {
        const prisma = initPrismaClient(c);
        const adminId = c.get('id');
        const blogId = c.req.param('id');
        const body = await c.req.json();

        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(blogId),
                deleted: false
            }
        });

        if (!blog) throw BlogError.blogNotFound();

        if (blog.adminId !== adminId) throw BlogError.unauthorized();

        const dataIsValid = createBlogInput.safeParse(body);

        if (!dataIsValid.success) throw ApiError.validationFailed("Invalid Inputs", dataIsValid.error.errors);

        const updatedBlog = await prisma.blog.update({
            where: {
                id: Number(blogId)
            },
            data: {
                title: dataIsValid.data.title,
                content: dataIsValid.data.content,
                seriesId: Number(dataIsValid.data.seriesId)
            }
        });

        if (!updatedBlog) throw BlogError.cannotUpdateBlog();

        return c.json(new ApiResponse(200, updatedBlog, "Blog Updated Successfully"), 200);

    } catch (error: any) {
        return handleError(c, error);
    }
}

export const deleteBlog = async (c: Context) => {
    try {
        const prisma = initPrismaClient(c);
        const adminId = c.get('id');
        const blogId = c.req.param('id');

        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(blogId)
            }
        });

        if (!blog) throw BlogError.blogNotFound();

        if (blog.adminId !== adminId) throw BlogError.unauthorized();

        const deletedBlog = await prisma.blog.update({
            where: {
                id: Number(blogId)
            },
            data: {
                deleted: true
            }
        });

        if (!deletedBlog) throw BlogError.cannotDeleteBlog();

        return c.json(new ApiResponse(200, null, "Blog Deleted Successfully"), 200);

    } catch (error: any) {
        return handleError(c, error);
    }
}

export const addBlogToSeries = async (c: Context) => {
    try {
        const prisma = initPrismaClient(c);
        const adminId = c.get('id');
        const blogId = c.req.param('blogId');
        const seriesId = c.req.param('seriesId');

        if (!blogId || !seriesId) throw ApiError.validationFailed("Invalid Inputs", ["blogId and seriesId are required"]);

        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(blogId),
                deleted: false
            }
        });

        if (!blog) throw BlogError.blogNotFound();

        if (blog.seriesId === Number(seriesId)) throw ApiError.validationFailed("Blog is already in this series");

        if (blog.seriesId) throw ApiError.validationFailed("Blog is already in another series");

        if (blog.adminId !== adminId) throw BlogError.unauthorized();

        const series = await prisma.series.findUnique({
            where: {
                id: Number(seriesId),
                deleted: false
            }
        });

        if (!series) throw BlogError.seriesNotFound();

        const updatedBlog = await prisma.blog.update({
            where: {
                id: Number(blogId)
            },
            data: {
                seriesId: Number(seriesId)
            }
        });

        if (!updatedBlog) throw BlogError.cannotUpdateBlog();

        return c.json(new ApiResponse(200, updatedBlog, "Blog added to series successfully"), 200);

    } catch (error: any) {
        return handleError(c, error);
    }
}

export const removeBlogFromSeries = async (c: Context) => {
    try {
        const adminId = c.get('id');
        const blogId = c.req.param('blogId');

        if (!blogId) throw ApiError.validationFailed("Invalid Inputs, blogId is required");

        const prisma = initPrismaClient(c);

        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(blogId),
                deleted: false
            }
        });

        if (!blog) throw BlogError.blogNotFound();

        if (!blog.seriesId) throw ApiError.validationFailed("Blog is not in any series");

        if (blog.adminId !== adminId) throw BlogError.unauthorized();

        const updatedBlog = await prisma.blog.update({
            where: {
                id: Number(blogId)
            },
            data: {
                seriesId: null
            }
        });

        if (!updatedBlog) throw BlogError.cannotUpdateBlog();

        return c.json(new ApiResponse(200, updatedBlog, "Blog removed from series successfully"), 200);

    } catch (error: any) {
        return handleError(c, error);
    }
}