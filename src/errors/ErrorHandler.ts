import { Context } from "hono";
import ApiResponse from "../utils/ApiResponse";
import { ApiError } from "./ApiError";
import { AdminAuthError } from "./AdminAuthError";
import { BlogError } from "./BlogError";
import { SeriesError } from "./SeriesError";

export const handleError = (c: Context, error: AdminAuthError | BlogError | SeriesError | ApiError) => {
    if (error instanceof AdminAuthError) {
        return c.json(
            new ApiResponse(error.statusCode, error.details, error.message),
            { status: error.statusCode }
        )
    }

    if (error instanceof BlogError) {
        return c.json(
            new ApiResponse(error.statusCode, error.details, error.message),
            { status: error.statusCode }
        )
    }

    if (error instanceof SeriesError) {
        return c.json(
            new ApiResponse(error.statusCode, error.details, error.message),
            { status: error.statusCode }
        )
    }

    if (error instanceof ApiError) {
        return c.json(
            new ApiResponse(error.statusCode, error.details, error.message),
            { status: error.statusCode }
        )
    }

    console.error("Unexpected error: ", error);
    return c.json(
        new ApiResponse(500, {}, "An unexpected error occurred"), 500
    )
}