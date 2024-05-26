import "dotenv/config";
import { transporter } from "../helpers/transporter.js";

const { EMAIL } = process.env;

export const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL, subject: "Welcome in our app" };
  await transporter.sendMail(email);
  return true;
};
