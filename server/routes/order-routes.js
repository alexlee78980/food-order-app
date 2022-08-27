import express from "express";
import {check} from 'express-validator';
import { addOrder, allOrder, claimOrder, deleteOrder, finishedOrder } from "../controllers/order-controller.js";
import checkAuth from "../middleware/check-auth.js";
const router = express.Router();
router.get('/orders', allOrder);


router.use(checkAuth);
router.patch('/claimorder',
claimOrder);
router.delete('/deleteorder', deleteOrder);
router.post('/addorder', [
  check('name')
    .not()
    .isEmpty(),
  check('email')
  .not()
  .isEmpty(),
  check('address').not()
  .isEmpty(),
  check('date')
  .not()
  .isEmpty(),
  check('time')
  .not()
  .isEmpty(),
  check('cell')
  .not()
  .isEmpty(),
  check('meals')
  .not()
  .isEmpty(),
], addOrder);
router.delete('/finishedorder', finishedOrder);
export default router;