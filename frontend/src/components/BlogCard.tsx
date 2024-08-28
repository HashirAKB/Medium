import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from '@/utils/axiosInstance'


interface BlogPostCardProps {
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
  profileImageKey: string
}

export function BlogPostCard({
  id,
  title,
  content,
  createdAt,
  author,
  tags,
  readingTime,
  likesCount,
  commentsCount,
  profileImageKey
}: BlogPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('mediumAuthToken');
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      if (profileImageKey) {
        try{
          const profileImageResponse = await axiosInstance.get(`/api/v1/user/get-image/${profileImageKey}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'arraybuffer'
          });
          const profileImageBlob = new Blob([profileImageResponse.data], { type: 'image/jpeg' });
          setProfileImage(URL.createObjectURL(profileImageBlob));
        }
        catch (imageError) {
          console.error('Error fetching profile image:', imageError);
        }
      }
      } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleLike = () => {
    setIsLiked(!isLiked)
    // Todo: Here you would typically call an API to update the like status
  }

  return (
    <Card className="w-10/12">
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
      ) : (
        <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={profileImage} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {readingTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span className="text-xs">{readingTime} min read</span>
            </div>
          )}
        </div>
        <CardTitle className="mt-4">
          <Link to={`/post/${id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{content}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
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
            <span>{likesCount + (isLiked ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>{commentsCount}</span>
          </Button>
        </div>
        <Link to={`/post/${id}`}>
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </Link>
      </CardFooter>
      </>
    )}
    </Card>
  )
}