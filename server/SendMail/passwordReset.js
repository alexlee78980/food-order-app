import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "foodapp@zoho.com",
    pass: "Obear123$"
  }
});


  
export const sendResetPasswordEmail = (id, email) =>{
console.log(id);
console.log(email);
let token;
  try {
    token = jwt.sign(
      { userId: id, email: email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
    const htmlMessage = `<div>
    <p>Reset password here:</p> 
  <a href= ${process.env.FRONT_END_URL}/resetpassword/${token}>
  here
</a>
<p> Link expires in 1 hour</p> 
</div>`

  const options = {
    from: "'foodapp' foodapp@zohomail.com",
    to: email,
    subject: "Reset Password",
    html: htmlMessage
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent" + info.response);
  });
};


export const confirmation = (id, email) =>{
  console.log(id);
  console.log(email);
  let token;
    try {
      token = jwt.sign(
        { userId: id, email: email },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
      const htmlMessage = `<div>
      <p>Click here to validate email:</p> 
    <a href= ${process.env.FRONT_END_URL}/confirmation/${token}>
    here
  </a>
  <p> Link expires in 1 hour</p> 
  </div>`
  
    const options = {
      from: "'foodapp' foodapp@zohomail.com",
      to: email,
      subject: "Confirmation email",
      html: htmlMessage
    }
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("sent" + info.response);
    });
  };