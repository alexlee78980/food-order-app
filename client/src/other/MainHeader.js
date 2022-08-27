import React from "react"
import HeaderCard from "./components/HeaderCard";
import NavLinks from "./components/Navlinks";
const MainHeader = (props) => {
    return (<HeaderCard>
    <NavLinks cart={props.cart}/>
    </HeaderCard>);
};


export default MainHeader;