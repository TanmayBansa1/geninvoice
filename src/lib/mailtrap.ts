import {MailtrapClient} from "mailtrap";

export const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});

export const sender = {
  email: "hello@geninvoices.tanmay.space",
  name: "Mailtrap Test",
};

