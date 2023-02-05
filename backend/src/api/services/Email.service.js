//This is the Email service for sending emails using nodemailer
import nodemailer from "nodemailer";
const auth = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth,
});

//Send auto generated password to user
const sendPassword = async (email, password) => {
  const mailOptions = {
    from: auth.user,
    to: email,
    subject: "Your Password",
    text: `Your password is ${password}`,
  };
  await transporter.sendMail(mailOptions).catch((err) => {
    console.log(err);
  });
};

module.exports = { sendPassword };
