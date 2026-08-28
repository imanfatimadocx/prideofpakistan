interface Props {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="flex justify-center py-12 bg-white sm:py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-bold text-green leading-tight">
          {title}
        </h1>
        <div className="w-12 h-[3px] bg-gold mt-4 mx-auto rounded" />
        {subtitle && (
          <p className="max-w-2xl mx-auto mt-5 text-sm leading-relaxed sm:text-base text-green font-body">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}