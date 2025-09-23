

import "./global.css";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryFilter from "../components/CategoryFilter";

export const metadata = {
  title: "SokoMtaani",
  description: "Your marketplace app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <CategoryFilter />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
