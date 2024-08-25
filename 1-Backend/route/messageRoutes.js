import express from "express";
import {protectRoute} from "../middleware/protectRoute.js"
import {sendMessage,getMessage,getConservation} from "../controller/Message.js";
const router = express.Router();


router.post('/',protectRoute,sendMessage);
router.get('/conservation',protectRoute,getConservation);
router.get('/:otherUserId',protectRoute,getMessage);

export default router