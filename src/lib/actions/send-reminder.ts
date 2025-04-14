"use server"

import { db } from "@/server/db"
import { mailtrap} from "../mailtrap";
import { formatCurrency, formatDate } from "../format";

export async function sendReminder(invoiceId: string) {
    try{

        const invoice = await db.invoice.findUnique({
          where: { id: invoiceId },
        })
      
        if (!invoice) {
          throw new Error("Invoice not found")
        }
        const sender = {
          email: "hello@geninvoices.tanmay.space",
          name: invoice.fromName,
        };
        await mailtrap.send({
          from: sender,
          to: [{
              email: invoice.toEmail,
          }],
          template_uuid: process.env.SEND_REMINDER_TEMPLATE!,
          template_variables: {
      
            "ClientName": invoice.toName,
            "InvoiceNumber": invoice.invoiceName,
            "invoiceDate": formatDate(invoice.date),
            "dueDate": formatDate(new Date(invoice.date.getTime() + invoice.dueDate! * 24 * 60 * 60 * 1000)),
            "amount": formatCurrency({amount: invoice.total, currency: invoice.currency}).formatted,
            "fromName": invoice.fromName,
            "company_info_name": "GenInvoice",
            "company_info_address": "123, Delhi, India",
            "company_info_city": "Delhi",
            "company_info_zip_code": "110001",
            "company_info_country": "India",
            "invoiceURL": `${process.env.NEXT_PUBLIC_HOME_URL}/api/invoice/${invoice.id}`
          },
        }).then(console.log, console.error);

        return {success: "Reminder sent successfully"}
    }catch(error){
        console.error(error);
        return {error: "Failed to send reminder"}
    }

  
  
}
