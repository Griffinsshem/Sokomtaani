import React from "react";

import Footer from "./Footer";
import NavBar from "./NavBar";

export default function LegalPage({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main id="main" className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 text-4xl font-bold text-green-800">{title}</h1>
        <p className="mb-8 text-sm text-gray-600">Last updated: {updated}</p>
        <div className="space-y-6 leading-relaxed text-gray-800 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-green-800 [&_li]:ml-5 [&_li]:list-disc [&_a]:text-green-700 [&_a]:underline">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
