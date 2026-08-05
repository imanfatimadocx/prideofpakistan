import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await req.json()
    const now = new Date()

    const profile = await prisma.hallOfFame.create({
      data: {
        title:          body.title?.trim() ?? '',
        Profession:     body.Profession?.trim() ?? '',
        City:           body.City?.trim() ?? '',
        Country:        body.Country?.trim() ?? '',
        Email:          body.Email?.trim() ?? '',
        shortdesc:      body.shortdesc?.trim() ?? '',
        description:    body.description?.trim() ?? '',
        image:          body.image ?? '',
        status:         Number(body.status ?? 0),
        feature:        Number(body.featured ?? 0),
        categoryid:     body.categoryid ? Number(body.categoryid) : null,
        facebook:       body.facebook?.trim() ?? '',
        twitter:        body.twitter?.trim() ?? '',
        linkedin:       body.linkedin?.trim() ?? '',
        threads:        body.threads?.trim() ?? '',
        meta_title:     body.meta_title?.trim() ?? '',
        meta_keyword:   body.meta_keywords?.trim() ?? '',
        meta_desc:      body.meta_description?.trim() ?? '',
        d:              String(now.getDate()),
        m:              String(now.getMonth() + 1),
        y:              now.getFullYear(),
        user_id:        0,
        cat:            body.categoryid ? Number(body.categoryid) : 0,
        claim:          0,
        claim_by:       0,
        phonenumber:    '',
        claim_comments: '',
        video_intro:    '',
        edu_degree:     '',
        edu_year:       '',
        edu_institute:  '',
        edu_desc:       '',
        contact_allow:  1,
        comments_alow:  1,
        allow_fb_page:  0,
      },
    })

    return NextResponse.json({ success: true, id: profile.id })
  } catch (err) {
    console.error('Profile create error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}