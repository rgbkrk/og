import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  console.log("request", request);
  const { searchParams } = new URL(request.url);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 300,
          color: "white",
          background: "#070707",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          border: "10px solid #373737",
        }}
      >
        {searchParams.get("text")}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
      // Default to 'twemoji'
      emoji: "twemoji",
    }
  );
}
