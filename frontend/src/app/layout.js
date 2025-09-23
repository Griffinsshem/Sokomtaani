import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

// Load fonts for server-side usage
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Sokomtaani",
  description: "Post and browse listings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Use .className instead of .variable */}
      <body suppressHydrationWarning className={`${geistSans.className} ${geistMono.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
