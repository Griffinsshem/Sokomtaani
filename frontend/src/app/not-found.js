import Link from "next/link";

import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main id="main" className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="mb-2 text-6xl font-bold text-green-600">404</p>
        <h1 className="mb-4 text-3xl font-bold text-green-800">Page not found</h1>
        <p className="mb-8 text-gray-700">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
