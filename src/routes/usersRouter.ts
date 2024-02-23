import { Router } from "express";
import multer from "multer";
import * as os from "os";
import { getMe } from "../controllers/usersControllers";
import { isClientReady } from "../middlewares/initMiddlewares";

const upload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: 2048 * 1024 * 1024 },
});

const router = Router();

router.get("/me", isClientReady, getMe);

export default router;
