import { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { ReceiptData } from '@/types/receipt';
import { calcSubtotal, calcTax, formatCurrency, paymentLabel } from '@/lib/receipt-utils';

interface Props {
  data: ReceiptData;
}

export const ReceiptPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const subtotal = calcSubtotal(data.lineItems);
  const tax = calcTax(subtotal, data.taxRate, data.taxEnabled);
  const total = subtotal + tax;
  const hasContent = data.clientName || data.lineItems.some(i => i.description);

  return (
    <div ref={ref} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-md mx-auto" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
        {data.businessInfo.logo && (
          <img src={data.businessInfo.logo} alt="Logo" className="h-14 w-auto mx-auto mb-2 object-contain" />
        )}
        {data.businessInfo.businessName && (
          <h2 className="text-lg font-bold text-gray-900">{data.businessInfo.businessName}</h2>
        )}
        {data.businessInfo.phone && <p className="text-xs text-gray-500">{data.businessInfo.phone}</p>}
        {data.businessInfo.email && <p className="text-xs text-gray-500">{data.businessInfo.email}</p>}
        {data.businessInfo.address && <p className="text-xs text-gray-500">{data.businessInfo.address}</p>}
      </div>

      {/* Receipt info */}
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span className="font-mono font-semibold">{data.receiptNumber}</span>
        <span>{data.date ? new Date(data.date).toLocaleDateString() : ''}</span>
      </div>
      {data.clientName && <p className="text-sm text-gray-700 mb-4">Client: <span className="font-medium">{data.clientName}</span></p>}

      {/* Items */}
      {hasContent && (
        <div className="border-t border-dashed border-gray-300 pt-3 mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs">
                <th className="text-left pb-1 font-medium">Item</th>
                <th className="text-center pb-1 font-medium w-10">Qty</th>
                <th className="text-right pb-1 font-medium w-16">Price</th>
                <th className="text-right pb-1 font-medium w-20">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.filter(i => i.description).map(item => (
                <tr key={item.id} className="text-gray-800">
                  <td className="py-1 pr-2">{item.description}</td>
                  <td className="py-1 text-center font-mono">{item.quantity}</td>
                  <td className="py-1 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-1 text-right font-mono">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals */}
      <div className="border-t border-dashed border-gray-300 pt-3 space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-mono">{formatCurrency(subtotal)}</span>
        </div>
        {data.taxEnabled && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax ({data.taxRate}%)</span>
            <span className="font-mono">{formatCurrency(tax)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-300">
          <span>Total</span>
          <span className="font-mono">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment & Notes */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-gray-500">Paid via</span>
        <Badge variant="secondary" className="text-xs">{paymentLabel(data.paymentMethod)}</Badge>
      </div>

      {data.notes && (
        <p className="text-xs text-gray-500 mt-3 italic">{data.notes}</p>
      )}

      {/* Footer */}
      <p className="text-[10px] text-gray-300 text-center mt-6">Generated with Receipt Maker</p>
    </div>
  );
});

ReceiptPreview.displayName = 'ReceiptPreview';
