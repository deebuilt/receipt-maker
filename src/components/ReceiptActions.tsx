import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Copy, Share2, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ReceiptData } from '@/types/receipt';
import { receiptToPlainText, encodeReceiptToHash, saveReceipt, incrementReceiptNumber } from '@/lib/receipt-utils';

interface Props {
  data: ReceiptData;
  previewRef: React.RefObject<HTMLDivElement>;
  onNewReceipt: () => void;
}

export function ReceiptActions({ data, previewRef, onNewReceipt }: Props) {
  const downloading = useRef(false);

  const handleDownload = async () => {
    if (!previewRef.current || downloading.current) return;
    downloading.current = true;
    try {
      saveReceipt(data);
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 3, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `receipt-${data.receiptNumber.replace('#', '')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Receipt downloaded!');
    } catch {
      toast.error('Failed to download receipt');
    } finally {
      downloading.current = false;
    }
  };

  const handleCopy = async () => {
    try {
      saveReceipt(data);
      await navigator.clipboard.writeText(receiptToPlainText(data));
      toast.success('Receipt copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = async () => {
    saveReceipt(data);
    const hash = encodeReceiptToHash(data);
    const url = `${window.location.origin}${window.location.pathname}?shared=${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied!');
    } catch {
      toast.error('Failed to copy link');
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
      <Button onClick={handleDownload} size="icon" className="h-11 w-11 rounded-full">
        <Download className="h-5 w-5" />
      </Button>
      <Button onClick={handleCopy} variant="outline" size="icon" className="h-11 w-11 rounded-full">
        <Copy className="h-5 w-5" />
      </Button>
      <Button onClick={handleShare} variant="outline" size="icon" className="h-11 w-11 rounded-full">
        <Share2 className="h-5 w-5" />
      </Button>
      <Button onClick={handleNew} variant="secondary" size="icon" className="h-11 w-11 rounded-full">
        <FilePlus className="h-5 w-5" />
      </Button>
    </div>
  );
}
