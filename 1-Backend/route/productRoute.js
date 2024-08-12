import express, { Router } from "express";
import {protectRoute} from "../middleware/protectRoute.js"
import { postProduct,getProduct } from "../controller/productController.js";
import { checkuser } from "../middleware/checkuser.js";
const router = express.Router()

router.post('/product',protectRoute,checkuser,postProduct);
router.get('/product',protectRoute,getProduct);

export default router;