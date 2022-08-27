import express from "express";
import {check} from 'express-validator';
import { addMeals, Login, resetPassword, sendResetPassword, signUp, updateUser, userAddPlan, sendValidate, validate, LoginToken } from "../controllers/user-controllers.js";
import checkAuth from "../middleware/check-auth.js";
const router = express.Router();

router.post('/signup', [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 }),
    check('address')
    .not()
    .isEmpty()
  ], signUp);
router.post('/login', Login);
router.post('/sendresetpassword', sendResetPassword);
router.post('/sendValidate', sendValidate);
router.use(checkAuth); 
router.post('/logintoken', LoginToken)
router.post('/validate', validate);
router.post('/resetpassword',[check('newPassword').isLength({ min: 6 })], resetPassword);
router.patch('/addplan', userAddPlan);
router.patch('/addmeals', addMeals);
router.patch('/updateUser', updateUser);
export default router;