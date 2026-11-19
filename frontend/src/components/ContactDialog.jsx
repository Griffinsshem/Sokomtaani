"use client";

import React from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { mailtoHref, telHref, whatsappHref } from "../lib/format";
import Dialog from "./Dialog";

export default function ContactDialog({ listing, onClose }) {
  const open = !!listing;
  const phone = listing?.contact_phone?.trim();
  const email = listing?.contact_email?.trim();
  const about = listing ? `Hi, I'm interested in "${listing.title}" on SokoMtaani.` : "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Contact seller"
      description={listing ? `About: ${listing.title}` : undefined}
    >
      <div className="space-y-3">
        {phone && (
          <>
            <a
              href={telHref(phone)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
            >
              <Phone size={18} aria-hidden="true" />
              Call {phone}
            </a>
            <a
              href={whatsappHref(phone, about)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f8f4e] px-4 py-3 font-medium text-white hover:bg-[#187a42]"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp
            </a>
          </>
        )}
        {email && (
          <a
            href={mailtoHref(email, listing ? `SokoMtaani: ${listing.title}` : "")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800"
          >
            <Mail size={18} aria-hidden="true" />
            <span className="truncate">Email {email}</span>
          </a>
        )}
        {!phone && !email && <p className="text-gray-600">This seller hasn&apos;t shared contact details.</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
      >
        Cancel
      </button>
    </Dialog>
  );
}
