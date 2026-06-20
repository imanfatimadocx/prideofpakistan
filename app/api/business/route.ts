import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const company_name        = formData.get('company_name')        as string
    const name                = formData.get('name')                as string
    const l_name              = (formData.get('l_name')             as string) || ''
    const email               = formData.get('email')               as string
    const phone               = (formData.get('phone')              as string) || ''
    const city                = formData.get('city')                as string
    const country             = (formData.get('country')            as string) || 'Pakistan'
    const site_url            = (formData.get('site_url')           as string) || ''
    const shortdesc           = formData.get('shortdesc')           as string
    const company_description = (formData.get('company_description') as string) || ''

    // TODO: upload `formData.get('image')` to Cloudinary and store the
    // returned filename/url in `image` below.

    if (!company_name || !name || !email || !city || !shortdesc) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await prisma.business.create({
      data: {
        company_name,
        name,
        l_name,
        email,
        phone,
        city,
        country,
        site_url,
        shortdesc,
        company_description,
        status:      0,   // pending review — admin approves to make 1
        feature:     0,
        user_id:     0,
        busniss_id:  0,
        title:       '',
        description: '',
        address:     '',
        no_of_emplys:'',
        keywords:    '',
        image:       '',
        org_img:     '',
        lng:         '',
        lat:         '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Business submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}