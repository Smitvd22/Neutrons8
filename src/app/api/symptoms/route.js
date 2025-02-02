import { NextResponse } from 'next/server'
import UserInfo from '@/models/UserInfo'
import dbConnect from '@/lib/mongodb'
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()
    
    // Get request data
    const data = await req.json()

    // Validate required fields based on UserInfo model
    const requiredFields = ['age', 'gender', 'purpose', 'language', 'location', 'severity', 'symptoms', 'emergency_contact']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create new UserInfo document
    const userInfo = new UserInfo({
      ...data,
      userId: session.user.id, // Get user ID from session
      created_at: new Date()
    })

    // Save to database
    await userInfo.save()

    return NextResponse.json({
      success: true,
      data: userInfo
    })

  } catch (error) {
    console.error('Symptoms submission error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Get user's symptoms history
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const symptoms = await UserInfo.find({ userId: session.user.id })
      .sort({ created_at: -1 }) // Most recent first
    
    return NextResponse.json({
      success: true,
      data: symptoms
    })

  } catch (error) {
    console.error('Fetch symptoms error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
} 