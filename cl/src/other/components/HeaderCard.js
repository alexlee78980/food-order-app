import classes from './HeaderCard.module.css';
import { NavLink } from 'react-router-dom';
const HeaderCard = (props) => {
    return (<div className={classes.header}>{props.children}</div>);
};
export default HeaderCard;