import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger';

const smtp = config.get<{
  host: string;
  port: number;
  secure: boolean;
  service: string;
  user: string;
  pass: string;
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

export async function sendEmail(payload: SendMailOptions) {
  try {
    return await transporter.sendMail(payload);
  } catch (error) {
    const e = error as Error;
    log.error(`sendEmail: ${e.message}`);
    return null;
  }
}
