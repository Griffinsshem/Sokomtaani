const priceFormatter = new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** 1500 -> "KSh 1,500", 49.5 -> "KSh 49.5" */
export function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "KSh —";
  return `KSh ${priceFormatter.format(n)}`;
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Normalise a Kenyan phone number to international digits (no "+").
 * "0712 345 678" -> "254712345678", "+254712345678" -> "254712345678",
 * "712345678" -> "254712345678". Other countries' numbers are kept as digits.
 */
export function toInternationalDigits(phone) {
  if (!phone) return "";
  const raw = String(phone).trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return digits;
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9 && /^[17]/.test(digits)) return `254${digits}`;
  return digits;
}

/** tel: link that keeps the international "+" prefix. */
export function telHref(phone) {
  const intl = toInternationalDigits(phone);
  return intl ? `tel:+${intl}` : "";
}

export function whatsappHref(phone, message = "") {
  const intl = toInternationalDigits(phone);
  if (!intl) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${intl}${text}`;
}

export function mailtoHref(email, subject = "") {
  if (!email) return "";
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${q}`;
}

/** Only allow same-site relative redirects (prevents open redirects). */
export function safeNextPath(next, fallback = "/") {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

export function truncate(text, max = 160) {
  if (!text) return "";
  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
