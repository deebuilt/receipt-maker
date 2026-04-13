import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { LineItem, PaymentMethod, ReceiptData } from '@/types/receipt';
import { createEmptyLineItem } from '@/lib/receipt-utils';

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Card', label: 'Card' },
  { value: 'Check', label: 'Check' },
  { value: 'Zelle', label: 'Zelle' },
  { value: 'CashApp', label: 'Cash App' },
  { value: 'PayPal', label: 'PayPal' },
  { value: 'Venmo', label: 'Venmo' },
  { value: 'Square', label: 'Square' },
  { value: 'Stripe', label: 'Stripe' },
  { value: 'Other', label: 'Other' },
];

interface Props {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
}

export function ReceiptForm({ data, onChange }: Props) {
  const update = (partial: Partial<ReceiptData>) => onChange({ ...data, ...partial });

  const updateItem = (id: string, partial: Partial<LineItem>) => {
    update({ lineItems: data.lineItems.map(item => item.id === id ? { ...item, ...partial } : item) });
  };

  const addItem = () => update({ lineItems: [...data.lineItems, createEmptyLineItem()] });

  const removeItem = (id: string) => {
    if (data.lineItems.length <= 1) return;
    update({ lineItems: data.lineItems.filter(item => item.id !== id) });
  };

  return (
    <div className="space-y-5">
      <div>
        <Label>Client Name *</Label>
        <Input value={data.clientName} onChange={e => update({ clientName: e.target.value })} placeholder="Client name" className="h-11 mt-1" />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full h-11 justify-start text-left font-normal mt-1", !data.date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.date ? format(new Date(data.date), 'PPP') : 'Pick date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={data.date ? new Date(data.date) : undefined} onSelect={d => d && update({ date: d.toISOString() })} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-28">
          <Label>Receipt #</Label>
          <Input value={data.receiptNumber} onChange={e => update({ receiptNumber: e.target.value })} className="h-11 mt-1 font-mono" />
        </div>
      </div>

      {/* Line Items */}
      <div>
        <Label>Line Items</Label>
        <div className="space-y-3 mt-2">
          {data.lineItems.map((item, i) => (
            <div key={item.id} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Input value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder={`Item ${i + 1} description`} className="h-11" />
                <div className="flex gap-2">
                  <div className="w-20">
                    <Input type="number" min={1} value={item.quantity} onChange={e => updateItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })} placeholder="Qty" className="h-10 text-center" />
                  </div>
                  <div className="flex-1">
                    <Input type="number" min={0} step={0.01} value={item.unitPrice || ''} onChange={e => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} placeholder="Price" className="h-10" />
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0 mt-0" onClick={() => removeItem(item.id)} disabled={data.lineItems.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full h-11 mt-3" onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Tax */}
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <div className="flex items-center gap-3">
          <Switch checked={data.taxEnabled} onCheckedChange={v => update({ taxEnabled: v })} />
          <Label className="mb-0">Tax</Label>
        </div>
        {data.taxEnabled && (
          <div className="flex items-center gap-1">
            <Input type="number" min={0} step={0.5} value={data.taxRate || ''} onChange={e => update({ taxRate: parseFloat(e.target.value) || 0 })} className="h-9 w-16 text-center" />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <Label>Payment Method</Label>
        <Select value={data.paymentMethod} onValueChange={v => update({ paymentMethod: v as PaymentMethod })}>
          <SelectTrigger className="h-11 mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <Label>Notes</Label>
        <Textarea value={data.notes} onChange={e => update({ notes: e.target.value })} placeholder="e.g., Paid in full at time of service" className="mt-1" rows={3} />
      </div>
    </div>
  );
}
