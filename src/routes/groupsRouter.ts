import { Router } from 'express';
import multer from "multer";
import os from 'os';

import { createAGroup, setGroupProfilePic } from '../controllers/groupsControllers';
import { isClientReady } from "../middlewares/initMiddlewares";

const upload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: 2048 * 1024 * 1024 },
});

const router = Router()

router.post(
  '/',
  isClientReady,
  createAGroup
)

router.put(
  '/picture',
  isClientReady,
  upload.single('image'),
  setGroupProfilePic
)


export default router
