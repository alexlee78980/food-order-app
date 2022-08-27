import express from "express";
import {check} from 'express-validator';
import { addPlan, allPlan, deletePlan, findMaxPlan } from "../controllers/plans-controllers.js";
import checkAuth from "../middleware/check-auth.js";
const router = express.Router();
router.get('/plans', allPlan);
router.get('/maxplan', findMaxPlan);
router.use(checkAuth);
router.post('/addplan', [
  check('name')
    .not()
    .isEmpty(),
  check('description')
  .not()
  .isEmpty(),
  check('image').not()
  .isEmpty(),
  check('meals')
  .not()
  .isEmpty(),
  check('price')
  .not()
  .isEmpty(),
  check('count')
  .not()
  .isEmpty()
], addPlan);
router.delete('/deleteplan', deletePlan);
export default router;