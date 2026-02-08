import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyDifferent } from "@/components/sections/why-different";
import { WhoItsFor } from "@/components/sections/who-its-for";
import { WaitlistSignup } from "@/components/sections/waitlist-signup";
import { SocialProof } from "@/components/sections/social-proof";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
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
  );
}
