import { ImageResponse } from "next/og";

import { BRAND_GREEN, LOGO_MARK_PATH } from "../lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 42 42">
          <path fill={BRAND_GREEN} fillRule="evenodd" clipRule="evenodd" d={LOGO_MARK_PATH} />
        </svg>
      </div>
    ),
    size
  );
}
