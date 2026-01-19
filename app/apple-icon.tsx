import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background: "linear-gradient(135deg, #6FC7A7 0%, #3B9B73 100%)",
          borderRadius: "32px",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="35" cy="78" rx="14" ry="11" fill="white" />
          <rect x="46" y="30" width="5" height="48" fill="white" />
          <path d="M51 30V40C65 36 78 42 78 42V32C78 32 65 26 51 30Z" fill="white" />
          <rect
            x="68"
            y="62"
            width="28"
            height="34"
            rx="4"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
          <rect x="76" y="54" width="28" height="34" rx="4" fill="white" fillOpacity="0.7" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
