import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "🐾 Pet Care Assistant - Professional Pet Care Advice",
  description: "Intelligent pet care assistant providing comprehensive advice on pet health, feeding, training, and more. Keep your furry friends happy and healthy!",
  keywords: ["pet care", "pet health", "pet training", "pet feeding", "AI assistant"],
  openGraph: {
    title: "🐾 Pet Care Assistant",
    description: "Professional pet care advice for happy and healthy furry friends",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐾</text></svg>" />
      </head>
      <body
        className={`${nunito.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
