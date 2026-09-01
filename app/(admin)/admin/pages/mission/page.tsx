import AdminNav from '@/app/components/admin/AdminNav'
import { prisma } from '@/app/lib/prisma'
import PageContentClient from '../PageContentClient'

export const revalidate = 0

const DEFAULT_IMAGES = [
  { src: '/mission1.jpeg', caption: 'Abdul Sattar Edhi, Founder of Edhi Foundation' },
  { src: '/mission2.jpeg', caption: 'Dr. Abdul Qadeer Khan, Founder of KRL' },
  { src: '/mission3.jpeg', caption: 'Sadiq Khan, Mayor of London' },
  { src: '/mission4.jpeg', caption: 'Dr. Saud Anwar, State Senator USA' },
]

export default async function AdminMissionPage() {
  const record = await prisma.pageContent.findUnique({ where: { page: 'mission' } })
  const content = (record?.content as Record<string, unknown> | null) ?? {}
  const images  = (content._images as { src: string; caption: string }[] | undefined) ?? DEFAULT_IMAGES

  const textContent: Record<string, string> = {
    heading1: (content.heading1 as string) || 'Recognising Achievement Across the Globe',
    body1a:   (content.body1a   as string) || '',
    body1b:   (content.body1b   as string) || '',
    heading2: (content.heading2 as string) || 'Not Self-Promotion — Genuine Recognition',
    body2a:   (content.body2a   as string) || '',
    body2b:   (content.body2b   as string) || '',
    quote:    (content.quote    as string) || 'We want to ensure their activities are recognized.',
    body2c:   (content.body2c   as string) || '',
  }

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <div className="max-w-[700px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">Our Mission Page</h1>
          <p className="mb-8 text-sm text-ink-muted font-body">Edit the text and images on the Our Mission page.</p>
          <PageContentClient
            page="mission"
            initial={textContent}
            initialImages={images}
            fields={[
              { key: 'heading1', label: 'First Heading',   type: 'text' },
              { key: 'body1a',   label: 'Paragraph 1',     type: 'textarea' },
              { key: 'body1b',   label: 'Paragraph 2',     type: 'textarea' },
              { key: 'heading2', label: 'Second Heading',  type: 'text' },
              { key: 'body2a',   label: 'Paragraph 3',     type: 'textarea' },
              { key: 'body2b',   label: 'Paragraph 4',     type: 'textarea' },
              { key: 'quote',    label: 'Pull Quote',      type: 'text' },
              { key: 'body2c',   label: 'Paragraph 5',     type: 'textarea' },
            ]}
          />
        </div>
      </main>
    </div>
  )
}