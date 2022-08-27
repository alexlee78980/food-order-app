import Order from "../models/orderSchema.js";
import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";
import jwt from 'jsonwebtoken';
import Food from '../models/foodsSchema.js';
import User from "../models/UserSchema.js";
import { Customer, OneHourEmployee, RemainingReminder } from "../SendMail/sendReminder.js";

// {
//     "name": "Plan 1",
//     "price": "200.00",
//     "meals", 20,
//     
//     "image": "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     "description": "dfdsgfsghfdgdggfgfdddffdgdfddfgfdgfdgdfgdfg"
// }
// export const addOrder = async(req, res, next) => {
//     const {name, email, address, date, time, meals,cell, additionalMsg} =  req.body;
//     let coordinates;
//   try {
//     coordinates = await getCoordsForAddress(address);
//   } catch (error) {
//     return next(error);
//   }
//     const order = new Order({
//         name,
//         email,
//         address,
//         location:coordinates,
//         date,
//         time,
//         cell,
//         meals,
//         additionalMsg,
//         claimed:null
//     });
//     try {
//         await order.save();
//     }
//     catch (err) {
//         console.log(err);
//       const error = new HttpError(
//         "Can't add new plan, please try again later.",
//         500
//       );
//     }
//     Customer(order);
//     res.status(201).json({ id: order.id, name: order.name,
//         email: order.email,
//         address: order.address,
//         location: order.location,
//         date: order.date,
//         time: order.time,
//         cell:order.cell,
//         meals: order.meals,
//         additionalMsg: order.additionalMsg,
//       claimed:order.claimed});
// };
export const addOrder = async (req, res, next) => {
  const { name, address, date, time, meals, cell, additionalMsg } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  let existingUser;
  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    return next(err);
  }
  if (!existingUser) {
    return next(new HttpError(
      "User Not Found.",
      500
    ));
  }
  const order = new Order({
    name,
    email: existingUser.email,
    address,
    location: coordinates,
    date,
    time,
    cell,
    meals,
    additionalMsg,
    claimed: null
  });
  try {
    await order.save();
  }
  catch (err) {
    const error = new HttpError(
      "Can't add new plan, please try again later.",
      500
    );
    return next(error);
  }
  Customer(order);
  await meals.forEach(async (meal) => {
    let food;
    try {
      food = await Food.findById(meal.id);
    } catch (err) {
      return next(err);
    }
    if (isFinite(food.count)) {
      food.count += meal.amount;
    }
    existingUser.meals = existingUser.meals - meal.amount;
    try {
      await food.save();
    } catch (err) {
      return next(err);
    }
    try {
      await existingUser.save();
    } catch (err) {
      return next(err);
    }
  });
  try {
    await existingUser.save();
  } catch (err) {
    return next(err);
  }
  console.log(existingUser.meals);
  if (existingUser.meals < 5) {
    RemainingReminder(existingUser);
  };
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
  console.log(existingUser.meals);
  res.status(201).json({
    userId: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    address: existingUser.address,
    location: existingUser.location,
    meals: existingUser.meals,
    employee: existingUser.employee,
    cell: existingUser.cell,
    validated:existingUser.validated,
    token: token
  });
};


export const claimOrder = async (req, res, next) => {
  const { orderid } = req.body;
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'fetching user failed.',
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      'No user found with this id.',
      500
    );
    return next(error);
  }
  if (!user.employee) {
    const error = new HttpError(
      'Not authorized to delete.',
      500
    );
    return next(error);
  }
  let order;
  try {
    order = await Order.findById(orderid);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong.',
      500
    );
  }
  if (!order) {
    const error = new HttpError('Could not find order for provided id.', 404);
    return next(error);
  }
  if (order.claimed) {
    const error = new HttpError(
      'Order has already been claimed by.',
      422
    );
    return next(error);
  }
  order.claimed = user;
  try {
    order.save();
  } catch (err) {
    const error = new HttpError(
      'Claiming order failed, please try again.',
      500
    );
    return next(error);
  }
  OneHourEmployee(order, req.userData.userId);
  res.json({
    id: order.id, name: order.name,
    email: order.email,
    address: order.address,
    location: order.location,
    date: order.date,
    time: order.time,
    cell: order.cell,
    meals: order.meals,
    additionalMsg: order.additionalMsg,
    claimed: order.claimed
  });
};

export const allOrder = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching plans failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({
    orders: orders.map(order => {
      return {
        id: order.id, name: order.name,
        email: order.email,
        address: order.address,
        location: order.location,
        date: order.date,
        time: order.time,
        cell: order.cell,
        meals: order.meals,
        additionalMsg: order.additionalMsg,
        claimed: order.claimed
      }
    })
  });
};

export const deleteOrder = async (req, res, next) => {
  const {orderid} = req.body;
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("user not found, please reload the page and try again", 404);
    return next(error);
  }
  if (!user){
    const error = new HttpError("user not found, please reload the page and try again", 404);
    return next(error);
  }
  let order;
  try {
    order = await Order.findById(orderid);
  } catch (err) {
    const error = new HttpError("order not found, please reload the page and try again", 404);
    return next(error);
  }
  if (!order) {
    const error = new HttpError("order not found, please reload the page and try again", 404);
    return next(error);
  }
  if (order.email != user.email){
    const error = new HttpError("not authorized to delete order", 404);
    return next(error);
  }
  order.meals.forEach((meal) => {
    user.meals = parseInt(user.meals) + parseInt(meal.amount);
    console.log(user.meals);
  })
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Failed to restore meals", 404);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: user.id},
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'token creation Failed.',
      500
    );
    return next(error);
  }
  let deleteOrder
  try {
    deleteOrder = await Order.findByIdAndDelete(orderid);
  } catch (err) {
    const error = new HttpError("order not found, please reload the page and try again", 404);
    return next(error);
  }
  res.json({
    userId: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    location: user.location,
    meals: user.meals,
    employee: user.employee,
    cell: user.cell,
    validated: user.validated,
    token: token
  });
  console.log("order cancelled");
};


export const finishedOrder = async (req, res, next) => {
  const { claimed, orderid } = req.body;
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'fetching user failed.',
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      'No user found with this id.',
      500
    );
    return next(error);
  }
  if (!user.employee) {
    const error = new HttpError(
      'Not authorized to delete.',
      500
    );
    return next(error);
  }
  let order;
  try {
    order = await Order.findById(orderid);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong.',
      500
    );
  }
  if (!order) {
    const error = new HttpError('Could not find order for provided id.', 404);
    return next(error);
  }
  if(order.claimed != req.userData.userId){
    const error = new HttpError(
      'Not authorized to finish order.',
      500
    );
    return next(error);
  }
  let delorder;
  try {
    delorder = await Order.findOneAndDelete({ id: orderid, claimed: claimed });
  } catch (err) {
    const error = new HttpError("order not found, please reload the page and try again", 404);
    return next(error);
  }
  if (!delorder) {
    const error = new HttpError("cant find this order", 500);
    return next(error);
  }
  res.json("finished");
  console.log('finished');
}