export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Paste Your URL",
      description: "Enter any website address — yours or a competitor's.",
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      number: "2",
      title: "We Run 6 Health Checks",
      description: "Our engine scans for broken links, speed issues, SEO problems, and more.",
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      number: "3",
      title: "Get Your Health Report",
      description: "Download a clear PDF report with plain-English fixes for every issue.",
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Three simple steps to a healthier website.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Step circle */}
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-primary-200 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white">
                  {step.icon}
                </div>
              </div>
              {/* Number badge */}
              <div className="absolute -top-1 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-pulse text-white text-xs font-bold md:left-1/2 md:ml-6 md:right-auto">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-slate-600 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
