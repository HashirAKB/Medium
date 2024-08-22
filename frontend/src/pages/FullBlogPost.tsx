import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Clock, UserPlus, UserMinus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useParams } from 'react-router-dom'
import { dummyBlogs } from '@/assets/dummyBlogs'

// interface FullBlogPostProps {
//   id: string
//   title: string
//   content: string
//   createdAt: Date
//   author: {
//     id: string
//     name: string
//     image?: string
//   }
//   tags: { name: string }[]
//   readingTime?: number
//   likesCount: number
//   commentsCount: number
// }

export function FullBlogPost() {
    const { id } = useParams<{ id: string }>();
    const post = dummyBlogs.find((blog) => blog.id === id);
    if(post){
        const [isLiked, setIsLiked] = useState(false)
        const [isFollowing, setIsFollowing] = useState(false)
        const [localLikesCount, setLocalLikesCount] = useState(post.likesCount)

        const toggleLike = () => {
            setIsLiked(!isLiked)
            setLocalLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1)
            // Here you would typically call an API to update the like status
        }
        
        const toggleFollow = () => {
            setIsFollowing(!isFollowing)
            // Here you would typically call an API to update the follow status
        }
        return (
            <Card className="w-full max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Link to={`/author/${post.author.id}`}>
                      <Avatar>
                        <AvatarImage src={post.author.image} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link to={`/author/${post.author.id}`} className="text-sm font-medium hover:underline">
                        {post.author.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    size="sm"
                    onClick={toggleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
                <CardTitle className="mt-4 text-2xl lg:text-3xl">
                  {post.title}
                </CardTitle>
                {post.readingTime && (
                  <div className="flex items-center text-muted-foreground mt-2">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="text-sm">{post.readingTime} min read</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {post.content}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.name} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : ''}`}
                    onClick={toggleLike}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{localLikesCount}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentsCount}</span>
                  </Button>
                </div>
              </CardFooter>
              {/* Placeholder for comments component */}
              <div className="mt-8 p-4 border-t">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                {/* Comments component will be inserted here */}
                <p className="text-muted-foreground">Comments component to be added...</p>
              </div>
            </Card>
          )
    }

}