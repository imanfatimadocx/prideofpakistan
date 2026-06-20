import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const title     = formData.get('title')     as string
    const Profession = formData.get('Profession') as string
    const City      = (formData.get('City')      as string) || ''
    const Country   = (formData.get('Country')   as string) || 'Pakistan'
    const Email     = formData.get('Email')     as string
    const shortdesc = formData.get('shortdesc') as string

    // TODO: upload `formData.get('image')` to Cloudinary and store the
    // returned filename/url in `image` below.

    if (!title || !Profession || !Email || !shortdesc) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const now = new Date()

    await prisma.hallOfFame.create({
      data: {
        title,
        Profession,
        City,
        Country,
        Email,
        shortdesc,
        status:        0,   // pending review — admin approves to make 1
        feature:       0,
        d:             String(now.getDate()),
        m:             String(now.getMonth() + 1),
        y:             now.getFullYear(),
        user_id:       0,
        cat:           1,
        claim:         0,
        facebook:      '',
        linkedin:      '',
        twitter:       '',
        video_intro:   '',
        edu_degree:    '',
        edu_year:      '',
        edu_institute: '',
        edu_desc:      '',
        contact_allow: 0,
        comments_alow: 0,
        allow_fb_page: 0,
        image:         '',
        org_img:       '',
        thumb_img:     '',
        meta_title:    '',
        meta_desc:     '',
        meta_keyword:  '',
        address:       '',
        Telephone:     '',
        Mobile:        '',
        Interests:     '',
        description:   '',
        phonenumber:   '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Profile submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}