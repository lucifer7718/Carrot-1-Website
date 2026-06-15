import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, query } = body;

    if (!name || !email || !query) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your query has been received successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting your query.",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}