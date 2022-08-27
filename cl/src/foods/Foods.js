import React from "react"
import { useEffect } from "react";
import Card from "../other/Card";
import FoodList from "./components/FoodList.js";
const Food = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);
    return (<Card>
        <h1>Meals of the Week</h1>
        <FoodList></FoodList>
    </Card>
    );
};

export default Food;