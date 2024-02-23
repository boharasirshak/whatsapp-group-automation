import { Router } from "express";
import {
  sendContactMessage,
  sendTextMesage,
} from "../controllers/messagesControllers";
import { isClientReady } from "../middlewares/initMiddlewares";
import { messageLengthCheck } from "../middlewares/messageMiddlewares";
import { numberFormater } from "../middlewares/numberMiddlewares";

const router = Router();

router.post(
  "/text",
  isClientReady,
  numberFormater,
  messageLengthCheck,
  sendTextMesage
);
router.post("/contacts", isClientReady, numberFormater, sendContactMessage);

/** Implement when needed */
// router.post("/files", isClientReady);
// router.post("/buttons", isClientReady);
// router.post("/lists", isClientReady);

export default router;
