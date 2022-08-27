import schedule from 'node-schedule';
import nodemailer from "nodemailer";

import User from '../models/UserSchema.js';
import Order from '../models/orderSchema.js'
// import Vonage from "@vonage/server-sdk";

// const vonage = new Vonage({
//   apiKey: "72b32405",
//   apiSecret: "pYoSqzhuRITvWov2"
// }, {debug:true});

// const from = "13069861934"
// const to = "12365916082"
// const text = 'A text message'

// vonage.message.sendSms(from, to, text, (err, responseData) => {
//   if (err) {
//       console.log(err);
//   } else {
//       if(responseData.messages[0]['status'] === "0") {
//           console.log("Message sent successfully.");
//       } else {
//           console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//       }
//   }
// })
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "foodapp@zoho.com",
    pass: "Obear123$"
  }
});

export const Customer = (order) => {
  const reminderTimer = new Date(`${order.date}, ${order.time}`);
  const deiveredTimer = new Date(`${order.date}, ${order.time}`);
  reminderTimer.setTime(reminderTimer.getTime() - 60 * 60 * 1000);
  const htmlMessage = `<div><p>Hello ${order.name}, </p><p>
    Your order has been recieved!.
  </p>
  <a href= ${process.env.FRONT_END_URL}/orders>
  <button>Order Info</button>
</a>
<p>
       Thank you for choosing food simulator!!!
    </p></div>`

  const options = {
    from: "'foodapp' foodapp@zohomail.com",
    to: order.email,
    subject: "Order Placed",
    html: htmlMessage
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent" + info.response);
  });
  schedule.scheduleJob(reminderTimer, async () => {
    let updatedOrder;
    try {
      updatedOrder = await Order.findById(order.id);
    } catch (err) {
      console.log(err);
    }
    if (!updatedOrder) {
      return
    }
    let htmlMessage1;
    if (!updatedOrder.claimed) {
      htmlMessage1 = `<p>Hello ${order.name}, </p>
        <p>
         Your delivery from foodSimulator will be delivered in one hour!
       </p>
       <p>
       Thank you for choosing food simulator!!!
    </p>`
    } else {
      let employee;
      try {
        employee = await User.findById(updatedOrder.claimed);
      } catch (err) {
        console.log(err);
      }
      htmlMessage1 = `<p>Hello ${order.name}, </p>
      <p>
       Your delivery from foodSimulator will be delivered by ${employee.name}  in one hour!,
       </p>
       <p>
        Thank you for choosing food simulator!!!
     </p>`}
    const options = {
      from: "'foodapp' foodapp@zohomail.com",
      to: order.email,
      subject: "Reminder!!!",
      text: `Your delivery from foodSimulator is arriving to ${order.address} in one hour`,
      html: htmlMessage1
    }
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("sent" + info.response);
    });
  });


  schedule.scheduleJob(deiveredTimer, async () => {
    let updatedOrder;
    try {
      updatedOrder = await Order.findById(order.id);
    } catch (err) {
      console.log(err);
    }
    if (!updatedOrder) {
      return
    }
    try {
      updatedOrder = await Order.findById(order.id);
    } catch (err) {
      console.log(err);
    }
    if (!updatedOrder) {
      return
    }
    let htmlMessage2;
    if (!updatedOrder.claimed) {
      htmlMessage2 = `<p>Hello ${order.name}, </p>
        <p>
         Your delivery from foodSimulator will be delivered now!
       </p>
       <p>
        Thank you for choosing food simulator
     </p>`
    } else {
      let employee;
      try {
        employee = await User.findById(updatedOrder.claimed);
      } catch (err) {
        console.log(err);
      }
      htmlMessage2 = `<p>Hello ${order.name}, </p>
      <p>
       Your delivery from foodSimulator will be delivered by ${employee.name} now!
     </p>
     <p>
        Thank you for choosing food simulator
     </p>`}

    const options = {
      from: "'foodapp' foodapp@zohomail.com",
      to: order.email,
      subject: "Reminder!!!",
      text: `Your delivery from Food Startup is arriving to ${order.address} is in one hour`,
      html: htmlMessage2
    }

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("sent" + info.response);
      console.log(order.email);
    });
  });
  console.log("recieved customer")
}


export const OneHourEmployee = async (order, claimedId) => {
  let employee;
  try {
    employee = await User.findById(claimedId);
  } catch (err) {
    console.log(err);
  }
  const htmlMessage = `<h1>
    Your delivery to ${order.name} at ${order.address} is in one hour.
  </h1>
  <h2>${order.email} || ${order.cell}</h2>
  <ul>
  ${order.meals.map(m => {
    return `<li><h2>${m.amount} ${m.name} from ${m.from}</h2></li>`
  }).join("")}
  </ul>
  ${order.additionalMsg && `<h2>Additional Message: ${order.additionalMsg}</h2>`}`
  const reminderTimer = new Date(`${order.date}, ${order.time}`);
  reminderTimer.setTime(reminderTimer.getTime() - 60 * 60 * 1000);
  schedule.scheduleJob(reminderTimer, () => {
    const options = {
      from: "'foodapp' foodapp@zohomail.com",
      to: employee.email,
      subject: "Reminder!!!",
      text: `Your delivery to ${order.name} at ${order.address} is in one hour`,
      html: htmlMessage
    }
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("sent" + info.response);
      console.log(employee.email);
    });
  });
  console.log("recieved employee");
}


export const RemainingReminder = (user) => {
  const htmlMessage = `
  <div><p>Hello ${user.name}, </p><p>
    You have ${user.meals} meals remaining </p>
    <p> do you want to get more?
  </p>
  <a href= ${process.env.FRONT_END_URL}/plans>
  <button>Get More Meals</button>
</a>
<p>
       Thank you for choosing food simulator!!!
    </p></div>`
  const options = {
    from: "'foodapp' foodapp@zohomail.com",
    to: user.email,
    subject: "Reminder!!!",
    html: htmlMessage
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent" + info.response);
    console.log(employee.email);
  });
console.log("recieved Remaining Reminder");
};