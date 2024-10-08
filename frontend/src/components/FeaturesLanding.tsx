import { BookOpen, Feather, Brain } from 'lucide-react'
export const FeaturesSection = () => {
    return(
    <>
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
    </>
    )
}