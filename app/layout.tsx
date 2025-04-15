export const metadata = {
    title: 'Meowtronome',
    description: 'A fun metronome app with Pusheen!',
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }