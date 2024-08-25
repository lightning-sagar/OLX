import express, { Router } from "express";
import {protectRoute} from "../middleware/protectRoute.js"
import { postProduct,getAllProduct,getSpecificProduct,cartRoute,deleteProductFromCart, GetCart } from "../controller/productController.js";
const router = express.Router()

router.post('/product',protectRoute,postProduct);
router.get('/product',getAllProduct);
router.get('/product/:productId',getSpecificProduct);
router.post('/product/:productId/cart',protectRoute,cartRoute);
router.get('/cart',protectRoute,GetCart);
router.put('/:pId',protectRoute,deleteProductFromCart);


export default router;