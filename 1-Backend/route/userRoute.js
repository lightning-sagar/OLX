import express from "express";
import { loginController,signController,logoutController,updateController,getuserProfile } from "../controller/UserController.js";
import {protectRoute} from "../middleware/protectRoute.js"
const router = express.Router();

router.get('/profile/:query',protectRoute,getuserProfile);
router.post('/login',loginController);
router.post('/signup',signController);
router.post('/logout',logoutController);
router.put('/:id',protectRoute,updateController);
// router.post('/post/:id',protectRoute,checkController);

export default router