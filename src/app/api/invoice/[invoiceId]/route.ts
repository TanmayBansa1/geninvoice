import { db } from "@/server/db";
import jsPDF from "jspdf"
import { formatCurrency, formatDate } from "@/lib/format";
import { NextResponse, type NextRequest } from "next/server";

export  async function GET(req: NextRequest, {
    params
}: {
    params: Promise<{invoiceId: string}>;
}){
    const { invoiceId } = await params;
    
    const invoice = await db.invoice.findUnique({
        where: {
            id: invoiceId,
        }
    })
    if(!invoice){
        return NextResponse.json({error: "Invoice not found"}, {status: 404})
    }
    const pdf= new jsPDF();
    //header
    pdf.setFont("helvetica", "bold", 24);
    pdf.text("Invoice", 20, 10);

    //create pdf as a buffer
// set font
pdf.setFont("helvetica");

//set header
pdf.setFontSize(24);
pdf.text(invoice.invoiceName, 20, 20);

// From Section
pdf.setFontSize(12);
pdf.text("From", 20, 40);
pdf.setFontSize(10);
pdf.text([invoice.fromName, invoice.fromEmail, invoice.fromAddress], 20, 45);

// Client Section
pdf.setFontSize(12);
pdf.text("Bill to", 20, 70);
pdf.setFontSize(10);
pdf.text([invoice.toName, invoice.toEmail, invoice.toAddress], 20, 75);

// Invoice details
pdf.setFontSize(10);
pdf.text(`Invoice Number: #${invoice.sno}`, 120, 40);
pdf.text(`Date: ${formatDate(invoice.date)}`, 120, 45);
if(invoice.status === "PENDING"){
  pdf.text(`Due Date: ${formatDate(new Date(invoice.date.getTime() + (invoice.dueDate ?? 0) * 24 * 60 * 60 * 1000))}`, 120, 50);
}else{
  pdf.text(`Paid Date: ${formatDate(invoice.date)}`, 120, 50);
}

pdf.text(`Status: ${invoice.status}`, 120, 55);

// Item table header
pdf.setFontSize(10);
pdf.setFont("helvetica", "bold");
pdf.text("Description", 20, 100);
pdf.text("Quantity", 100, 100);
pdf.text("Rate", 130, 100);
pdf.text("Total", 160, 100);

// draw header line
pdf.line(20, 102, 190, 102);

// Item Details
pdf.setFont("helvetica", "normal");
pdf.text(invoice.description, 20, 110);
pdf.text(invoice.quantity.toString(), 100, 110);
pdf.text(
  formatCurrency({
    amount: invoice.amount,
    currency: invoice.currency,
  }).formatted,
  130,
  110
);
pdf.text(
  formatCurrency({ amount: invoice.amount, currency: invoice.currency }).formatted,
  160,
  110
);

// Total Section
pdf.line(20, 115, 190, 115);
pdf.setFont("helvetica", "bold");
pdf.text(`Total (${invoice.currency})`, 130, 130);
pdf.text(
  formatCurrency({ amount: invoice.amount, currency: invoice.currency }).formatted,
  160,
  130
);

//Additional Note
if (invoice.note) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Note:", 20, 150);
  pdf.text(invoice.note, 20, 155);
}
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline"
        }
    })

}