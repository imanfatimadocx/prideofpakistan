import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { datetime: 'desc' },
    })
    return NextResponse.json(videos.map((v) => ({
      ...v,
      video_id: Number(v.video_id),
      views: Number(v.views),
    })))
  } catch (err) {
    console.error('Videos GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { title, description, video_embed_code, thumb_url, category, tags, featured } = await req.json()

    if (!title?.trim() || !video_embed_code?.trim()) {
      return NextResponse.json({ error: 'Title and URL are required.' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title:            title.trim(),
        description:      description?.trim() ?? '',
        video_embed_code: video_embed_code.trim(),
        thumb_url:        thumb_url?.trim() ?? '',
        category:         Number(category ?? 1),
        tags:             tags?.trim() ?? '',
        featured:         featured ? 'feature' : 'no',
        status:           'active',
        views:            BigInt(0),
        ads_embed_code:   '',
        seo_title:        title.trim(),
        seo_keywords:     tags?.trim() ?? '',
        seo_description:  description?.trim()?.slice(0, 255) ?? '',
        server:           'youtube',
      },
    })

    return NextResponse.json({ success: true, video_id: Number(video.video_id) })
  } catch (err) {
    console.error('Video POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { video_id, title, description, video_embed_code, thumb_url, status, featured } = await req.json()
    if (!video_id) return NextResponse.json({ error: 'Missing video_id' }, { status: 400 })

    await prisma.video.update({
      where: { video_id: BigInt(video_id) },
      data: {
        ...(title            !== undefined && { title }),
        ...(description      !== undefined && { description }),
        ...(video_embed_code !== undefined && { video_embed_code }),
        ...(thumb_url        !== undefined && { thumb_url }),
        ...(status           !== undefined && { status }),
        ...(featured         !== undefined && { featured: featured ? 'feature' : 'no' }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Video PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    await prisma.video.delete({ where: { video_id: BigInt(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Video DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}