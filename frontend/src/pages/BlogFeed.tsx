import { BlogPostCard } from "@/components/BlogCard"
import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Globe, Users } from 'lucide-react'

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
  likesCount: number
  commentsCount: number
  isFollowingAuthor: boolean
}

interface BlogFeedProps {
  posts: Post[]
}
  
export function BlogFeed({ posts }: BlogFeedProps) {
  const [viewMode, setViewMode] = useState<"all" | "following">("all")

  const filteredPosts = viewMode === "all" 
    ? posts 
    : posts.filter(post => post.isFollowingAuthor)

  return (
    <div className="space-y-6 space-x-20">
    <h1 className="text-xl font-bold text-center mb-6 ml-20">Latest Blog Posts</h1>
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "all" | "following")}>
          <ToggleGroupItem value="all" aria-label="View all posts">
            <Globe className="h-4 w-4 mr-2" />
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="following" aria-label="View posts from followed authors">
            <Users className="h-4 w-4 mr-2" />
            Following
          </ToggleGroupItem>
        </ToggleGroup>
      {filteredPosts.map((post) => (
        <BlogPostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          createdAt={post.createdAt}
          author={post.author}
          tags={post.tags}
          readingTime={post.readingTime}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
        />
      ))}
      {viewMode === "following" && filteredPosts.length === 0 && (
        <p className="text-center text-muted-foreground">
          You're not following any authors yet. Switch to "All" to discover new content!
        </p>
      )}
    </div>
  )
}