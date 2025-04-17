import { db } from "@/server/db";
import jsPDF from "jspdf";
import { formatCurrency, formatDate } from "@/lib/format";
import { NextResponse, type NextRequest } from "next/server";
import { redis } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(50, "1 m"), // 50 requests per minute
  analytics: true,
});

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
  const clientIp = getClientIp(req);
  const { success } = await ratelimit.limit(clientIp);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { invoiceId } = await params;

  const invoice = await db.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  const pdf = new jsPDF();
  //header
  pdf.setFont("helvetica", "bold", 24);
  pdf.text("Invoice", 20, 10);

  // set font
  pdf.setFont("helvetica");

  //set header
  pdf.setFontSize(24);
  pdf.text(invoice.invoiceName, 20, 20);

  // From Section
  pdf.setFontSize(12);
  pdf.text("From", 20, 40);
  pdf.setFontSize(10);

  // Split address into lines
  const fromAddressLines = pdf.splitTextToSize(invoice.fromAddress, 60);
  pdf.text([invoice.fromName, invoice.fromEmail, ...fromAddressLines], 20, 45);

  // Client Section
  pdf.setFontSize(12);
  pdf.text("Bill to", 20, 70);
  pdf.setFontSize(10);

  // Split address into lines
  const toAddressLines = pdf.splitTextToSize(invoice.toAddress, 60);
  pdf.text([invoice.toName, invoice.toEmail, ...toAddressLines], 20, 75);

  const invoiceDetailsY = 40;
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: #${invoice.sno}`, 120, invoiceDetailsY);
  pdf.text(`Date: ${formatDate(invoice.date)}`, 120, invoiceDetailsY + 5);
  if (invoice.status === "PENDING") {
    pdf.text(
      `Due Date: ${formatDate(new Date(invoice.date.getTime() + (invoice.dueDate ?? 0) * 24 * 60 * 60 * 1000))}`,
      120,
      invoiceDetailsY + 10,
    );
  } else {
    pdf.text(
      `Paid Date: ${formatDate(invoice.date)}`,
      120,
      invoiceDetailsY + 10,
    );
  }
  pdf.text(`Status: ${invoice.status}`, 120, invoiceDetailsY + 15);

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
  let yPosition = 110;
  const lineHeight = 10;
  const totalAmount = invoice.items.reduce((sum, item) => sum + item.amount, 0);

  // Function to format currency with proper symbol
  const formatCurrencyWithSymbol = (amount: number, currency: string) => {
    if (currency === "INR") {
      return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return formatCurrency({ amount, currency }).formatted;
  };

  // Calculate totals
  const subtotal = totalAmount;
  const discountAmount = (subtotal * (invoice.discount || 0)) / 100;
  const taxAmount = ((subtotal - discountAmount) * (invoice.tax || 0)) / 100;
  const finalTotal = subtotal - discountAmount + taxAmount;

  invoice.items.forEach((item) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont("helvetica", "normal");
    pdf.text(item.description || "", 20, yPosition);
    pdf.text(item.quantity.toString() || "", 100, yPosition);
    pdf.text(
      formatCurrencyWithSymbol(item.price, invoice.currency),
      130,
      yPosition,
    );
    pdf.text(
      formatCurrencyWithSymbol(item.amount, invoice.currency),
      160,
      yPosition,
    );

    yPosition += lineHeight;
  });

  // Totals Section
  pdf.line(20, yPosition, 190, yPosition);
  yPosition += lineHeight;

  // Subtotal
  pdf.setFont("helvetica", "bold");
  pdf.text("Subtotal", 130, yPosition);
  pdf.text(
    formatCurrencyWithSymbol(subtotal, invoice.currency),
    160,
    yPosition,
  );
  yPosition += lineHeight;

  // Discount
  if (invoice.discount && invoice.discount > 0) {
    pdf.setFont("helvetica", "normal");
    pdf.text(`Discount (${invoice.discount}%)`, 130, yPosition);
    pdf.text(
      `-${formatCurrencyWithSymbol(discountAmount, invoice.currency)}`,
      160,
      yPosition,
    );
    yPosition += lineHeight;
  }

  // Tax
  if (invoice.tax && invoice.tax > 0) {
    pdf.setFont("helvetica", "normal");
    pdf.text(`Tax (${invoice.tax}%)`, 130, yPosition);
    pdf.text(
      formatCurrencyWithSymbol(taxAmount, invoice.currency),
      160,
      yPosition,
    );
    yPosition += lineHeight;
  }

  // Final Total
  pdf.line(20, yPosition, 190, yPosition);
  yPosition += lineHeight;
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total (${invoice.currency})`, 130, yPosition);
  pdf.text(
    formatCurrencyWithSymbol(finalTotal, invoice.currency),
    160,
    yPosition,
  );

  //Additional Note
  if (invoice.note) {
    yPosition += lineHeight * 2;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note:", 20, yPosition);
    pdf.text(invoice.note, 20, yPosition + 5);
  }
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
