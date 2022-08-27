import React from "react"
import { useEffect } from "react";
import Card from "../other/Card";
import OrderList from "./component/OrderList";
const Orders = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);
    return (<Card>
        <h1>Orders</h1>
        <OrderList></OrderList>
    </Card>
    );
};

export default Orders;