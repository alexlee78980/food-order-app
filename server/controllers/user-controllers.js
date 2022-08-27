import {validationResult} from 'express-validator';
import HttpError from '../models/http-error.js';
import getCoordsForAddress from '../util/location.js';
import { confirmation, sendResetPasswordEmail } from '../SendMail/passwordReset.js';
import User from '../models/UserSchema.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Plan from '../models/plansSchema.js';

// {
//     "name": "Alex", 
//     "email": "alexlee78980@gmail.com", 
//     "password": "test123", 
//     "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France"
// }
export const signUp = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, address, cell } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    address,
    location: coordinates,
    meals: 0,
    employee: false,
    validated: false,
    cell
  });

  try {
    await createdUser.save();
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }

  // try{
  //   confirmation(createdUser.id, createdUser.email);
  // }catch(err){
  //   const error = new HttpError(
  //     'Could not create user, please try again.',
  //     500
  //   );
  //   return next(error);
    
  // }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: createdUser.id,
    name:createdUser.name,
     email: createdUser.email,
      address: createdUser.address,
      location: createdUser.location,
      meals: createdUser.meals,
      employee: createdUser.employee,
      cell: createdUser.cell,
      validated: createdUser.validated,
      token: token
     });
};


export const LoginToken = async(req, res, next) =>{

  let existingUser;
  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'There is no user with this email, please sign up instead.',
      403
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
      res.status(201).json({ userId: existingUser.id,
        name:existingUser.name,
         email: existingUser.email,
          address: existingUser.address,
          location: existingUser.location,
          meals: existingUser.meals,
          employee: existingUser.employee,
          cell: existingUser.cell, 
          validated: existingUser.validated,
          token: token
         });
    console.log("logintoken");
};

export const Login = async(req, res, next) =>{
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'There is no user with this email, please sign up instead.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
      res.status(201).json({ userId: existingUser.id,
        name:existingUser.name,
         email: existingUser.email,
          address: existingUser.address,
          location: existingUser.location,
          meals: existingUser.meals,
          employee: existingUser.employee,
          cell: existingUser.cell, 
          validated: existingUser.validated,
          token: token
         });
};

export const userAddPlan = async(req,res,next) => {
  const {  mealId } = req.body;
  let existingUser;

  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'transaction failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      'cant find user.',
      500
    );
    return next(error);
  }
  let meals
  try {
    meals = await Plan.findById(mealId);
  } catch (err) {
    const error = new HttpError(
      'transaction failed, please try again later',
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      'cant find user.',
      500
    );
    return next(error);
    }
  if ((parseInt(existingUser.meals) + parseInt(meals.meals)) < 0){
    const error = new HttpError(
    "You don't have enough meals remaing, please go to plans to get more!",
      404
    );
    return next(error);
  };
  console.log(existingUser.meals);
  console.log(meals.meals)
  existingUser.meals = parseInt(existingUser.meals) +  parseInt(meals.meals);
  try {
    await existingUser.save();
    console.log(existingUser.meals);
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'transaction failed, please try again laters.',
      500
    );
    return next(error);
  }


  let plan;
  try {
    plan = await Plan.findById(meals.id);
  } catch (err) {
    const error = new HttpError(
      'adding failed.',
      500
    );
    return next(error);
  }
  if(!plan){
    const error = new HttpError(
      'Plan not found.',
      500
    );
    return next(error);
  }
  plan.count = plan.count + 1;
  try {
    plan.save();
  } catch (err) {
    const error = new HttpError(
      'adding failed.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: existingUser.id,
    name:existingUser.name,
    email: existingUser.email,
     address: existingUser.address,
     cell: existingUser.cell,
     employee: existingUser.employee,
     location: existingUser.location,
     meals: existingUser.meals,
     validated: existingUser.validated,
     token: token
     });


};


  

