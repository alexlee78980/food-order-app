import React from "react"
import Card from "../other/Card";
import { useEffect } from "react";
import './Home.css';
import Button from '../other/Button';
import Popular from "./components/Popular";
import Description from "./components/Description";
import { useState } from "react";
const Home = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);
    const setFalse = () =>{
        setShowInstructions(false);
    };
    
    const setTrue = () => {
        setShowInstructions(true);
    };
        return (<Card>
        <h1>Food Start up</h1>
        <div className="home">
        <div className="marginLeft">
        <Button onClick={showInstructions ? setFalse : setTrue}>{!showInstructions ? "Show Instructions" : "Hide Instructions"}</Button>
        </div>
        {showInstructions && <Description></Description>}
        <Popular></Popular>
        {/* <img src="https://th.bing.com/th/id/OIP.aIEiQK7E606QR6Tzz4BlNwHaE8?pid=ImgDet&rs=1"></img> */}
        </div>
    </Card>
    );
};

export default Home;