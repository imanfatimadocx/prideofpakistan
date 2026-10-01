interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="px-4 py-10 bg-green sm:px-8 lg:px-12 sm:py-14">
      <div className="max-w-[1280px] mx-auto">
        <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
          {eyebrow}
        </p>
        <h1 className="mb-3 text-3xl font-black leading-tight text-white font-display sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="w-full text-sm leading-relaxed whitespace-pre-line text-white/65 font-body sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
