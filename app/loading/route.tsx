import { ImageResponse } from "next/server";

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
          justifyContent: "center",
          backgroundColor: "#fafafa",
          fontSize: 100,
          fontWeight: 600,
          paddingLeft: 360,
        }}
      >
        <div>Hit</div>
        <div
          style={{
            backgroundColor: "#CCCCFF",
            padding: "0px 10px",
          }}
        >
          Loading
        </div>
        <div>...</div>
      </div>
    )
  );
}
