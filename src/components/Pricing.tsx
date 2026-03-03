export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      features: [
        "5 website audits per month",
        "PDF reports",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Growth",
      price: "$49",
      period: "/month",
      features: [
        "25 website audits per month",
        "PDF reports with your branding",
        "Priority email support",
        "Weekly scheduled scans",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Agency",
      price: "$99",
      period: "/month",
      features: [
        "Unlimited audits",
        "White-label PDF reports",
        "API access",
        "Dedicated support",
        "Client dashboard",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Simple Pricing. No Surprises.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 shadow-sm flex flex-col ${
                plan.popular
                  ? "border-2 border-primary-500 shadow-lg shadow-primary-100 scale-105"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-xs font-bold text-white uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-heading font-bold text-slate-900">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                <span className="ml-1 text-slate-500">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-success mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
