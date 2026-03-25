import './globals.css';
import SiteHeader from './components/SiteHeader';

export const metadata = {
  title: 'Grocery Stock Comparison | Publix · Walmart · Kroger',
  description: 'Interactive stock price comparison: Publix, Walmart (WMT), and Kroger (KR). Dark-theme finance dashboard with live data.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
