import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Copilot // Manav Sharma (NC State MEM)',
  description: 'Zero-cost personal job aggregator and application copilot for Product Management, Technical PM, and AI Search / GEO roles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}

