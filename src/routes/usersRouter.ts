import { Router } from "express";
import { getMe } from "../controllers/usersControllers";
import { isClientReady } from "../middlewares/initMiddlewares";

const router = Router();

router.get("/me", isClientReady, getMe);

export default router;
