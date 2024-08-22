import { HeroSection } from "@/components/HeroLanding"
import { FeaturesSection } from "@/components/FeaturesLanding"
import { ArticlesSection } from "@/components/ArticlesLanding"
import { CtaSection } from "@/components/CtaLanding"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
        <HeroSection/>
        <FeaturesSection/>
        <ArticlesSection/>
        <CtaSection/>
    </div>
  )
}