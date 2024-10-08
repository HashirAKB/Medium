import { Link } from "react-router-dom"

let featArticles = [
    {
      title: "The Future of Artificial Intelligence and it's impacts",
      description: 'Exploring the potential impacts and ethical considerations of AI advancement.',
      author: 'Dr. Emily Chen',
      imageSrc:'/AI.jpg',
      date: 'June 1, 2024',
      id:'1febcb6f-7294-4e91-9ac6-3d0d3cd5b0ca',
    },
    {
      title: 'Sustainable Living in Urban Environments',
      description: 'Practical tips for reducing your carbon footprint while living in the city.',
      author: 'Michael Green',
      imageSrc:'/sus.jpg',
      date: 'May 15, 2024',
      id:'3782926c-3838-4552-8c0f-3b70d55e4c2b',
    },
    {
      title: 'The Art of Mindfulness in a Digital Age',
      description: 'Finding balance and presence in an increasingly connected world.',
      author: 'Sarah Johnson',
      imageSrc:'/mindful.png',
      date: 'April 28, 2024',
      id:'a3340dea-62ec-45a7-8506-302d239f2375',
    },
  ]
export const ArticlesSection = () => {
    return (
        <>
        <section className="py-20 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Featured Articles</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Explore some of our most impactful and thought-provoking pieces.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featArticles.map((post) => (
              <article
                key={post.title}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <img src={post.imageSrc} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <time dateTime={post.date} className="mr-8">
                    {post.date}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                      <circle cx={1} cy={1} r={1}/>
                    </svg>
                    <div className="flex gap-x-2.5">
                      {post.author}
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <Link to={`/post/${post.id}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-300">{post.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
    )
}