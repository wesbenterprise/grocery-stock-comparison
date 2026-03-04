import './globals.css';

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
      </head>
      <body>{children}</body>
    </html>
  );
}
