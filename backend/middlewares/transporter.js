import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port: 465,
secure: true,
auth: {
    user: "mindcorp2022@gmail.com",
    pass: "hxnzrvawfmmlemuq",
},
});


transporter.verify().then(() => {
console.log("Ready for send to emails");
});



export default transporter;