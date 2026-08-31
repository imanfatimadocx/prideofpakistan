interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="flex justify-center py-12 bg-green sm:py-16 lg:py-20">
      <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 text-center flex flex-col justify-center items-center">
        <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-3 font-body">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-bold text-white leading-tight">
          {title}
        </h1>
        <div className="w-12 h-[3px] bg-gold mt-4 mx-auto rounded" />
        {subtitle && (
          <p className="max-w-2xl mx-auto mt-5 text-sm leading-relaxed sm:text-base text-white/75 font-body">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
