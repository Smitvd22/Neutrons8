import { connectMongo } from "@/utils/mongodb"
import UserInfo from "@/models/UserInfo"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    await connectMongo()
    const userInfo = await UserInfo.findOne({ email: session.user.email })

    return NextResponse.json({ success: true, data: userInfo })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user information" }, { status: 500 })
  }
}

