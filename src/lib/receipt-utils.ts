import { LineItem, PaymentMethod, ReceiptData, SavedReceipt, BusinessInfo } from '@/types/receipt';

const paymentLabels: Record<PaymentMethod, string> = {
  Cash: 'Cash', Card: 'Card', Check: 'Check', Zelle: 'Zelle',
  CashApp: 'Cash App', PayPal: 'PayPal', Venmo: 'Venmo',
  Square: 'Square', Stripe: 'Stripe', Other: 'Other',
};

export function paymentLabel(method: PaymentMethod): string {
  return paymentLabels[method] ?? method;
}

export const emptyBusinessInfo: BusinessInfo = {
  businessName: '',
  phone: '',
  email: '',
  address: '',
  logo: '',
};

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createEmptyLineItem(): LineItem {
  return { id: generateId(), description: '', quantity: 1, unitPrice: 0 };
}

export function formatReceiptNumber(n: number): string {
  return `#${String(n).padStart(4, '0')}`;
}

export function calcSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calcTax(subtotal: number, rate: number, enabled: boolean): number {
  return enabled ? subtotal * (rate / 100) : 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function receiptToPlainText(receipt: ReceiptData): string {
  const sub = calcSubtotal(receipt.lineItems);
  const tax = calcTax(sub, receipt.taxRate, receipt.taxEnabled);
  const total = sub + tax;
  const lines: string[] = [];

  if (receipt.businessInfo.businessName) lines.push(receipt.businessInfo.businessName);
  if (receipt.businessInfo.phone) lines.push(receipt.businessInfo.phone);
  if (receipt.businessInfo.email) lines.push(receipt.businessInfo.email);
  if (receipt.businessInfo.address) lines.push(receipt.businessInfo.address);
  lines.push('');
  lines.push(`Receipt ${receipt.receiptNumber}`);
  lines.push(`Date: ${new Date(receipt.date).toLocaleDateString()}`);
  lines.push(`Client: ${receipt.clientName}`);
  lines.push('');
  lines.push('Items:');
  receipt.lineItems.forEach(item => {
    if (item.description) {
      lines.push(`  ${item.description} × ${item.quantity} @ ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.quantity * item.unitPrice)}`);
    }
  });
  lines.push('');
  lines.push(`Subtotal: ${formatCurrency(sub)}`);
  if (receipt.taxEnabled) lines.push(`Tax (${receipt.taxRate}%): ${formatCurrency(tax)}`);
  lines.push(`Total: ${formatCurrency(total)}`);
  lines.push('');
  lines.push(`Payment: ${paymentLabel(receipt.paymentMethod)}`);
  if (receipt.notes) lines.push(`Notes: ${receipt.notes}`);
  lines.push('');
  lines.push('Generated with Receipt Maker');

  return lines.join('\n');
}

export function encodeReceiptToHash(receipt: ReceiptData): string {
  const compressed = JSON.stringify(receipt);
  return btoa(encodeURIComponent(compressed));
}

export function decodeReceiptFromHash(hash: string): ReceiptData | null {
  try {
    const decoded = decodeURIComponent(atob(hash));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function saveReceipt(receipt: ReceiptData): void {
  const sub = calcSubtotal(receipt.lineItems);
  const tax = calcTax(sub, receipt.taxRate, receipt.taxEnabled);
  const saved: SavedReceipt = {
    ...receipt,
    savedAt: new Date().toISOString(),
    subtotal: sub,
    tax,
    total: sub + tax,
  };
  const history: SavedReceipt[] = JSON.parse(localStorage.getItem('receipt-history') || '[]');
  // Replace if same receipt number, else prepend
  const idx = history.findIndex(r => r.receiptNumber === saved.receiptNumber);
  if (idx >= 0) history[idx] = saved;
  else history.unshift(saved);
  localStorage.setItem('receipt-history', JSON.stringify(history.slice(0, 50)));
}

export function getNextReceiptNumber(): number {
  const n = parseInt(localStorage.getItem('receipt-next-number') || '1', 10);
  return n;
}

export function incrementReceiptNumber(): void {
  const n = getNextReceiptNumber();
  localStorage.setItem('receipt-next-number', String(n + 1));
}

export const demoBusinessInfo: BusinessInfo = {
  businessName: "Maria's Cleaning Co.",
  phone: '(555) 123-4567',
  email: 'maria@cleaningco.com',
  address: '123 Main Street, Anytown, USA',
  logo: '',
};

export function getDemoReceiptData(): Partial<ReceiptData> {
  return {
    clientName: 'John Smith',
    lineItems: [
      { id: generateId(), description: 'Deep Clean - Kitchen', quantity: 1, unitPrice: 85 },
      { id: generateId(), description: 'Deep Clean - Bathrooms (x2)', quantity: 1, unitPrice: 120 },
      { id: generateId(), description: 'Vacuum & Mop - All Floors', quantity: 1, unitPrice: 65 },
    ],
    taxEnabled: false,
    taxRate: 0,
    paymentMethod: 'Cash',
    notes: 'Paid in full at time of service. Thank you!',
  };
}
