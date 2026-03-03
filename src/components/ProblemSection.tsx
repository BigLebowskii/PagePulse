export default function ProblemSection() {
  const problems = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      title: "Broken links send visitors away",
      color: "text-pulse",
      bg: "bg-red-50",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Slow pages kill your Google ranking",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: "Mobile issues frustrate 60% of your traffic",
      color: "text-primary-500",
      bg: "bg-primary-50",
    },
  ];

  return (
    <section id="problems" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Your Website Might Be Sick &mdash; And You Don&apos;t Even Know It
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div
                className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl ${item.bg} ${item.color} mb-5`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Most small business owners don&apos;t know these problems exist until
          it&apos;s too late. Enterprise tools like Ahrefs ($99/mo) and SEMrush
          ($130/mo) are overkill. You just need to know what&apos;s broken and
          how to fix it.
        </p>
      </div>
    </section>
  );
}
