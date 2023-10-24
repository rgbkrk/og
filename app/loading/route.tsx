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
          backgroundColor: "#e7efef",
          fontSize: 120,
          fontWeight: 600,
          paddingLeft: 60,
        }}
      >
        <div>Hit</div>
        <div>ENTER</div>
        <div>to</div>
        <div>Submit!</div>
        {/* <div style={{ marginTop: 40 }}>Waiting...</div> */}
        {/* <div style={{ marginTop: 40 }}>Hit enter to submit</div> */}
      </div>
    ),
  );
}
