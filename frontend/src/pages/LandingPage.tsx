import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Feather, Brain, TrendingUp } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                <Button size="lg" className="animate-fade-in" style={{ 
                  animationDelay: mounted ? '300ms' : '0ms',
                  opacity: mounted ? 1 : 0
                }}>
                  Start Reading
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

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Everything you need to grow your knowledge</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Our platform provides the perfect environment for readers and writers alike to explore ideas, share insights, and expand their understanding.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Discover new perspectives',
                  description: 'Explore a wide range of topics and viewpoints from our diverse community of writers.',
                  icon: BookOpen,
                },
                {
                  name: 'Express your ideas',
                  description: 'Share your thoughts and experiences with our supportive and engaged audience.',
                  icon: Feather,
                },
                {
                  name: 'Deepen your understanding',
                  description: 'Engage with complex ideas and develop a more nuanced view of the world.',
                  icon: Brain,
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-base font-semibold text-primary">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Featured Articles</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Explore some of our most impactful and thought-provoking pieces.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'The Future of Artificial Intelligence',
                description: 'Exploring the potential impacts and ethical considerations of AI advancement.',
                author: 'Dr. Emily Chen',
                date: 'June 1, 2023',
              },
              {
                title: 'Sustainable Living in Urban Environments',
                description: 'Practical tips for reducing your carbon footprint while living in the city.',
                author: 'Michael Green',
                date: 'May 15, 2023',
              },
              {
                title: 'The Art of Mindfulness in a Digital Age',
                description: 'Finding balance and presence in an increasingly connected world.',
                author: 'Sarah Johnson',
                date: 'April 28, 2023',
              },
            ].map((post) => (
              <article
                key={post.title}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <img src="/placeholder.svg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <time dateTime={post.date} className="mr-8">
                    {post.date}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <div className="flex gap-x-2.5">
                      {post.author}
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <a href="#">
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-gray-300">{post.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-primary px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start your writing journey today
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
              Join our community of writers and share your unique perspective with the world.
            </p>
            <form className="mx-auto mt-10 flex max-w-md gap-x-4">
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto"
                placeholder="Enter your email"
              />
              <Button type="submit" size="lg">
                Get started
              </Button>
            </form>
            <TrendingUp className="absolute left-1/2 top-0 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 stroke-white/10 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]" />
          </div>
        </div>
      </section>
    </div>
  )
}