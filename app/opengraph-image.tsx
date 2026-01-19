import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Spotify Info Copy - Extract and copy song information";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6FC7A7 0%, #3B9B73 100%)",
              borderRadius: "24px",
              marginRight: "30px",
            }}
          >
            <svg
              width="80"
              height="80"
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: "#ffffff",
                margin: "0",
                lineHeight: "1.1",
              }}
            >
              Spotify Info Copy
            </h1>
            <p
              style={{
                fontSize: "28px",
                color: "#6FC7A7",
                margin: "10px 0 0 0",
              }}
            >
              Extract & Copy Song Information
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(111, 199, 167, 0.2)",
              borderRadius: "30px",
              color: "#6FC7A7",
              fontSize: "20px",
            }}
          >
            Paste Spotify URL
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(111, 199, 167, 0.2)",
              borderRadius: "30px",
              color: "#6FC7A7",
              fontSize: "20px",
            }}
          >
            Copy Title & Artist
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(111, 199, 167, 0.2)",
              borderRadius: "30px",
              color: "#6FC7A7",
              fontSize: "20px",
            }}
          >
            Share Anywhere
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
