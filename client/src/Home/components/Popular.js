import './Popular.css';
import React from 'react';
import WhiteCard from './WhiteCard';
import Button from '../../other/Button';
import { useEffect } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const SlideShow = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [popPlan,setpopPlan] = useState();
  const [popFood,setPopFood] = useState();
  const nav = useNavigate();
  useEffect(() =>{
    const maxplan = async() =>{
  let request;
  try{
    request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/plan/maxplan`)
    setpopPlan(request.plan[0])
  }
  catch(err){
      console.log(err);
  }};
  const maxfood = async() =>{
    let request;
    try{
      request = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/food/maxfood`)
      setPopFood(request.food[0])
    }
    catch(err){
        console.log(err);
    }}
  maxfood();
  maxplan()}, []);

  const navigatePlan = () =>{
    nav(`/plans/${popPlan._id}`);
  };
  const navigateFood = () =>{
    nav(`/foods`);
  };
  return (<React.Fragment>
  {popFood && <div className='flex'>
    <div className='half'>
    <WhiteCard><h2>Most Popular Meal this Week</h2>
    <h3>{popFood.name} from {popFood.from}</h3>
    <div className='text'>
    {popFood.description}
    </div>
    <Button onClick={navigateFood}>View Now</Button></WhiteCard>
    </div>
    <div className='half'>
    <WhiteCard><img src={popFood.image}/></WhiteCard>
    </div>
  </div>}
  {popPlan &&
  <div className='flex'>
  <div className='half'>
    <WhiteCard><img src={popPlan.image}/></WhiteCard>
    </div>
    <div className='half'>
    <WhiteCard><h2>Most Popular Plan</h2>
    <h3>{popPlan.name}: {popPlan.meals} meals for ${popPlan.price}</h3>
    <div className='text'>
    {popPlan.description}
    </div>
    <Button onClick={navigatePlan}>View Now</Button></WhiteCard>
    </div>
  </div>}</React.Fragment>);
};

export default SlideShow;