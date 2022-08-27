import { useEffect, useState } from "react";
import PlanItem from "./PlansItem.js";
import { useHttpClient } from "../../hooks/http-hook";
import '../../foods/components/FoodList.css'
const sortList = (list) =>{
    const l = list;
    l.sort((a, b)=>{
      return b.count - a.count
    })
    return l;
  }
const PlanList = () => {
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlans, setLoadedPlans] =useState([]);
    const [sort, setSort] = useState('Sort Default');
    const defaultList = [...loadedPlans]
    const Planlist = sort == 'Sort Most Popular' ? sortList(defaultList) : loadedPlans;
    useEffect(()=>{
          fetchPlan();
    },[sendRequest]);
    const fetchPlan = async () => {
        try {
          const responseData = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/plan/plans`
          );
          setLoadedPlans(responseData.plans);
        } catch (err) {
            console.log(err);
        }
      };

      const sortDefault = () => {
        console.log('sort');
        setSort('Sort Default');
      };
  
      const sortPop = () => {
        console.log('sort');
        setSort('Sort Most Popular');
        fetchPlan();
      };
    if (loadedPlans.length === 0) {
        return (
          <div className="center">
              <h2>No meal plans, Please try again later.</h2>
          </div>
        );
      }
    return (<div>
     	<div className="sec-center"> 	
	  	<input className="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
	  	<label className="for-dropdown" for="dropdown">{sort}<i className="uil uil-arrow-down"></i></label>
  		<div className="section-dropdown"> 
  			<a onClick={sortDefault}>Sort Default <i className="uil uil-arrow-right"></i></a>
  			<a onClick={sortPop}>Sort Most Popular <i className="uil uil-arrow-right"></i></a>
  		</div>
  	</div>
    {!error && Planlist.map(plan=>{return <PlanItem item={plan} fetch={fetchPlan}></PlanItem>})}
    </div>);
};
export default PlanList;









// const foods = [
//     {
//         id: "f1",
//         name: "Pizza",
//         from: "Pizza place",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         img: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

//     },
//     {
//         id: "f2",
//         name: "Pasta",
//         from: "Pasta place",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"

//     },
//     {
//         id: "f3",
//         name: "Salad",
//         from: "Salad place",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         img: "https://images.pexels.com/photos/6836097/pexels-photo-6836097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

//     }
// ];