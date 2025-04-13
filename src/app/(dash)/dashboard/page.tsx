import DashboardBlock from "@/components/dashboard-block";
import InvoiceChart from "@/components/InvoiceChart";
import { getAnalytics } from "@/lib/actions/get-analytics";

export default async function DashboardPage() {
  const { paid, pending, totalInvoices, totalRevenue, chartData } = await getAnalytics();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="flex col-span-full md:col-span-2 lg:col-span-4">
          <DashboardBlock isDollar data={totalRevenue} title="Total Revenue" description={`You made $${totalRevenue} in the last 30 days.`} />
          <DashboardBlock data={totalInvoices} title="New Invoices" description={`You have ${totalInvoices} new invoices this month.`} />
          <DashboardBlock data={paid} title="Paid Invoices" description={`You have ${paid} paid invoices this month.`} />
          <DashboardBlock data={pending} title="Open Invoices" description={`You have ${pending} pending invoices this month.`} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3 md:gap-8 p-4">
        <div className="lg:col-span-2">
          <InvoiceChart chartData={chartData} totalRevenue={totalRevenue} />
        </div>
        <div className="lg:col-span-1">
          
        </div>

      </div>
    </>
  );
}