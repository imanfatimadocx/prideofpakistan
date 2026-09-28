import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '@/app/lib/auth'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB

export async function POST(req: NextRequest) {
  // Only signed-in users (admins or registered members) may upload
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Please sign in to upload.' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0)
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (!file.type.startsWith('image/'))
      return NextResponse.json({ error: 'Only image files can be uploaded.' }, { status: 400 })
    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: 'Image must be under 8 MB.' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'prideofpakistan', resource_type: 'image' },
          (error, result) => {
            if (error || !result) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      }
    )

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      path: result.secure_url, // full Cloudinary URL
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
