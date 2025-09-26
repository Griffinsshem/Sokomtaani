// src/app/layout.js
import "./global.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: 'Sokomtaani - Agricultural Marketplace',
  description: 'Buy and sell fresh agricultural products directly from farmers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}