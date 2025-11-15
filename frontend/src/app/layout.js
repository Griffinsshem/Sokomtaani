
import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import GlobalImageShim from "./providers/GlobalImageShim";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalImageShim>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GlobalImageShim>
      </body>
    </html>
  );
}
