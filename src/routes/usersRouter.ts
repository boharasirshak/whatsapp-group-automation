import { Router } from "express";
import { getMe, getFormattedNumber, isRegisteredNumber } from "../controllers/usersControllers";
import { isClientReady } from "../middlewares/initMiddlewares";
import { numberFormater } from "../middlewares/numberMiddlewares";

const router = Router();

router.get("/me", isClientReady, getMe);
router.get("/verify", isClientReady, numberFormater, isRegisteredNumber);
router.get("/format", isClientReady, getFormattedNumber);

export default router;
