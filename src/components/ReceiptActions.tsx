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
    const url = `${window.location.origin}${window.location.pathname}#/receipt/${hash}`;
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
    <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-3 flex gap-2 justify-center z-10">
      <Button onClick={handleDownload} className="h-12 flex-1 max-w-[160px]" size="sm">
        <Download className="h-4 w-4 mr-1.5" /> Download
      </Button>
      <Button onClick={handleCopy} variant="outline" className="h-12 flex-1 max-w-[120px]" size="sm">
        <Copy className="h-4 w-4 mr-1.5" /> Copy
      </Button>
      <Button onClick={handleShare} variant="outline" className="h-12 flex-1 max-w-[120px]" size="sm">
        <Share2 className="h-4 w-4 mr-1.5" /> Share
      </Button>
      <Button onClick={handleNew} variant="secondary" className="h-12 px-4" size="sm">
        <FilePlus className="h-4 w-4" />
      </Button>
    </div>
  );
}
