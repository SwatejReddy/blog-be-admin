import { z } from "zod";

export const adminSignupInput = z.object({
    fullname: z.string().min(3).max(50),
    username: z.string().min(3).max(20).toLowerCase(),
    password: z.string().min(8).max(50),
})

export const loginInput = z.object({
    username: z.string().min(3).max(20).toLowerCase(),
    password: z.string().min(8).max(50),
})

export const createBlogInput = z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(10),
    seriesId: z.string().optional(),
})

export const createSeriesInput = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
})