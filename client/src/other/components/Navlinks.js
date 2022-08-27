import { NavLink} from "react-router-dom"
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUtensils, faUser, faCalendar, faCartShopping, faAdd, faList} from "@fortawesome/free-solid-svg-icons";
import classes from "./Navlinks.module.css";
import { useContext, useState, useEffect } from "react";
import Button from "../Button";
import { AuthContext } from "../../context/auth-context";
import CartItem from "../../Cart/CartItem";
const NavLinks = (props) => {
    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);
    const btnClasses = `${classes.button} ${btnIsHighlighted ? classes.bump : ''}`;
    const auth =useContext(AuthContext);
    const items = auth.cart;
    useEffect(() => {
        if (items.length === 0) {
          return;
        }
        setBtnIsHighlighted(true);
    
        const timer = setTimeout(() => {
          setBtnIsHighlighted(false);
        }, 300);
    
        return () => {
          clearTimeout(timer);
        };
      }, [items]);

    const clicked = () => {
        if (auth.isLoggedIn){
            props.cart();
        }
    };
    return (<React.Fragment>
    <div className={classes.header}>
        <ul className={classes.menu}>
            <li className={classes.menu_list}>
                    <span className={classes.front}><FontAwesomeIcon icon={faHouse} /></span>
                    <NavLink className={classes.side} to="/home"> Home </NavLink>
                </li>
                <li className={classes.menu_list}>
                <span className={classes.front}><FontAwesomeIcon icon={faCalendar}/></span>
                    <NavLink className={classes.side} to="/plans"> Plans </NavLink>
                </li>
            <li className={classes.menu_list}>
                <span className={classes.front}><FontAwesomeIcon icon={faUtensils}/></span>
                    <NavLink className={classes.side} to="/foods"> Foods </NavLink>
                </li>
                <li className={classes.menu_list}>
                <span className={classes.front}><FontAwesomeIcon icon={faUser}/></span>
                    <NavLink className={classes.side} to="/login"> Sign Up </NavLink>
                </li>
                <li className={classes.menu_list}>
      <span className={`${classes.front} ${btnClasses}`}>
      <FontAwesomeIcon icon={faCartShopping}/>
      <span className={classes.badge}>{auth.total}</span>
      </span>
                {/* <span className={classes.front}><FontAwesomeIcon icon={faCartShopping}/><br/> <span className={`${classes.circleBase} ${classes.circle1} `}>10000</span></span> */}
                    <NavLink onClick={clicked} className={classes.side} to={auth.isLoggedIn ? "/foods": '/login'}> Cart </NavLink>
                </li>
            {auth.employee && <li className={classes.menu_list}>
            <span className={classes.front}><FontAwesomeIcon icon={faAdd}/></span>
                <NavLink className={classes.side} to=  "/add"> Add </NavLink>
            
            </li>}
            <li className={classes.menu_list}>
            <span className={classes.front}><FontAwesomeIcon icon={faList}/></span>
                <NavLink className={classes.side} to='/orders'> Orders </NavLink>
            </li>
        </ul>
        </div>
    </React.Fragment>);

}

export default NavLinks;