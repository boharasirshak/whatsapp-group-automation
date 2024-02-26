import { Router } from "express";
import { getMe, getFormattedNumber, isRegisteredNumber } from "../controllers/usersControllers";
import { isClientReady } from "../middlewares/initMiddlewares";
import { numberFormater } from "../middlewares/numberMiddlewares";

const router = Router();

router.get("/me", isClientReady, getMe);
router.post("/verify", isClientReady, numberFormater, isRegisteredNumber);
router.post("/format", isClientReady, getFormattedNumber);

export default router;
