import { useRef } from 'react';
import { toPng } from 'html-to-image';
// jspdf is loaded lazily to keep initial bundle small
import { Download, Copy, FileText, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ReceiptData } from '@/types/receipt';
import { receiptToPlainText, saveReceipt, incrementReceiptNumber } from '@/lib/receipt-utils';

interface Props {
  data: ReceiptData;
  previewRef: React.RefObject<HTMLDivElement>;
  onNewReceipt: () => void;
}

function receiptFilename(receiptNumber: string, ext: string) {
  return `receipt-${receiptNumber.replace('#', '')}.${ext}`;
}

async function capturePreview(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return toPng(el, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    width: rect.width,
    height: rect.height,
    style: { overflow: 'visible' },
  });
}

export function ReceiptActions({ data, previewRef, onNewReceipt }: Props) {
  const busy = useRef(false);

  const handleDownloadPng = async () => {
    if (!previewRef.current || busy.current) return;
    busy.current = true;
    try {
      saveReceipt(data);
      const dataUrl = await capturePreview(previewRef.current);
      const link = document.createElement('a');
      link.download = receiptFilename(data.receiptNumber, 'png');
      link.href = dataUrl;
      link.click();
      toast.success('PNG downloaded!');
    } catch {
      toast.error('Failed to download PNG');
    } finally {
      busy.current = false;
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current || busy.current) return;
    busy.current = true;
    try {
      saveReceipt(data);
      const dataUrl = await capturePreview(previewRef.current);

      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; });

      const pxW = img.naturalWidth;
      const pxH = img.naturalHeight;
      const margin = 10; // mm
      const contentW = 210 - margin * 2;
      const contentH = (pxH / pxW) * contentW;
      const pageW = 210;
      const pageH = contentH + margin * 2;

      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: pageH > pageW ? 'portrait' : 'landscape', unit: 'mm', format: [pageW, pageH] });
      pdf.addImage(dataUrl, 'PNG', margin, margin, contentW, contentH);
      pdf.save(receiptFilename(data.receiptNumber, 'pdf'));
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      busy.current = false;
    }
  };

  const handleCopy = async () => {
    try {
      saveReceipt(data);
      await navigator.clipboard.writeText(receiptToPlainText(data));
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleNew = () => {
    if (data.clientName || data.lineItems.some(i => i.description)) {
      saveReceipt(data);
    }
    incrementReceiptNumber();
    onNewReceipt();
  };

  return (
    <div className="sticky bottom-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t shadow-[0_-1px_3px_rgba(0,0,0,0.06)] p-3 flex gap-3 justify-center z-10">
      <Button onClick={handleDownloadPng} size="icon" className="h-11 w-11 rounded-full">
        <Download className="h-5 w-5" />
      </Button>
      <Button onClick={handleDownloadPdf} variant="outline" size="icon" className="h-11 w-11 rounded-full">
        <FileText className="h-5 w-5" />
      </Button>
      <Button onClick={handleCopy} variant="outline" size="icon" className="h-11 w-11 rounded-full">
        <Copy className="h-5 w-5" />
      </Button>
      <Button onClick={handleNew} variant="secondary" size="icon" className="h-11 w-11 rounded-full">
        <FilePlus className="h-5 w-5" />
      </Button>
    </div>
  );
}
