import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params
  const postId = Number(id)
  if (Number.isNaN(postId)) notFound()

  const post = await prisma.blog.findUnique({ where: { id: postId } })
  if (!post || post.status !== 'active') notFound()

  const image = post.image ? `/uploads/${post.image}` : null

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <section className="py-12 bg-cream sm:py-16">
          <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-12">
            <Link href="/pride-blog" className="inline-block mb-6 text-sm text-gold font-body hover:underline">
              ← Back to Pride Blog
            </Link>

            <span className="inline-block bg-gold-pale text-gold text-[10px] font-bold px-2.5 py-0.5 rounded mb-3 tracking-[.08em] uppercase font-body">
              {post.topic}
            </span>
            <h1 className="mb-3 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
              {post.title}
            </h1>
            <p className="mb-6 text-sm text-ink-muted font-body">
              {new Date(post.date).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>

            {image && (
              <div className="w-full h-56 mb-8 overflow-hidden sm:h-80 rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={post.title} className="object-cover w-full h-full" />
              </div>
            )}

            <div
              className="leading-relaxed prose prose-neutral max-w-none font-body text-ink-mid"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}