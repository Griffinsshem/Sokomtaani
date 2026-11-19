import { ImageResponse } from "next/og";

import { BRAND_GREEN, LOGO_MARK_PATH } from "../lib/brand";

export const alt = "SokoMtaani — Fresh produce direct from Kenyan farmers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              background: "#ffffff",
              borderRadius: "24px",
            }}
          >
            <svg width="88" height="88" viewBox="0 0 42 42">
              <path fill={BRAND_GREEN} fillRule="evenodd" clipRule="evenodd" d={LOGO_MARK_PATH} />
            </svg>
          </div>
          <div style={{ fontSize: "84px", fontWeight: 700 }}>SokoMtaani</div>
        </div>
        <div style={{ fontSize: "48px", fontWeight: 600, lineHeight: 1.2, maxWidth: "900px" }}>
          Fresh produce, direct from Kenyan farmers
        </div>
        <div style={{ marginTop: "24px", fontSize: "32px", color: "#fde047" }}>
          No middlemen · Fair prices · Local sellers
        </div>
      </div>
    ),
    size
  );
}
