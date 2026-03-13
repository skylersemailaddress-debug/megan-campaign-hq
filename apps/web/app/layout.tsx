import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Megan Campaign HQ',
  description: 'Single front-door AI campaign operating system'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
