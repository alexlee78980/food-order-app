import React, { useEffect, useState, useContext} from "react";
import OrderItem from "./OrderItem.js";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context.js";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../other/Button";

export const sortdate = (arr, ascending) =>{
    const a = arr.sort(function(a,b){
        return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
      });
    console.log(a);
    if (ascending){
        return a.reverse();
    }
    return  a;
}



const OrderList = () => {
    const nav = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isSortingAscending = queryParams.get('sort') === 'asc';
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    const [isMyOrders, setIsMyOrders] =  useState("myorder");
    const [loadedPlans, setLoadedPlans] =useState([]);
    const auth =useContext(AuthContext);
    let loadedOrders = sortdate(loadedPlans, isSortingAscending);
    const foods = [
        {
            id: "f1",
            name: "Pizza",
            from: "Pizza place",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            img: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

        },
        {
            id: "f2",
            name: "Pasta",
            from: "Pasta place",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"

        },
        {
            id: "f3",
            name: "Salad",
            from: "Salad place",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            img: "https://images.pexels.com/photos/6836097/pexels-photo-6836097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

        }
    ];
    useEffect(()=>{
          fetchOrder();
    },[sendRequest]);

    const fetchOrder = async () => {
        try {
          const responseData = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/order/orders`
          );
          setLoadedPlans(responseData.orders);
        } catch (err) {
            console.log(err);
        }
      };

    if (loadedOrders.length === 0) {
        return (
          <div className="center">
              <h2>No orders at the moment, Please try again later.</h2>
          </div>
        );
      }
    const filteredOrder = loadedPlans.filter(order=> {
        return !order.claimed});
    const myDeliveries = loadedPlans.filter(order=> {
        return order.claimed == auth.userId});
    const myOrders = loadedPlans.filter(order=> {
        return order.email == auth.email});
    const myDelieveryHandler = () => {
        setIsMyOrders("myDelivery");
    };
    const allDelieveryHandler = () => {
        setIsMyOrders("allDeliveries");
    };
    const myOrderHandler = () => {
        setIsMyOrders("myorder");
    };
    console.log(isMyOrders);
    const sortList = (event) =>{
        console.log("clicked")
        nav(`${location.pathname}${'?sort=' + (isSortingAscending ? 'desc' : 'asc')}`);
    }
    console.log(loadedPlans);
    return (<div>
    {auth.employee && <React.Fragment> <Button onClick={myOrderHandler}>My Orders</Button> <Button onClick={allDelieveryHandler}>Pending Delieveries</Button> <Button onClick={myDelieveryHandler}>My Delieveries</Button> <Button onClick={sortList}>{isSortingAscending ? "Sort Descending" : "Sort Ascending"}</Button></React.Fragment>}
    {auth.employee && !error && isMyOrders.toString ()=="myDelivery" && myDeliveries.map(plan=>{return <OrderItem item={plan} reload={fetchOrder}></OrderItem>})}
    {auth.employee && !error && isMyOrders.toString ()=="allDeliveries" && filteredOrder.map(plan=>{return <OrderItem item={plan} reload={fetchOrder}></OrderItem>})}
    {!error && isMyOrders.toString ()=="myorder" && myOrders.map(plan=>{return <OrderItem item={plan} reload={fetchOrder}></OrderItem>})}
    </div>);
};
export default OrderList;