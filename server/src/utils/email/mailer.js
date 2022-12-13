import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_TRANSPORT_NAME, 
    pass: process.env.MAIL_TRANSPORT_PASSWORD, //generated in google account cofigs: 1) enable 2fa; 2) create "app password"
  },
});

export async function sendMail({email, text, html, subject}) {

    let info = await transporter.sendMail({
        from: process.env.MAIL_TRANSPORT_NAME, 
        to: email, 
        subject, 
        text: text, 
        html: html, 
    });
}