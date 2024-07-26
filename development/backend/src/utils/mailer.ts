import { config } from "../../config";
import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";

const mailer = config.get("mailer");

const transporter = nodemailer.createTransport({
  ...mailer,
  auth: {
    user: mailer.user,
    pass: mailer.pass,
  },
});

export async function sendEmail(payload: SendMailOptions) {
  try {
    const info = await transporter.sendMail(payload);
    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
  } catch (error) {
    const e = error as Error;
    log.error(`sendEmail: ${e.message}`);
    return null;
  }
}
