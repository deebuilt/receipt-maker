import { useState, useRef, useEffect } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ReceiptForm } from '@/components/ReceiptForm';
import { ReceiptPreview } from '@/components/ReceiptPreview';
import { ReceiptActions } from '@/components/ReceiptActions';
import { SettingsSheet } from '@/components/SettingsSheet';
import { HistorySheet } from '@/components/HistorySheet';
import { ReadOnlyReceipt } from '@/components/ReadOnlyReceipt';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { OpsetteHeader } from '@/components/opsette-header';
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

const FORM_SHADOW = '0 4px 12px -2px rgba(0,0,0,0.12), 0 2px 4px -2px rgba(0,0,0,0.06)';
const CARD_SHADOW = '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)';

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
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useLocalStorage<BusinessInfo>('business-info', emptyBusinessInfo);
  const [receipt, setReceipt] = useState<ReceiptData>(() => createEmptyReceipt(businessInfo));
  const [showSettings, setShowSettings] = useState(() => !businessInfo.businessName);
  const [sharedReceipt, setSharedReceipt] = useState<ReceiptData | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Query param for shared receipts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    if (shared) {
      const decoded = decodeReceiptFromHash(shared);
      if (decoded) setSharedReceipt(decoded);
    }
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

  const headerExtras = (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle dark mode"
      >
        {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      {!isDemo && (
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleTryDemo} aria-label="Try demo">
          <Sparkles className="h-4 w-4" />
        </Button>
      )}
      <HistorySheet onLoad={handleLoadHistory} />
      <SettingsSheet businessInfo={businessInfo} onSave={handleSaveSettings} open={showSettings} onOpenChange={setShowSettings} />
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-background">
      <OpsetteHeader
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        rightExtra={headerExtras}
      />

      <main className="mx-auto max-w-lg space-y-3 px-4 py-4 pb-24">
        {isDemo && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">Viewing demo data</span>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleClearDemo}>Clear</Button>
          </div>
        )}

        <div
          className="bg-card rounded-xl p-4 border border-border/60"
          style={{ boxShadow: FORM_SHADOW }}
        >
          <ReceiptForm data={receipt} onChange={setReceipt} />
        </div>

        <div
          className="bg-card rounded-xl p-4 border border-border/60 overflow-hidden"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Preview</h2>
          <ReceiptPreview ref={previewRef} data={receipt} />
        </div>

        <div className="flex justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <button onClick={() => navigate('/about')} className="hover:text-foreground transition-colors">
            How to Use
          </button>
          <span>·</span>
          <button onClick={() => navigate('/privacy')} className="hover:text-foreground transition-colors">
            Privacy
          </button>
          <span>·</span>
          <span>
            By{' '}
            <a href="https://opsette.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
              Opsette
            </a>
          </span>
        </div>
      </main>

      <ReceiptActions data={receipt} previewRef={previewRef} onNewReceipt={handleNewReceipt} />
    </div>
  );
}
