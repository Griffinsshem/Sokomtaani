import { describe, expect, it } from "vitest";

import {
  formatPrice,
  mailtoHref,
  safeNextPath,
  telHref,
  toInternationalDigits,
  truncate,
  whatsappHref,
} from "../format";
import { PASSWORD_REGEX, PHONE_REGEX } from "../validation";

describe("formatPrice", () => {
  it("formats KSh with thousands separators", () => {
    expect(formatPrice(1500)).toBe("KSh 1,500");
    expect(formatPrice(49.5)).toBe("KSh 49.5");
    expect(formatPrice("250.00")).toBe("KSh 250");
  });
  it("handles bad input", () => {
    expect(formatPrice(null)).toBe("KSh 0");
    expect(formatPrice("abc")).toBe("KSh —");
  });
});

describe("phone links", () => {
  it("normalises Kenyan numbers", () => {
    expect(toInternationalDigits("0712 345 678")).toBe("254712345678");
    expect(toInternationalDigits("+254712345678")).toBe("254712345678");
    expect(toInternationalDigits("254712345678")).toBe("254712345678");
    expect(toInternationalDigits("712345678")).toBe("254712345678");
    expect(toInternationalDigits("0110123456")).toBe("254110123456");
  });
  it("keeps the + in tel: links", () => {
    expect(telHref("0712345678")).toBe("tel:+254712345678");
    expect(telHref("")).toBe("");
  });
  it("builds WhatsApp links with an encoded message", () => {
    expect(whatsappHref("0712345678", "Hi & hello")).toBe("https://wa.me/254712345678?text=Hi%20%26%20hello");
  });
  it("builds mailto links", () => {
    expect(mailtoHref("a@b.co", "Tomatoes?")).toBe("mailto:a@b.co?subject=Tomatoes%3F");
  });
});

describe("safeNextPath", () => {
  it("allows same-site paths", () => {
    expect(safeNextPath("/my-listings")).toBe("/my-listings");
    expect(safeNextPath("/listing-form?edit=3")).toBe("/listing-form?edit=3");
  });
  it("blocks open redirects", () => {
    expect(safeNextPath("https://evil.com")).toBe("/");
    expect(safeNextPath("//evil.com")).toBe("/");
    expect(safeNextPath("/\\evil.com")).toBe("/");
    expect(safeNextPath(null)).toBe("/");
  });
});

describe("truncate", () => {
  it("shortens long text on a word-ish boundary", () => {
    expect(truncate("a".repeat(200), 10)).toHaveLength(10);
    expect(truncate("short", 10)).toBe("short");
  });
});

describe("validation rules (must match the backend)", () => {
  it("password rule", () => {
    expect(PASSWORD_REGEX.test("Passw0rd!")).toBe(true);
    expect(PASSWORD_REGEX.test("Pass#1234")).toBe(true); // any symbol, not just @$!%*?&
    expect(PASSWORD_REGEX.test("password")).toBe(false);
    expect(PASSWORD_REGEX.test("Sh0rt!")).toBe(false);
  });
  it("phone rule", () => {
    expect(PHONE_REGEX.test("0712345678")).toBe(true);
    expect(PHONE_REGEX.test("+254712345678")).toBe(true);
    expect(PHONE_REGEX.test("12ab")).toBe(false);
  });
});
