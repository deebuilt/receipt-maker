import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function AppLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <rect width="512" height="512" rx="96" fill="#2563eb"/>
      <path d="M152 72h208a24 24 0 0 1 24 24v320l-24 16-24-16-24 16-24-16-24 16-24-16-24 16-24-16-24 16-24-16-24 16V96a24 24 0 0 1 24-24z" fill="#fff" opacity=".95"/>
      <rect x="192" y="144" width="144" height="14" rx="7" fill="#2563eb" opacity=".2"/>
      <rect x="192" y="182" width="112" height="14" rx="7" fill="#2563eb" opacity=".2"/>
      <rect x="192" y="220" width="128" height="14" rx="7" fill="#2563eb" opacity=".2"/>
      <rect x="192" y="280" width="160" height="4" rx="2" fill="#2563eb" opacity=".15"/>
      <rect x="192" y="304" width="96" height="16" rx="8" fill="#2563eb" opacity=".3"/>
      <rect x="304" y="304" width="48" height="16" rx="8" fill="#2563eb" opacity=".3"/>
    </svg>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-lg mx-auto">
      <header className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">How to Use</h1>
      </header>

      <div className="flex-1 px-4 py-6 space-y-5 text-sm text-muted-foreground leading-relaxed">
        <div className="flex justify-center">
          <AppLogo className="h-12 w-12 rounded-xl" />
        </div>

        <p className="text-foreground font-medium text-base text-center">
          Generate professional receipts on the spot — no sign-up needed.
        </p>

        <ol className="space-y-4 list-decimal list-inside">
          <li>
            <span className="font-semibold text-foreground">Set up your business info</span> — tap
            the settings gear in the header to enter your business name, phone, email, and address.
            Upload a logo if you have one. This info is saved locally and reused on every receipt.
          </li>
          <li>
            <span className="font-semibold text-foreground">Fill in the receipt</span> — enter the
            client name, date, and add line items with descriptions, quantities, and prices.
          </li>
          <li>
            <span className="font-semibold text-foreground">Customize the details</span> — enable
            tax and set a rate if needed. Choose the payment method (Cash, Venmo, Zelle, etc.) and
            add any notes.
          </li>
          <li>
            <span className="font-semibold text-foreground">Preview your receipt</span> — scroll
            down to see a live preview that looks like a real printed receipt, complete with your
            business branding.
          </li>
          <li>
            <span className="font-semibold text-foreground">Download or share</span> — use the
            bottom action bar to download a PNG image, copy the receipt as text, or generate a
            shareable link.
          </li>
          <li>
            <span className="font-semibold text-foreground">Start a new receipt</span> — tap the
            new receipt button to save the current one to history and start fresh. Receipt numbers
            auto-increment.
          </li>
          <li>
            <span className="font-semibold text-foreground">View past receipts</span> — tap the
            history icon in the header to browse and reload any of your last 50 receipts.
          </li>
        </ol>

        <p className="text-xs text-center text-muted-foreground pt-2">
          All data stays on your device — nothing is sent to any server.
        </p>

        <p className="text-xs text-center text-muted-foreground/70">
          A business tool from Opsette Marketplace. Find more tools at{' '}
          <a href="https://opsette.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
            opsette.io
          </a>.
        </p>
      </div>
    </div>
  );
}
