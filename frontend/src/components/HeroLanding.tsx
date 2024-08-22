import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

export const HeroSection = () => {
    const [mounted, setMounted] = useState(false)
    const navigate = useNavigate();

    const handleNavigateToFeed = () => {
        console.log("clicked");
        navigate('/feed');
    }
      
    useEffect(() => {
        setMounted(true)
    }, [])
    return(
    <>
        {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              Discover. Write. Understand.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A place to read, write, and deepen your understanding. Join our community of curious minds and passionate writers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={handleNavigateToFeed} size="lg" className="animate-fade-in" style={{ 
                animationDelay: mounted ? '300ms' : '0ms',
                opacity: mounted ? 1 : 0
              }}>
                Start Reading...
              </Button>
              <Button size="lg" variant="outline" className="animate-fade-in" style={{ 
                animationDelay: mounted ? '600ms' : '0ms',
                opacity: mounted ? 1 : 0
              }}>
                Start Writing
              </Button>
            </div>
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <div className="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0">
              <svg
                viewBox="0 0 1026 1026"
                fill="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full animate-spin-slow"
              >
                <path
                  d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
                  stroke="#D4D4D4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M513 1025C230.23 1025 1 795.77 1 513"
                  stroke="url(#:R65m:-gradient-1)"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id=":R65m:-gradient-1"
                    x1="1"
                    y1="513"
                    x2="1"
                    y2="1025"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
    )
}