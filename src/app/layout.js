import './globals.css';
import AppProvider from '@/components/providers/AppProvider';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Aurora Agency',
  description:
    'Where luxury outdoor meets glamping excellence, integrated marketing and communication, across the world.',
  appleWebApp: {
    title: 'Aurora',
  },
  openGraph: {
    title: 'Aurora Agency',
    description:
      'Where luxury outdoor meets glamping excellence, integrated marketing and communication, across the world.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
