import { BlogPostCard } from "@/components/BlogCard"

interface Post {
  id: string
  title: string
  content: string
  createdAt: Date
  author: {
    name: string
    image?: string
  }
  tags: { name: string; }[]
  readingTime?: number
  _count: {
    likes: number
    comments: number
  }
}

interface BlogFeedProps {
  posts: Post[]
}
  
export function BlogFeed({ posts }: BlogFeedProps) {
  return (
    <div className="space-y-6 space-x-20">
    <h1 className="text-xl font-bold text-center mb-6">Latest Blog Posts</h1>
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          createdAt={post.createdAt}
          author={post.author}
          tags={post.tags}
          readingTime={post.readingTime}
          likesCount={post._count.likes}
          commentsCount={post._count.comments}
        />
      ))}
    </div>
  )
}