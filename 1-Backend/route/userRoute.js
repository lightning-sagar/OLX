import express from "express";
import { loginController,signController,logoutController,updateController } from "../controller/UserController.js";
import {protectRoute} from "../middleware/protectRoute.js"
import {checkuser} from "../middleware/checkuser.js"
const router = express.Router();

router.post('/login',loginController);
router.post('/signup',signController);
router.post('/logout',logoutController);
router.put('/:id',updateController);
// router.post('/post/:id',protectRoute,checkuser,checkController);

export default router