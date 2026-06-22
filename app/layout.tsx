import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mad Dog Terminal',
  description: 'Chat with Goro Majima, the Mad Dog of Shimano!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
