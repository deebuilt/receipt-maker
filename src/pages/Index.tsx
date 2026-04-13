import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReceiptForm } from '@/components/ReceiptForm';
import { ReceiptPreview } from '@/components/ReceiptPreview';
import { ReceiptActions } from '@/components/ReceiptActions';
import { SettingsSheet } from '@/components/SettingsSheet';
import { HistorySheet } from '@/components/HistorySheet';
import { ReadOnlyReceipt } from '@/components/ReadOnlyReceipt';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BusinessInfo, ReceiptData, SavedReceipt } from '@/types/receipt';
import {
  emptyBusinessInfo,
  createEmptyLineItem,
  formatReceiptNumber,
  getNextReceiptNumber,
  decodeReceiptFromHash,
  demoBusinessInfo,
  getDemoReceiptData,
} from '@/lib/receipt-utils';

function createEmptyReceipt(businessInfo: BusinessInfo): ReceiptData {
  return {
    receiptNumber: formatReceiptNumber(getNextReceiptNumber()),
    date: new Date().toISOString(),
    clientName: '',
    lineItems: [createEmptyLineItem()],
    taxEnabled: false,
    taxRate: 0,
    paymentMethod: 'Cash',
    notes: '',
    businessInfo,
  };
}

export default function Index() {
  const [businessInfo, setBusinessInfo] = useLocalStorage<BusinessInfo>('business-info', emptyBusinessInfo);
  const [receipt, setReceipt] = useState<ReceiptData>(() => createEmptyReceipt(businessInfo));
  const [showSettings, setShowSettings] = useState(() => !businessInfo.businessName);
  const [sharedReceipt, setSharedReceipt] = useState<ReceiptData | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Hash routing for shared receipts
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/receipt/')) {
        const encoded = hash.replace('#/receipt/', '');
        const decoded = decodeReceiptFromHash(encoded);
        if (decoded) setSharedReceipt(decoded);
      } else {
        setSharedReceipt(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync business info into receipt
  useEffect(() => {
    setReceipt(r => ({ ...r, businessInfo }));
  }, [businessInfo]);

  const handleSaveSettings = (info: BusinessInfo) => {
    setBusinessInfo(info);
  };

  const handleNewReceipt = () => {
    setIsDemo(false);
    setReceipt(createEmptyReceipt(businessInfo));
  };

  const handleLoadHistory = (saved: SavedReceipt) => {
    setIsDemo(false);
    const { savedAt: _s, subtotal: _sub, tax: _t, total: _tot, ...rest } = saved;
    setReceipt(rest);
  };

  const handleTryDemo = () => {
    const demo = getDemoReceiptData();
    setBusinessInfo(demoBusinessInfo);
    setReceipt(r => ({
      ...r,
      ...demo,
      businessInfo: demoBusinessInfo,
    }));
    setIsDemo(true);
  };

  const handleClearDemo = () => {
    setBusinessInfo(emptyBusinessInfo);
    setReceipt(createEmptyReceipt(emptyBusinessInfo));
    setIsDemo(false);
  };

  if (sharedReceipt) {
    return <ReadOnlyReceipt data={sharedReceipt} />;
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-bold">Receipt Maker</h1>
        <div className="flex items-center gap-1">
          {!isDemo && (
            <Button variant="ghost" size="sm" className="h-11 text-xs" onClick={handleTryDemo}>
              <Sparkles className="h-4 w-4 mr-1" /> Demo
            </Button>
          )}
          <HistorySheet onLoad={handleLoadHistory} />
          <SettingsSheet businessInfo={businessInfo} onSave={handleSaveSettings} open={showSettings} onOpenChange={setShowSettings} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-amber-800 font-medium">📋 Viewing demo data</span>
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handleClearDemo}>Clear Demo</Button>
          </div>
        )}

        {/* Form */}
        <section>
          <ReceiptForm data={receipt} onChange={setReceipt} />
        </section>

        {/* Preview */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Preview</h2>
          <ReceiptPreview ref={previewRef} data={receipt} />
        </section>
      </main>

      {/* Actions */}
      <ReceiptActions data={receipt} previewRef={previewRef} onNewReceipt={handleNewReceipt} />
    </div>
  );
}
