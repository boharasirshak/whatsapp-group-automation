import { Router } from "express";
import multer from "multer";
import * as os from "os";
import {
  getMe,
  sendMessageToUser,
} from "../controllers/usersControllers";
import { isClientReady } from "../middlewares/initMiddlewares";
import { messageVerify } from "../middlewares/messageMiddlewares";
import { numberFormater } from "../middlewares/numberMiddlewares";

const upload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: 2048 * 1024 * 1024 },
});

const router = Router();

router.get("/me", isClientReady, getMe);
router.post(
  "/sendMessage",
  isClientReady,
  upload.any(),
  messageVerify,
  numberFormater,
  sendMessageToUser
);

export default router;
