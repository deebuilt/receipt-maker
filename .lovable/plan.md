

# Receipt Maker — Mobile-First Web App

## Overview
A mobile-first web app for service professionals to generate, share, and download clean receipts on the spot. No backend — everything in localStorage + URL hash sharing.

## Pages & Navigation
- **Main Page**: Single-page app with form + live preview, stacked vertically on mobile
- **Read-Only Receipt View**: When opened via share link (data decoded from URL hash)
- **Settings Modal/Sheet**: Business info setup (name, phone, email, address, logo upload)
- **History Sheet**: List of last 50 receipts with tap-to-load

## Setup Flow
- On first visit, prompt user to set up business info via a bottom sheet/modal
- Settings accessible anytime via gear icon in header
- Logo uploaded from device, stored as base64 in localStorage
- All fields persist and auto-fill into every new receipt

## Receipt Form
- Client name (required)
- Date picker (defaults to today)
- Auto-generated sequential receipt number (#0001, #0002...)
- Dynamic line items table: description, quantity, unit price, add/remove rows (min 1)
- Tax toggle with configurable rate
- Payment method dropdown (Cash, Check, Venmo, Zelle, Card, Other)
- Optional notes field

## Live Receipt Preview
- Rendered below the form, styled like a real paper receipt
- White card with subtle shadow/border on warm off-white background
- Business logo + name at top, receipt number, date, client name
- Itemized table with quantities, prices, line totals
- Subtotal → Tax → **Total** (bold)
- Payment method badge, notes, "Generated with Receipt Maker" footer
- Monospace font for numbers

## Actions (sticky action bar on mobile)
1. **Download Image** — html-to-image captures the preview as PNG
2. **Copy to Clipboard** — plain-text formatted receipt
3. **Share Link** — encodes receipt JSON in URL hash, copyable link
4. **New Receipt** — clears form, keeps business info, increments receipt number

## Receipt History
- Last 50 receipts stored in localStorage
- History button opens a scrollable list (receipt #, client, total, date)
- Tap to reload into preview for re-sharing/re-downloading

## Demo Mode
- "Try Demo" button fills form with realistic sample data (Maria's Cleaning Co, etc.)
- Clearly labeled, easily clearable

## Design
- Mobile-first (375px primary), scales up for tablet/desktop
- Warm off-white page background, clean white receipt card
- shadcn/ui components + Lucide icons
- All touch targets ≥ 44px, no horizontal scroll

## PWA Setup
- vite-plugin-pwa with manifest (standalone display, icons, theme colors)
- Service worker for offline support
- Guards to prevent service worker issues in Lovable preview/iframes

## Routing
- Hash-based routing (compatible with GitHub Pages)
- Share links use URL hash to encode receipt data

## Dependencies to Add
- `html-to-image` for PNG export
- `vite-plugin-pwa` for PWA support
- `date-fns` for date formatting

