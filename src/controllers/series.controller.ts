import { Context } from "hono";
import { initPrismaClient } from "../utils/prisma";
import { createSeriesInput } from "../schemas/zodSchemas";
import { ApiError } from "../errors/ApiError";
import { SeriesError } from "../errors/SeriesError";
import { handleError } from "../errors/ErrorHandler";
import ApiResponse from "../utils/ApiResponse";

export const createSeries = async (c: Context) => {
    try {
        const adminId = c.get('id');
        const body = await c.req.json();
        const dataIsValid = createSeriesInput.safeParse(body);

        if (!dataIsValid.success) throw ApiError.validationFailed("Invalid Inputs", dataIsValid.error.errors);

        const prisma = initPrismaClient(c);

        const series = await prisma.series.create({
            data: {
                title: dataIsValid.data.title,
                description: dataIsValid.data.description,
                adminId: adminId
            }
        });

        if (!series) throw SeriesError.cannotCreateSeries();

        return c.json(new ApiResponse(200, series, "Series Created Successfully"), 200);
    } catch (error: any) {
        return handleError(c, error);
    }
}

export const editSeries = async (c: Context) => {
    try {
        const adminId = c.get('id');
        const seriesId = c.req.param("id");
        const body = await c.req.json();
        const dataIsValid = createSeriesInput.safeParse(body);

        if (!dataIsValid.success) throw ApiError.validationFailed("Invalid Inputs", dataIsValid.error.errors);

        const prisma = initPrismaClient(c);

        const series = await prisma.series.update({
            where: {
                id: Number(seriesId),
                adminId: adminId
            },
            data: {
                title: dataIsValid.data.title,
                description: dataIsValid.data.description,
                adminId: adminId
            }
        });

        if (!series) throw SeriesError.cannotEditSeries();

        return c.json(new ApiResponse(200, series, "Series Edited Successfully"), 200);

    } catch (error: any) {
        return handleError(c, error);
    }
}

export const deleteSeries = async (c: Context) => {
    try {
        const adminId = c.get('id');
        const seriesId = c.req.param("id");

        const prisma = initPrismaClient(c);

        // check if the series exists
        const seriesExists = await prisma.series.findFirst({
            where: {
                id: Number(seriesId),
                adminId: adminId
            }
        });

        if (!seriesExists) throw SeriesError.seriesNotFound();

        // check if there are any posts in the series
        const posts = await prisma.blog.findMany({
            where: {
                seriesId: Number(seriesId)
            }
        });

        if (posts.length > 0) throw SeriesError.seriesHasPosts();

        const series = await prisma.series.delete({
            where: {
                id: Number(seriesId),
                adminId: adminId
            }
        });

        if (!series) throw SeriesError.cannotDeleteSeries();

        return c.json(new ApiResponse(200, series, "Series Deleted Successfully"), 200);
    } catch (error: any) {
        return handleError(c, error);
    }
}