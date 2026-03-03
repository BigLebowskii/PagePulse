"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What does PagePulse check?",
    answer:
      "PagePulse runs 6 comprehensive health checks on your website: Broken Links, Image Alt Text, Page Speed, Meta Tags, Mobile Friendliness, and Heading Structure. Each check comes with a score and plain-English instructions on how to fix any issues found.",
  },
  {
    question: "How is this different from Ahrefs or SEMrush?",
    answer:
      "We focus on the 20% of checks that fix 80% of problems. No complex dashboards, no overwhelming data. Just a clear health report with step-by-step fixes that anyone can follow — even without technical knowledge.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "Not at all. Reports are written in plain English with step-by-step fix instructions. Think of it like a doctor explaining your test results — we tell you what's wrong and exactly how to fix it.",
  },
  {
    question: "Can I use this for client websites?",
    answer:
      "Yes! Our Agency plan includes white-label reports with your branding. Run audits for your clients and deliver professional PDF reports under your own company name.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, 14 days free on all plans. No credit card required. You also get one free audit just for signing up — no plan needed.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about PagePulse.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-base font-medium text-slate-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
