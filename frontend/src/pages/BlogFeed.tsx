import { BlogPostCard } from "@/components/BlogCard"
import { useEffect, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Globe, Users } from 'lucide-react'
import axiosInstance from "@/utils/axiosInstance";
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/utils/AuthContext";
import { useLocation } from 'react-router-dom';

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
  
export function BlogFeed() {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<"all" | "following">("all")
  const [postsFromServer, setpostsFromServer] = useState<BlogFeedProps>()
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuth();

  const { toast } = useToast();

  // let postsFromServer: BlogFeedProps;

  useEffect(() => {
    fetchAllBlogs();
  },[location.pathname]);

  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('mediumAuthToken');
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await axiosInstance.get('/api/v1/blog', {
        headers: {'Authorization': `Bearer ${token}`}
      });
      const { data } = response;
      console.log(data);
      setpostsFromServer(data);
      if (location.pathname === '/blogs') {
        setViewMode("all");
      } else if (location.pathname === '/feed') {
        setViewMode("following");
      }
      } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
         title: "Unable to get blogs.",
         description: "Failed to fetch blogs. Please refresh the page or try again later.",
         variant: "destructive",
       });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = viewMode === "all" 
  ? postsFromServer 
  : postsFromServer.filter((post) => {
    return post.author.following.some(follower => user.id === follower.followerId);
  })
  
  // const filteredPosts = viewMode === "all" 
  //   ? posts 
  //   : posts.filter(post => post.isFollowingAuthor)

  return (
    <div className="space-y-6 space-x-20">
      {isLoading ? (
        <div className="min-h-screen w-full bg-white-900 flex items-start justify-center pt-16">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : 
    (<>
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
          likesCount={post.likes.length}
          commentsCount={post.comments.length}
          profileImageKey = {post.author.profileImage}
        />
      ))}
      {viewMode === "following" && filteredPosts.length === 0 && (
        <p className="text-center text-muted-foreground">
          You're not following any authors yet. Switch to "All" to discover new content!
        </p>
      )}
    </>
  )}
  </div>
  )
}