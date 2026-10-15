import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { saveImage } from '@/app/lib/storage'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB

export async function POST(req: NextRequest) {
  // Only signed-in users (admins or registered members) may upload
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Please sign in to upload.' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const folder = String(formData.get('folder') || 'general')
    if (!(file instanceof File) || file.size === 0)
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: 'Image must be under 8 MB.' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    let url: string
    try {
      url = await saveImage(buffer, folder)
    } catch {
      return NextResponse.json({ error: 'Only JPG, PNG, GIF, WEBP or AVIF images can be uploaded.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, url, path: url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
