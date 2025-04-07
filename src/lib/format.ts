export function formatCurrency({ 
  amount, 
  currency = 'USD', 
  locale = 'en-US' 
}: { 
  amount: number, 
  currency?: string, 
  locale?: string 
}): { 
  formatted: string, 
  value: number 
} {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return {
    formatted: formatter.format(amount),
    value: amount
  };
}

export function formatDate(date: Date){

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}