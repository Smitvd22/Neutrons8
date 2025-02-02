import { connectMongo } from "@/utils/mongodb";
import UserInfo from "@/models/UserInfo";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.json();
    const userInfo = await UserInfo.create(data);
    return NextResponse.json({ success: true, data: userInfo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit information" },
      { status: 500 }
    );
  }
}
