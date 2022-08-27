import Food from "../models/foodsSchema.js";
import HttpError from "../models/http-error.js";
import User from "../models/UserSchema.js";


// {
//     "name": "Pizza",
//     "from": "Pizza Place",
//     "image": "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
// }
export const addFood = async(req, res, next) => {
    const {name, description, image, from} =  req.body;
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
    if (!user){
      const error = new HttpError(
        'No user found with this id.',
        500
      );
      return next(error);
    }
    if(!user.employee){
      const error = new HttpError(
        'Not authorized to delete.',
        500
      );
      return next(error);
    }
    const food = new Food({
        name,
        description,
        image,
        from,
        count: 0
    });
    try {
        await food.save();
    }
    catch (err) {
        console.log(err);
      const error = new HttpError(
        "Can't add new food, please try again later.",
        500
      );
    }
    console.log("recieved");
    res.status(201).json({ id: food.id, name: food.name, 
        description: food.description, image: food.image, from: food.from, count: food.count});
};

export const allFood = async(req, res, next) => {
    let foods;
    try {
        foods = await Food.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching foods failed, please try again later.',
          500
        );
        return next(error);
      }
      res.json({foods: foods.map(food=>{return { id: food.id, name: food.name, 
        description: food.description, image: food.image, from: food.from, count: food.count} }) });
    };


    export const deleteFood = async(req, res, next) => {
      
      const {id} = req.body;
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
      if (!user){
        const error = new HttpError(
          'No user found with this id.',
          500
        );
        return next(error);
      }
      if(!user.employee){
        const error = new HttpError(
          'Not authorized to delete.',
          500
        );
        return next(error);
      }
      let food;
      try {
        food = await Food.findByIdAndRemove(id);
      } catch (err) {
        const error = new HttpError(
          'Fetching foods failed, please try again laters.',
          500
        );
        return next(error);
      }
      res.json({message: "deleted"});
      console.log("deleted");
    };


    export const maxCountFood = async(req, res, next) => {
      let food;
      try {
        food = await Food.find().sort({"count":-1}).limit(1);
      } catch (err) {
        const error = new HttpError(
          'Fetching foods failed, please try again laters.',
          500
        );
        return next(error);
      }
      res.json({food});
    };