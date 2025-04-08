"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

// Currencies array
const CURRENCIES = ["USD", "INR", "EUR"] as const;

// Zod schema matching the invoice router
export const invoiceSchema = z.object({
  invoiceName: z.string().min(1, "Invoice name is required"),
  sno: z.number().min(1, "Serial number is required"),
  status: z.enum(["PAID", "PENDING"], { 
    errorMap: () => ({ message: "Status must be PAID or PENDING" }) 
  }),
  currency: z.enum(CURRENCIES, { 
    errorMap: () => ({ message: "Invalid currency" }) 
  }),
  dueDate: z.number().min(1, "Due date is required").optional(),
  date: z.date({ 
    required_error: "Invoice date is required" 
  }),
  fromName: z.string().min(1, "Sender name is required"),
  fromEmail: z.string().email("Invalid email address"),
  fromAddress: z.string().min(1, "Sender address is required"),
  toName: z.string().min(1, "Recipient name is required"),
  toEmail: z.string().email("Invalid email address"),
  toAddress: z.string().min(1, "Recipient address is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  rate: z.number().min(0, "Rate must be non-negative"),
  amount: z.number().min(0, "Amount must be non-negative").optional(),
  note: z.string().optional(),
});


const InvoiceForm = ( {bill, invoiceId}: {bill?: z.infer<typeof invoiceSchema>, invoiceId?: string}) => {
const router = useRouter();


  const createInvoice = api.invoice.createInvoice.useMutation();
  const form = useForm<z.infer<typeof invoiceSchema>>({
      resolver: zodResolver(invoiceSchema),
      defaultValues:bill ??  {
          invoiceName: "",
      sno: 1,
      status: "PENDING",
      currency: "USD",
      dueDate: 30,
      date: new Date(),
      fromName: "",
      fromEmail: "",
      fromAddress: "",
      toName: "",
      toEmail: "",
      toAddress: "",
      description: "",
      quantity: 1,
      rate: 0,
      note: "",
    },
    values: bill
});

// Watch quantity and rate to calculate amount
const quantity = form.watch("quantity");
const rate = form.watch("rate");
const status = form.watch("status");
const currency = form.watch("currency");
// Calculate amount automatically
useEffect(() => {
    form.setValue("amount", quantity * rate);
  }, [quantity, rate, form.setValue, form]);
  
  
  // If this is an edit page and bill is not loaded yet, show loading
  if (invoiceId && !bill) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-xl text-muted-foreground">
            Loading Invoice Details...
          </p>
        </div>
      </div>
    );
  }
  function onSubmit(values: z.infer<typeof invoiceSchema>) {
    const submissionData = {
      ...values,
      // Ensure amount is a numeric value
      amount: quantity * rate,
      // Only include dueDate if status is PENDING
      dueDate: status === "PENDING" ? values.dueDate : 0,
      invoiceId: invoiceId? invoiceId : undefined,
    };

    createInvoice.mutate(
      submissionData as {
        invoiceName: string;
        sno: number;
        status: "PAID" | "PENDING";
        currency: string;
        dueDate: number;
        date: Date;
        fromName: string;
        fromEmail: string;
        fromAddress: string;
        toName: string;
        toEmail: string;
        toAddress: string;
        description: string;
        quantity: number;
        rate: number;
        amount: number;
        note?: string;
        invoiceId?: string;
      },
      {
        onSuccess: () => {
          toast.success("Invoice created successfully");
          router.push("/invoices");
        },
        onError: (error) => {
          toast.error("Failed to create invoice", {
            description: error.message,
          });
        },
      }
    );
  }

  return (

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Create New Invoice</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Invoice Details Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="invoiceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter invoice name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter serial number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value)) as unknown as number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status and Currency */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={bill?.status || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={bill?.currency || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dates and Amount */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bill?.date || field.value}
                        onSelect={(date) => field.onChange(date) as unknown as Date}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {status === "PENDING" && (
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (Days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter due date in days" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value)) as unknown as number}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          {/* From Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter sender name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter sender email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter sender address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* To Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="toName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter recipient name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter recipient email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter recipient address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Invoice Line Items */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter item description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value)) as unknown as number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter rate" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value)) as unknown as number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

            />
            <FormField
              control={form.control}
              name="amount"
              render={() => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="Calculated Amount" 
                      value={formatCurrency({ amount: quantity * rate, currency}).formatted}
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Optional Note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter any additional notes" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-green-400 text-lg rounded-md hover:bg-green-600 hover:scale-102 transition-all duration-300"
            disabled={createInvoice.isPending}

          >
            {createInvoice.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"   /> : (bill ? "Update Invoice" : "Create Invoice")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default InvoiceForm