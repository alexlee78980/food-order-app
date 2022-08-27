import React,{ useEffect, useState } from "react";
import FoodItem from "./FoodItem.js";
import './FoodList.css';
import { useHttpClient } from "../../hooks/http-hook.js";
import Modal from "../../other/Modal.js";
import Button from "../../other/Button.js";

const sortList = (list) =>{
  const l = list;
  list.sort((a, b)=>{
    return b.count - a.count
  })
  return l;
}
const FoodList = () => {
    
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedFoods, setLoadedFoods] =useState([]);
    const [sort, setSort] = useState('Sort Default');
    const defaultList = [...loadedFoods]
    const foodlist = sort == 'Sort Most Popular' ? sortList(defaultList) : loadedFoods;
    useEffect(()=>{
          fetchFood();
    },[sendRequest]);

    const fetchFood = async () => {
        try {
          const responseData = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/food/foods`
          );
          setLoadedFoods(responseData.foods);
        } catch (err) {
            console.log(err);
        }
      };
      if (loadedFoods.length === 0) {
        return (
          <div className="center">
              <h2>No meals, Please try again later.</h2>
          </div>
        );
      }
    const sortDefault = () => {
      console.log('sort');
      setSort('Sort Default');
    };

    const sortPop = () => {
      console.log('sort');
      setSort('Sort Most Popular');
      fetchFood();
    };
    return (
      <React.Fragment>
     	<div className="sec-center"> 	
	  	<input className="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
	  	<label className="for-dropdown" for="dropdown">{sort}<i className="uil uil-arrow-down"></i></label>
  		<div className="section-dropdown"> 
  			<a onClick={sortDefault}>Sort Default <i className="uil uil-arrow-right"></i></a>
  			<a onClick={sortPop}>Sort Most Popular <i className="uil uil-arrow-right"></i></a>
  		</div>
  	</div>
    {foodlist.map(food=>{return <FoodItem item={food} fetch={fetchFood} ></FoodItem>})}
    </React.Fragment>);
};
export default FoodList;