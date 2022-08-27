import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import classes from './CartItem.module.css';

const CartItem = (props) => {
  const auth = useContext(AuthContext);
  const onChange = (event) =>{
    props.onChange(event.target.value);
  };
  return (
    <li className={classes['cart-item']}>
      <div>
        <h2>{props.name}</h2>
        <div className={classes.summary}>
          <span className={classes.price}>{props.from}</span>
          {!props.dontshow &&<input type="number" className={classes.amountInput} onChange={onChange} value={props.amount}></input>}
        </div>
      </div>
      <div className={classes.actions}>
       {!props.price && <button onClick={props.onRemove}>−</button>}
       {!props.price && <button onClick={props.onAdd}>+</button>}
      </div>
    </li>
  );
};

export default CartItem;
