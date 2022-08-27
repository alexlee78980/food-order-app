import WhiteCard from "./WhiteCard";
import './Description.css'
const Description = () => {
  return (
      <div>
       <div className="half">
    <WhiteCard>
    <div className="center">
    <h3>There are two types of users for this app:     </h3>
    </div>
    <div className="center">
    <h3>1) Customers</h3>
    </div>
    <div className="center">
    <h3>2) Employees</h3>
    </div>
    
    </WhiteCard>
    </div>
  <div className="flex">
    <div className="half">
    <WhiteCard> <div className="center">
    <h3>Customers</h3>
    </div>
    <h3>1) In "Sign up", Sign up account</h3>
    <br/>
    <h3>2) In "Plans", pick and buy meal plan (leave "fake credit card" input blank as this is a simulator)</h3>
    <br/>
    <h3>3) In "Foods", Add the food(s) you want to cart and proceed to cart to checkout</h3>
    <br/>
    <h3>4) In "Orders", you can check for updates on your order </h3>
    <br/>
    <h3>5) Will recieve 2 automated emails to remind you of delievery (One hour before delivered time, and at delivered time) </h3>
    </WhiteCard>
    </div>
    <div className="half">
    <WhiteCard>
    <div className="center">
    <h3>Employees</h3>
    </div>
    <h3>1) Need to be given employee access after signing up</h3>
    <br/>
    <h3>2) Can perform all actions of customers</h3>
    <br/>
    <h3>3) Can delete and add new plans and foods</h3>
    <br/>
    <h3>4) In orders tab, employees can claim orders (unclaimed order with red background color is marked urgent because the delivery time is in 2 hour or less) </h3>
    <br/>
    <h3>5) Will recieve 1 automated email to remind you of delievery (One hour before delivered time) </h3>
    </WhiteCard>
    </div>
  </div>
  </div>);
};

export default Description;