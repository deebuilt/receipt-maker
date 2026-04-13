import { useRef } from 'react';
import { toPng } from 'html-to-image';
// jspdf is loaded lazily to keep initial bundle small
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { ReceiptPreview } from './ReceiptPreview';
import { ReceiptData } from '@/types/receipt';
import { Button } from '@/components/ui/button';

interface Props {
  data: ReceiptData;
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

export function ReadOnlyReceipt({ data }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await capturePreview(previewRef.current);
      const link = document.createElement('a');
      link.download = receiptFilename(data.receiptNumber, 'png');
      link.href = dataUrl;
      link.click();
      toast.success('PNG downloaded!');
    } catch {
      toast.error('Failed to download');
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await capturePreview(previewRef.current);

      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; });

      const pxW = img.naturalWidth;
      const pxH = img.naturalHeight;
      const margin = 10;
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
      toast.error('Failed to download');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="h-11" onClick={() => { window.location.hash = '/'; }}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPng} size="icon" variant="outline" className="h-10 w-10 rounded-full">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={handleDownloadPdf} size="icon" variant="outline" className="h-10 w-10 rounded-full">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ReceiptPreview ref={previewRef} data={data} />
      </div>
    </div>
  );
}
