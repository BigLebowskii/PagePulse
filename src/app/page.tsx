import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Waitlist from "@/components/Waitlist";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollReveal>
          <ProblemSection />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal>
          <Features />
        </ScrollReveal>
        <ScrollReveal>
          <Pricing />
        </ScrollReveal>
        <Waitlist />
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
