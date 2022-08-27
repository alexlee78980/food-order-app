import express from "express";
import { addFood, allFood, deleteFood, maxCountFood } from "../controllers/food-contoller.js";
import {check} from 'express-validator';
import checkAuth from "../middleware/check-auth.js";
const router = express.Router();

router.get('/maxfood',maxCountFood);
router.get('/foods', allFood);


router.use(checkAuth);
router.post('/addfood', [
    check('name')
      .not()
      .isEmpty(),
    check('description')
    .not()
    .isEmpty(),
    check('image').not()
    .isEmpty(),
    check('from')
    .not()
    .isEmpty()
  ], addFood);
router.delete('/deletefood', deleteFood);
export default router;