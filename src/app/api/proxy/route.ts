import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_GATEWAY_BASE_URL = "https://x3araf0ma6.execute-api.us-east-2.amazonaws.com/prod";

export async function POST(req: Request) {
  try {
    const accessToken = await auth0.getAccessToken()
    const { path, body } = await req.json(); // Extract API path & request body

    if (!path) {
      return NextResponse.json({ error: "Missing API path" }, { status: 400 });
    }

    const response = await fetch(`${API_GATEWAY_BASE_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_GW_KEY as string, // Securely use API key
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body || {}), // Ensure a valid request body
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
