import { Hono } from "hono";
import { loginCheck } from "../middlewares/auth.middleware";
import { createSeries, deleteSeries, editSeries } from "../controllers/series.controller";

export const seriesRouter = new Hono<{
    Bindings: {
        DATABASE_URL: String,
        SECRET_KEY: String
    }
    variables: {
        adminId: string
    }
}>();

seriesRouter.use('/new').post(loginCheck, createSeries);
seriesRouter.use('/edit/:id').put(loginCheck, editSeries);
seriesRouter.use('/delete/:id').delete(loginCheck, deleteSeries);