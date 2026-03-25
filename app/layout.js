import './globals.css';
import SiteHeader from './components/SiteHeader';
import GlobalPasswordGate from './components/GlobalPasswordGate';

export const metadata = {
  title: 'Publix: Built to Last',
  description: 'A deep dive into Publix — history, leadership, financials, and stock comparison.',
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
        <GlobalPasswordGate>
          <SiteHeader />
          {children}
        </GlobalPasswordGate>
      </body>
    </html>
  );
}
