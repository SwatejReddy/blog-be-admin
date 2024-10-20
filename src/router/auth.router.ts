import { Hono } from "hono";
import { adminLogin, adminSignup, logout } from "../controllers/auth.controller";

export const authRouter = new Hono<{
    Bindings: {
        DATABASE_URL: String,
        SECRET_KEY: String
    }
    variables: {
        adminId: string
    }
}>();

authRouter.use('/signup').post(adminSignup);
authRouter.use('/login').post(adminLogin);
authRouter.use('/logout').post(logout);