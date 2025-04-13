import {MailtrapClient} from "mailtrap";

export const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});


