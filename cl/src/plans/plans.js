import React from "react"
import { useEffect } from "react";
import Card from "../other/Card";
import PlanList from "./component/PlansList";
const Plans = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);
    return (<Card>
        <h1>Meal Plans</h1>
        <PlanList></PlanList>
    </Card>
    );
};

export default Plans;