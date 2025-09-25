import "./globals.css";

export const metadata = {
  title: "Yayasan Pusaka KAI",
  description: "Foundation Profile",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
