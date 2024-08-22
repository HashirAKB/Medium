import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp } from 'lucide-react'
export const CtaSection = () => {
    return(
    <>
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
    </>
    )
}