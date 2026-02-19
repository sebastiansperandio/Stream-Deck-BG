import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stream Deck GIF Background",
  description: "Create perfectly sized GIFs for your Stream Deck",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
