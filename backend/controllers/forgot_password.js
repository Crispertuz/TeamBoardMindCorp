import forgotPassword from "../models/forgot_password.js";
import user from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import transporter from "../middlewares/transporter.js";
import dotenv from "dotenv";
import moment from "moment";
import bcrypt from 'bcrypt'
dotenv.config();

const forgottenPassword = async (req, res) => {
  if (!req.body.email)
    return res.status(400).send({ message: "Incomplete data" });

  const userExists = await user.findOne({ email: req.body.email });
  if (!userExists) return res.status(400).send({ message: "user not exists" });

  const passwordRequestId = uuidv4();

  var expiredDate = moment().add(60, "minutes").toDate();

  const requestPassword = new forgotPassword({
    email: req.body.email,
    forgotPasswordCode: passwordRequestId,
    expireDate: expiredDate,
  });
  const result = await requestPassword.save();
  if (!result) {
    res.status(400).send({ message: "Error recovering password" });
  } else {
    let requestPasswordLink = "http://localhost:4200/forgottenPasswordConfirm";

    const info = await transporter.sendMail({
      from: `"Forgot password " <mindcorp2022@gmail.com>`,
      to: req.body.email,
      subject: "Forgot password? ✔",
      html: `
      <p>Hello ${req.body.email} </p>
      <p>if you want to reset your password \n
      Please <a href="${requestPasswordLink}/${passwordRequestId}">click here</a></p>
      \n
      \n
      <p>if you did not make this request, skip the message</p>`,
    });

    return !info
      ? res.status(400).send({ message: "error sending mail" })
      : res.status(200).send({ message: "email sent" });
  }
};

const forgottenPasswordConfirm = async (req, res) => {
  if (!req.body.password || !req.body.passwordConfirm)
    return res.status(400).send({ message: "Incomplete data" });

  const findPasswordRecover = await forgotPassword.findOne({ forgotPasswordCode: req.body.forgotPasswordCode});
  
    if(findPasswordRecover.codeUsed === 1) return res.status(400).send({ message: "The code already used. Send new request of recover password" });

  /* if(findPasswordrecover.expireDate > moment())
  return res.status(400).send({message: "Time has expired"})*/

  const findUser = await user.findOne({email: findPasswordRecover.email});
  if(!findUser) return res.status(400).send({message: "User not exists"});



  let pass = "";
  if (req.body.password === req.body.passwordConfirm) {
    const passHash = await bcrypt.compare(req.body.password, findUser.password);
    if (passHash) {
        return res.status(400).send({message: "Can't use a password entered previously",});
    } else {
        const codeUseUpdate = await forgotPassword.findByIdAndUpdate(findPasswordRecover._id, {
            codeUsed: 1
        });
        if(!codeUseUpdate) res.status(400).send({ message: "Error updating code used" })
        
        pass = await bcrypt.hash(req.body.password, 10);
    }
  } else{
    return res.status(400).send({ message: "The password are not the same" });
  }

  const userUpdate = await user.findByIdAndUpdate(findUser._id, {
    password: pass,
  });

  return !userUpdate
    ? res.status(400).send({ message: "error retrieving password" })
    : res.status(200).send({ message: "password recovered" });
};



export default { forgottenPassword, forgottenPasswordConfirm};
