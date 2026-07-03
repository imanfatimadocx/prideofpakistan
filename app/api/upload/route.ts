import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: implement Cloudinary upload
  // For now returns a placeholder response
  return NextResponse.json({ message: 'Upload endpoint - Cloudinary integration pending' }, { status: 501 })
}
