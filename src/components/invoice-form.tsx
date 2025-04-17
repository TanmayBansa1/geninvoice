"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import type { Currency, Status } from "@/lib/types";
import type { InvoiceItem, InvoiceType as FormData } from "@/lib/types";
import { formSchema } from "@/lib/types";




interface InvoiceFormProps {
  initialData?: FormData & { id?: string };
}

export function InvoiceForm({ initialData }: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createInvoice = api.invoice.createInvoice.useMutation({
    onSuccess: (data) => {
      console.log("Mutation success:", data);
      toast.success("Invoice created successfully");
      router.push("/invoices");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "Failed to create invoice");
    }
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items || [
      {
        description: "",
        quantity: 1,
        price: 0,
        amount: 0,
      },
    ]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceName: initialData?.invoiceName || "",
      sno: initialData?.sno || 1,
      status: initialData?.status || "DRAFT",
      currency: initialData?.currency || "USD",
      dueDate: initialData?.status === "PAID" ? 0 : (initialData?.dueDate || 30),
      date: initialData?.date || new Date(),
      fromName: initialData?.fromName || "",
      fromEmail: initialData?.fromEmail || "",
      fromAddress: initialData?.fromAddress || "",
      toName: initialData?.toName || "",
      toEmail: initialData?.toEmail || "",
      toAddress: initialData?.toAddress || "",
      note: initialData?.note || "",
      discount: initialData?.discount || 0,
      tax: initialData?.tax || 0,
      subtotal: initialData?.subtotal || 0,
      total: initialData?.total || 0,
      items: initialData?.items || [
        {
          description: "",
          quantity: 1,
          price: 0,
          amount: 0,
        },
      ],
    },
    values: initialData
  });

  const handleSubmit = async (data: FormData) => {
    if (!data) {
      console.log("No data provided");
      return;
    }
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        invoiceId: initialData?.id,
        dueDate: data.status === "PAID" ? 0 : data.dueDate,
        discount: data.discount || 0,
        tax: data.tax || 0,
        items: items.map(item => ({
          ...item,
          amount: item.quantity * item.price
        }))
      };
      
      await createInvoice.mutateAsync(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    const newItems = [
      ...items,
      {
        description: "",
        quantity: 1,
        price: 0,
        amount: 0
      }
    ];
    setItems(newItems);
    calculateTotals(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotals(newItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const currentItem = newItems[index];
    if (!currentItem) return;

    newItems[index] = {
      ...currentItem,
      [field]: value
    };
    
    if (field === "quantity" || field === "price") {
      const quantity = Number(newItems[index].quantity) || 0;
      const price = Number(newItems[index].price) || 0;
      newItems[index].amount = quantity * price;
    }
    
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = useCallback((items: InvoiceItem[]) => {
    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;
    let total = 0;
    const discountPercentage = form.getValues("discount") || 0;
    const taxPercentage = form.getValues("tax") || 0;
    items.forEach((item) => {
      subtotal += item.amount || 0;
    });
    discountAmount = (subtotal * discountPercentage) / 100;
    taxAmount = ((subtotal - discountAmount) * taxPercentage) / 100;
    total = subtotal - discountAmount + taxAmount;
    form.setValue("subtotal", subtotal);
    form.setValue("total", total);
  }, [form]);

  useEffect(() => {
    calculateTotals(items);
  }, [items, calculateTotals]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Create New Invoice</h1>
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("Form submit event triggered");
          const formData = form.getValues();
          await handleSubmit(formData);
        }} 
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice Name</label>
              <Input {...form.register("invoiceName")} />
              {form.formState.errors.invoiceName && <p className="text-sm text-red-500">{form.formState.errors.invoiceName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Serial Number</label>
              <Input type="number" {...form.register("sno", { valueAsNumber: true })} />
              {form.formState.errors.sno && <p className="text-sm text-red-500">{form.formState.errors.sno.message}</p>}
          </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
                  <Select 
                value={form.watch("status")}
                onValueChange={(value) => {
                  form.setValue("status", value as Status);
                  if (value === "PAID") {
                    form.setValue("dueDate", 0);
                  } else if (!form.getValues("dueDate")) {
                    form.setValue("dueDate", 30);
                  }
                }}
              >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                  </Select>
              {form.formState.errors.status && <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
                  <Select 
                value={form.watch("currency")}
                onValueChange={(value) => form.setValue("currency", value as Currency)}
                  >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
              {form.formState.errors.currency && <p className="text-sm text-red-500">{form.formState.errors.currency.message}</p>}
            </div>
            {form.watch("status") !== "PAID" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date (days)</label>
                <Input type="number" {...form.register("dueDate", { valueAsNumber: true })} />
                {form.formState.errors.dueDate && <p className="text-sm text-red-500">{form.formState.errors.dueDate.message}</p>}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("date") && "text-muted-foreground"
                          )}
                        >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("date") ? (
                      format(form.watch("date"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                    </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                    selected={form.watch("date")}
                    onSelect={(date) => {
                      if (date) {
                        form.setValue("date", date);
                      }
                    }}
                    disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
              {form.formState.errors.date && <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sender Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register("fromName")} />
              {form.formState.errors.fromName && <p className="text-sm text-red-500">{form.formState.errors.fromName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...form.register("fromEmail")} />
              {form.formState.errors.fromEmail && <p className="text-sm text-red-500">{form.formState.errors.fromEmail.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea {...form.register("fromAddress")} />
              {form.formState.errors.fromAddress && <p className="text-sm text-red-500">{form.formState.errors.fromAddress.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipient Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register("toName")} />
              {form.formState.errors.toName && <p className="text-sm text-red-500">{form.formState.errors.toName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...form.register("toEmail")} />
              {form.formState.errors.toEmail && <p className="text-sm text-red-500">{form.formState.errors.toEmail.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea {...form.register("toAddress")} />
              {form.formState.errors.toAddress && <p className="text-sm text-red-500">{form.formState.errors.toAddress.message}</p>}
          </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
              >
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                    <Input 
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
            />
          </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                    <Input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
            />
          </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                    <Input 
                      type="number" 
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                    <Input 
                      type="number" 
                    value={item.amount}
                    readOnly
                  />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
            <Button type="button" onClick={addItem}>
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount and Tax</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
                    <Input 
                id="discount"
                type="number"
                min="0"
                max="100"
                step="1"
                {...form.register("discount", {
                  valueAsNumber: true,
                  onChange: () => calculateTotals(items),
                })}
            />
          </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (%)</Label>
                  <Input 
                id="tax"
                type="number"
                min="0"
                max="100"
                step="0.5"
                {...form.register("tax", {
                  valueAsNumber: true,
                  onChange: () => calculateTotals(items),
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Subtotal</Label>
              <Label className="text-sm font-medium">
                {formatCurrency({ amount: form.watch("subtotal"), currency: form.watch("currency") }).formatted}
              </Label>
            </div>
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Discount ({form.watch("discount") || 0}%)</Label>
              <Label className="text-sm font-medium">
                -{formatCurrency({ 
                  amount: (form.watch("subtotal") * (form.watch("discount") || 0)) / 100, 
                  currency: form.watch("currency") 
                }).formatted}
              </Label>
            </div>
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Tax ({form.watch("tax") || 0}%)</Label>
              <Label className="text-sm font-medium">
                {formatCurrency({ 
                  amount: ((form.watch("subtotal") - (form.watch("subtotal") * (form.watch("discount") || 0)) / 100) * (form.watch("tax") || 0)) / 100, 
                  currency: form.watch("currency") 
                }).formatted}
              </Label>
            </div>
            <div className="flex justify-between border-t pt-2">
              <Label className="text-lg font-bold">Total</Label>
              <Label className="text-lg font-bold">
                {formatCurrency({ amount: form.watch("total"), currency: form.watch("currency") }).formatted}
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea {...form.register("note")} />
            {form.formState.errors.note && <p className="text-sm text-red-500">{form.formState.errors.note.message}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/invoices")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-green-400 hover:bg-green-600"
            onClick={() => console.log("Button clicked")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Invoice"
            )}
          </Button>
        </div>
        </form>
    </div>
  );
}

export default InvoiceForm