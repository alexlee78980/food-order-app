import { useRef, useState, useContext } from 'react';

import classes from './Add.module.css';
import Card from '../other/Card';
import { useHttpClient } from '../hooks/http-hook';
import Button from '../other/Button';
import ErrorModal from '../error/ErrorModal';
import { AuthContext } from '../context/auth-context';
const isEmpty = (value) => value.trim() === '';

const Add = (props) => {
  const {isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth =  useContext(AuthContext);
  const [food, setFood] = useState(true);
  const [foodFormInputsValidity, setFoodFormInputsValidity] = useState({
    foodName: true,
    foodDescription: true,
    foodImage: true,
    foodFrom:true,
  });

  const [planFormInputsValidity, setPlanFormInputsValidity] = useState({
    planName: true,
    planDescription: true,
    planImage: true,
    planPrice:true,
    planMeals:true,
  });

  const FoodnameInputRef = useRef();
  const FoodDescriptionInputRef = useRef();
  const FoodImageInputRef = useRef();
  const FoodFromInputRef = useRef();

  const PlannameInputRef = useRef();
  const PlanDescriptionInputRef = useRef();
  const PlanImageInputRef = useRef();
  const PlanPriceInputRef = useRef();
  const PlanMealsInputRef = useRef();


  const foodconfirmHandler = async(event) => {
    event.preventDefault();

    const enteredFoodName = FoodnameInputRef.current.value;
    const enteredFoodDescription = FoodDescriptionInputRef.current.value;
    const enteredFoodImage = FoodImageInputRef.current.value;
    const enteredFoodFrom = FoodFromInputRef.current.value;

    const enteredFoodNameIsValid = !isEmpty(enteredFoodName);
    const enteredFoodDescriptionIsValid = !isEmpty(enteredFoodDescription);
    const enteredFoodImageValid = !isEmpty(enteredFoodImage);
    const enteredFoodFromValid = !isEmpty(enteredFoodFrom);

    setFoodFormInputsValidity({
      foodName: enteredFoodNameIsValid,
      foodDescription: enteredFoodDescriptionIsValid,
      foodImage: enteredFoodImageValid,
      foodFrom: enteredFoodFromValid,
    });

    const formIsValid =
    enteredFoodNameIsValid &&
    enteredFoodDescriptionIsValid &&
    enteredFoodImageValid &&
    enteredFoodFromValid 
    if (!formIsValid) {
      return;
    }

    FoodnameInputRef.current.value ='';
    FoodDescriptionInputRef.current.value = '';
    FoodImageInputRef.current.value= '';
    FoodFromInputRef.current.value =' ';
    let responseData;
    try{
      responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/food/addFood`, 'POST',  JSON.stringify({
      name: enteredFoodName,
      description: enteredFoodDescription,
      image: enteredFoodImage,
      from: enteredFoodFrom,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      }
    );
  } catch (err) {
      console.log(err);
  }
  };

  const planconfirmHandler = async(event) => {
    console.log("did");
    event.preventDefault();
    const enteredPlanName = PlannameInputRef.current.value;
    const enteredPlanDescription = PlanDescriptionInputRef.current.value;
    const enteredPlanImage = PlanImageInputRef.current.value;
    const enteredPlanPrice = PlanPriceInputRef.current.value;
    const enteredPlanMeals = PlanMealsInputRef.current.value;

    const enteredPlanNameIsValid = !isEmpty(enteredPlanName);
    const enteredPlanDescriptionIsValid = !isEmpty(enteredPlanDescription);
    const enteredPlanImageValid = !isEmpty(enteredPlanImage);
    const enteredPlanPriceValid = !isEmpty(enteredPlanPrice );
    const enteredPlanMealsValid = !isEmpty(enteredPlanMeals);
    setPlanFormInputsValidity({
      PlanName: enteredPlanNameIsValid,
      PlanDescription: enteredPlanDescriptionIsValid,
      PlanImage: enteredPlanImageValid,
      PlanPrice: enteredPlanPriceValid,
      PlanMeals: enteredPlanMealsValid,
    });
    const formIsValid =
    enteredPlanNameIsValid &&
    enteredPlanDescriptionIsValid &&
    enteredPlanImageValid &&
    enteredPlanMealsValid &&
    enteredPlanPriceValid
    if (!formIsValid) {
      return;
    }
    PlannameInputRef.current.value = '';
    PlanDescriptionInputRef.current.value = '';
    PlanImageInputRef.current.value = '';
    PlanPriceInputRef.current.value = '';
    PlanMealsInputRef.current.value = '';
    let responseData;
      try{
        responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/plan/addPlan`, 'POST',  JSON.stringify({
        name: enteredPlanName,
        description: enteredPlanDescription,
        image: enteredPlanImage,
        price: enteredPlanPrice,
        meals:enteredPlanMeals
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
    } catch (err) {
        console.log(err);
    }
  };


  const planNameControlClasses = `${classes.control} ${
    planFormInputsValidity.planName ? '' : classes.invalid
  }`;
  const planDescriptionControlClasses = `${classes.control} ${
    planFormInputsValidity.planDescription ? '' : classes.invalid
  }`;
  const planImageControlClasses = `${classes.control} ${
    planFormInputsValidity.planImage ? '' : classes.invalid
  }`;
  const planMealsControlClasses = `${classes.control} ${
    planFormInputsValidity.planMeals ? '' : classes.invalid
  }`;
  const planPriceControlClasses = `${classes.control} ${
    planFormInputsValidity.planPrice ? '' : classes.invalid
  }`;

  const foodNameControlClasses = `${classes.control} ${
    foodFormInputsValidity.foodName ? '' : classes.invalid
  }`;
  const foodDescriptionControlClasses = `${classes.control} ${
    foodFormInputsValidity.foodDescription ? '' : classes.invalid
  }`;
  const foodImageControlClasses = `${classes.control} ${
    foodFormInputsValidity.foodImage ? '' : classes.invalid
  }`;
  const foodFromControlClasses = `${classes.control} ${
    foodFormInputsValidity.foodFrom ? '' : classes.invalid
  }`;
  console.log(planFormInputsValidity);
  const PlanHandler  = () => {
    setFood(false);
  };
  const FoodHandler  = () => {
    setFood(true);
  };
  return (
    <Card>
    {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
    <h1>
      Add
    </h1>
    <Button onClick={FoodHandler}>Food</Button><Button onClick={PlanHandler}>Plan</Button>
    {food && <form className={classes.form} onSubmit={foodconfirmHandler}>
      <div className={foodNameControlClasses}>
        <label htmlFor='namefood'>Food Name</label>
        <input type='text' id='namefood' ref={FoodnameInputRef} />
        {!foodFormInputsValidity.foodName && <p>Please enter a valid name!</p>}
      </div>
      <div className={foodDescriptionControlClasses}>
        <label htmlFor='descriptionfood'>Food description</label>
        <input type='text' id='descriptionfood' ref={FoodDescriptionInputRef} />
        {!foodFormInputsValidity.foodDescription && <p>Please enter a valid description!</p>}
      </div>
      <div className={foodImageControlClasses}>
        <label htmlFor='imagefood'>Image url</label>
        <input type='text' id='imageFood' ref={FoodImageInputRef} />
        {!foodFormInputsValidity.foodImage && <p>Please enter a valid image!</p>}
      </div>
      <div className={foodFromControlClasses}>
        <label htmlFor='from'>Food From</label>
        <input type='text' id='from' ref={FoodFromInputRef} />
        {!foodFormInputsValidity.foodFrom && <p>Please enter a valid name!</p>}
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
      
    </form>}

    {!food && <form className={classes.form} onSubmit={planconfirmHandler}>
      <div className={planNameControlClasses}>
        <label htmlFor='name'>Plan Name</label>
        <input type='text' id='name' ref={PlannameInputRef} />
        {!planFormInputsValidity.planName && <p>Please enter a valid name!</p>}
      </div>
      <div className={planDescriptionControlClasses}>
        <label htmlFor='address'>Plan Description</label>
        <input type='text' id='address' ref={PlanDescriptionInputRef} />
      </div>
      <div className={planImageControlClasses}>
        <label htmlFor='date'>Image URL</label>
        <input type='text' id='date' ref={PlanImageInputRef} />
        {!planFormInputsValidity.planPrice && <p>Please enter a valid URL!</p>}
      </div>
      <div className={planPriceControlClasses}>
        <label htmlFor='price'>Plan Price</label>
        <input type='number' id='price' ref={PlanPriceInputRef} />
        {!planFormInputsValidity.planPrice && <p>Please enter a valid price!</p>}
      </div>
      <div className={planMealsControlClasses}>
        <label htmlFor='time'># of meals</label>
        <input type='number' id='time' ref={PlanMealsInputRef} />
        {!planFormInputsValidity.planMeals && <p>Please enter a valid number!</p>}
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
      
    </form>}
    </Card>
  );
};

export default Add;
