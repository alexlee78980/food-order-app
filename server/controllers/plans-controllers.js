import Plan from "../models/plansSchema.js";
import HttpError from "../models/http-error.js";
import User from "../models/UserSchema.js";

// {
//     "name": "Plan 1",
//     "price": "200.00",
//     "meals", 20,
//     
//     "image": "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     "description": "dfdsgfsghfdgdggfgfdddffdgdfddfgfdgfdgdfgdfg"
// }
export const addPlan = async(req, res, next) => {
    const {name, description, image, price, meals} =  req.body;
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
    const plan = new Plan({
        name,
        description,
        image,
        price,
        meals,
        count: 0
    });
    try {
        await plan.save();
    }
    catch (err) {
        console.log(err);
      const error = new HttpError(
        "Can't add new plan, please try again later.",
        500
      );
    }
    console.log("Recieved");
    res.status(201).json({ id: plan.id, name: plan.name, 
        description: plan.description, image: plan.image, count: plan.count, meals: plan.meals, price: plan.price});
};

export const allPlan = async(req, res, next) => {
    let plans;
    try {
        plans = await Plan.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching plans failed, please try again later.',
          500
        );
        return next(error);
      }
      res.json({plans : plans.map(plan=>{return { id: plan.id, name: plan.name, 
        description: plan.description, image: plan.image, count: plan.count, meals: plan.meals, price: plan.price} }) });
    };

  

    export const deletePlan = async(req, res, next) => {
      
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
      let plan;
      try {
        plan = await Plan.findByIdAndRemove(id);
      } catch (err) {
        const error = new HttpError(
          'Fetching plans failed, please try again laters.',
          500
        );
        return next(error);
      }
      res.json({message: "deleted"});
      console.log("deleted");
    };


    export const findMaxPlan = async(req, res, next) => {
      let maxPlan;
      try{
      maxPlan = await Plan.find().sort({"count":-1}).limit(1);
      }catch(err){
        const error = new HttpError(
          'Fetching plans failed, please try again laters.',
          500
        );
        return next(error);
      }
      res.json({plan:maxPlan});
    }