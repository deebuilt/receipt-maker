import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { OpsetteFooterLogo } from '@/components/opsette-share';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-lg mx-auto">
      <header className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
      </header>

      <div className="flex-1 px-4 py-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p className="text-foreground font-medium text-base">Receipt Maker respects your privacy.</p>

        <div className="space-y-3">
          <h2 className="text-foreground font-semibold">No Data Collection</h2>
          <p>
            Receipt Maker runs entirely in your browser. We do not collect, store, or transmit any
            personal information. All receipts and business info are saved locally on your device.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-foreground font-semibold">No Cookies or Tracking</h2>
          <p>
            We do not use cookies, analytics, or any third-party tracking services.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-foreground font-semibold">Local Storage</h2>
          <p>
            Your business information and receipt history are stored in your browser's local storage.
            This data never leaves your device and can be cleared at any time through your browser settings.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-foreground font-semibold">No Account Required</h2>
          <p>
            There is no sign-up, no login, and no data stored on any server.
            Your receipts, client names, and business details are never shared with anyone.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-foreground font-semibold">Contact</h2>
          <p>
            If you have questions about this policy, you can reach us through the app's repository.
          </p>
        </div>

        <OpsetteFooterLogo />
      </div>
    </div>
  );
}
