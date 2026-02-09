import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyDifferent } from "@/components/sections/why-different";
import { WhoItsFor } from "@/components/sections/who-its-for";
import { WaitlistSignup } from "@/components/sections/waitlist-signup";
import { SocialProof } from "@/components/sections/social-proof";
import { Footer } from "@/components/sections/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Matchlyst",
  url: "https://www.matchlyst.com",
  description:
    "An AI-powered platform that generates job-specific interviews and ranks freelancers based on real capability.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.matchlyst.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Matchlyst",
  url: "https://www.matchlyst.com",
  logo: "https://www.matchlyst.com/og-image.png",
  description:
    "Matchlyst helps clients hire freelancers using AI-generated, job-specific interviews. No generic vetting. No spam applications.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main className="relative min-h-screen overflow-hidden">
        <Navbar />
        <Hero />
        <HowItWorks />
        <WhyDifferent />
        <WhoItsFor />
        <WaitlistSignup />
        <SocialProof />
        <Footer />
      </main>
    </>
  );
}
