import "dotenv/config";
import { transporter } from "../helpers/transporter.js";

const { EMAIL } = process.env;

export const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL };
  await transporter.sendMail(email);
  return true;
};