export const addMeals = async(req,res,next) => {
  const { meals  } = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'transaction failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      'cant find user.',
      500
    );
    return next(error);
  }
  console.log(existingUser);
  if ((parseInt(existingUser.meals) + parseInt(meals)) < 0){
    const error = new HttpError(
    "You don't have enough meals remaing, please go to plans to get more!",
      404
    );
    return next(error);
  };
  existingUser.meals = parseInt(existingUser.meals) +  parseInt(meals);
  try {
    await existingUser.save();
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'transaction failed, please try again laters.',
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: existingUser.id,
    name:existingUser.name,
    email: existingUser.email,
     address: existingUser.address,
     cell: existingUser.cell,
     employee: existingUser.employee,
     location: existingUser.location,
     meals: existingUser.meals,
     validated: existingUser.validated,
     token: token
     });


};



export const updateUser = async(req,res,next) => {
  const {name, cell, address} = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'transaction failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      'cant find user.',
      500
    );
    return next(error);
  }
  console.log(existingUser);
  if(name){
    existingUser.name = name;
  }
  if(address){
    existingUser.address = address;
  }
  if(cell){
    existingUser.cell = cell;
  }
  try {
    await existingUser.save();
  } catch (err) {
      console.log(err);
    const error = new HttpError(
      'Update failed, please try again later ',
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    const error = new HttpError(
      'Please enter a valid address',
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: existingUser.id,
    name:existingUser.name,
     email: existingUser.email,
      address: existingUser.address,
      cell: existingUser.cell,
      employee: existingUser.employee,
      location: coordinates,
      meals: existingUser.meals,
      validated: existingUser.validated,
      token: token
     });


};

export const sendResetPassword = async(req, res, next) =>{
  const {email} = req.body;
  let user;
  try{
    user = await User.findOne({email:email});
  }
  catch(err){ 
    const error = new HttpError("There was an error please try again", 500);
    return next(error);
  }
  console.log(!user);
  if (!user){
    const error = new HttpError("Can't find a user for the specified email", 404);
    return next(error);
  }
  try{
     await sendResetPasswordEmail(user.id,user.email);
  }
  catch(err){
    const error = new HttpError("Sending mail failed please try again", 500);
    return next(error);
  }
  res.status(201).json({ messsage: "success"});
};


export const resetPassword = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Please enter a password that is at least 6 characters.', 422)
    );
  }
  const {newPassword} = req.body;
  let existingUser;
  try{
    existingUser = await User.findById(req.userData.userId);
  }catch(err){
    const error = new HttpError("There was an error please try again", 500);
    next(error);
  }
  if (!existingUser){
    const error = new HttpError("Can't find a user for the specified email", 404);
    next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }
  existingUser.password = hashedPassword;
  try{
    await existingUser.save();
  }
  catch(err){
    console.log(err);
    const error = new HttpError("There was an error please try again", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: existingUser.id,
    name:existingUser.name,
     email: existingUser.email,
      address: existingUser.address,
      cell: existingUser.cell,
      employee: existingUser.employee,
      location: existingUser.location,
      meals: existingUser.meals,
      validated: existingUser.validated,
      token: token
     });

};


export const validate = async(req, res, next) => {
  let existingUser;
  try{
    existingUser = await User.findById(req.userData.userId);
  }catch(err){
    const error = new HttpError("There was an error please try again", 500);
    next(error);
  }
  if (!existingUser){
    const error = new HttpError("Can't find a user for the specified email", 404);
    next(error);
  }
  existingUser.validated = true;
  try{
    await existingUser.save();
  }
  catch(err){
    const error = new HttpError("There was an error please try again", 500);
    next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: existingUser.id,
    name:existingUser.name,
     email: existingUser.email,
      address: existingUser.address,
      cell: existingUser.cell,
      employee: existingUser.employee,
      location: existingUser.location,
      meals: existingUser.meals,
      validated: existingUser.validated,
      token: token
     });

};


export const sendValidate = async(req, res, next) => {
  const {email} = req.body;
  console.log(email);
  let existingUser;
  try{
    existingUser = await User.findOne({email:email});
  }catch(err){
    const error = new HttpError("There was an error please try again", 500);
    return next(error);
  }
  if (!existingUser){
    const error = new HttpError("Can't find a user for the specified email!", 404);
    return next(error);
  }
  try{
    await confirmation(existingUser.id , existingUser.email)
  }catch{
    const error = new HttpError("Can't send validation email please try again later", 404);
    return next(error);
  }
  console.log("sent");
  res.status(201).json({message:"sent"});

};