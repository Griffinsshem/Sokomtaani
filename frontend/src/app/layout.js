// src/app/layout.js
import "./globals.css";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryFilter from "../components/CategoryFilter";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "SokoMtaani",
  description: "Your marketplace app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <CategoryFilter />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
