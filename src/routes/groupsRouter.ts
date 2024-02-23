import { Router } from 'express';

import { createAGroup } from '../controllers/groupsControllers';
import { isClientReady } from "../middlewares/initMiddlewares";

const router = Router()

router.post(
  '/',
  isClientReady,
  createAGroup
)


export default router
