interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="py-10 bg-sage border-b border-leaf/40 sm:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <p className="text-[11px] font-bold tracking-[.16em] uppercase text-green-mid mb-2 font-body">
          {eyebrow}
        </p>
        <h1 className="mb-3 text-3xl font-black leading-tight text-green font-display sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="w-full text-sm leading-relaxed whitespace-pre-line text-ink-dark/85 font-body sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
