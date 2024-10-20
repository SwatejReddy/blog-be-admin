// check the JWT token and if it is valid, then set the user in the request object else, return 401 status code with access denied message

import { Context, Next } from "hono";
import {
    getCookie
} from 'hono/cookie';
import { verifyJwtToken } from "../utils/jwt";
import ApiResponse from "../utils/ApiResponse";

const authenticateAdmin = async (c: Context) => {
    const jwt = getCookie(c, 'jwt');

    if (!jwt) {
        return new ApiResponse(401, { message: 'Unauthorized' }, "Please login first");
    }

    const payload = await verifyJwtToken(c, jwt);
    if (!payload) {
        return new ApiResponse(401, { message: 'Unauthorized' }, "Incorrect JWT token received");
    }

    return { userId: payload.userId };
}

export const loginCheck = async (c: Context, next: Next) => {
    const result = await authenticateAdmin(c);

    // if not logged in or incorrect jwt token return 401
    if (result instanceof ApiResponse) {
        return c.json(result, 401);
    }

    // set userId in context
    c.set('id', result.userId);

    await next();
}

export const adminAccessCheck = async (c: Context, next: Next) => {
    const result = await authenticateAdmin(c);
    // if not logged in or incorrect jwt token return 401
    if (result instanceof ApiResponse) {
        return c.json(result, 401);
    }

    // set userId in context
    c.set('id', result.userId);
    await next();
}