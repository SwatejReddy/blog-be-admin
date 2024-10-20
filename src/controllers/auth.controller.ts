import { Context } from "hono";
import { adminSignupInput, loginInput } from "../schemas/zodSchemas";
import ApiResponse from "../utils/ApiResponse";
import { generateSalt, hashPassword, verifyPassword } from "../utils/Hashing";
import { generateJwtToken } from "../utils/jwt";
import { setCookie } from "hono/cookie";
import { initPrismaClient } from "../utils/prisma";
import { ApiError } from "../errors/ApiError";
import { handleError } from "../errors/ErrorHandler";
import { AdminAuthError } from "../errors/AdminAuthError";

export const adminSignup = async (c: Context) => {
    try {
        const prisma = initPrismaClient(c);
        const body = await c.req.json();
        const dataIsValid = adminSignupInput.safeParse(body);

        // if the data is not valid, return an error response
        if (!dataIsValid.success) throw ApiError.validationFailed("Invalid Inputs", dataIsValid.error.errors);

        // create a salt
        const salt = generateSalt();

        // hash the password using the salt
        const hashedPassword = await hashPassword(dataIsValid.data.password, salt);

        // check if the admin already exists
        const adminExists = await prisma.admin.findFirst({
            where: {
                username: dataIsValid.data.username
            }
        })

        // if the admin already exists, return an error response
        if (adminExists) throw AdminAuthError.adminExists();

        // if admin doesn't exist, create the admin
        const admin = await prisma.admin.create({
            data: {
                fullname: dataIsValid.data.fullname,
                username: dataIsValid.data.username,
                password: hashedPassword,
                salt: salt
            }
        })

        if (!admin) throw AdminAuthError.cannotCreateAdmin();

        return c.json(new ApiResponse(200, {}, "Admin Signup Successful"), 200);
    } catch (error: any) {
        return handleError(c, error);
    }
}

export const adminLogin = async (c: Context) => {
    try {
        const prisma = initPrismaClient(c);
        const body = await c.req.json();
        const dataIsValid = loginInput.safeParse(body);

        if (!dataIsValid.success) throw ApiError.validationFailed("Invalid Inputs", dataIsValid.error.errors);

        const admin = await prisma.admin.findFirst({
            where: {
                username: dataIsValid.data.username
            },
        })

        if (!admin) throw AdminAuthError.adminNotFound();

        const passwordIsValid = await verifyPassword(dataIsValid.data.password, admin.password, admin.salt);

        if (!passwordIsValid) throw AdminAuthError.invalidCredentials();

        const token = await generateJwtToken(c, { userId: admin.id });

        setCookie(c, 'jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return c.json(new ApiResponse(200, {
            token, admin: {
                id: admin.id,
                fullname: admin.fullname,
                username: admin.username,
            }
        }, "Admin Login Successful"), 200);

    } catch (error: any) {
        return handleError(c, error);
    }
}

export const logout = async (c: Context) => {
    // clear cookie 'jwt'
    setCookie(c, 'jwt', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(0)
    });
    return c.json(new ApiResponse(200, {}, "Logout Successful"), 200);
}