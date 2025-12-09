import type { Metadata } from 'next';
import { readCustomCSS } from '@/lib/config';
import '@/lib/core/startup'; // Initialize scheduler
import './globals.css';


export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal Portfolio',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customCSS = await readCustomCSS();

  return (
    <html lang="en">
      <head>
        {customCSS && <style dangerouslySetInnerHTML={{ __html: customCSS }} />}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

