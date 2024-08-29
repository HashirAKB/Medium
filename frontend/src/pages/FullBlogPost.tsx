import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Clock, UserPlus, UserMinus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useParams } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from '@/utils/axiosInstance'
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/utils/AuthContext'



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
    const [isLiked, setIsLiked] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [blog, setBlog] = useState('');
    const [localLikesCount, setLocalLikesCount] = useState(null)
    const { toast } = useToast();
    const [profileImage, setProfileImage] = useState('');
    const { user } = useAuth();




    useEffect(() => {
      fetchBlog();
    },[])

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
  
        const token = localStorage.getItem('mediumAuthToken');
        if (!token) {
          throw new Error("Authentication token is missing.");
        }
  
        const response = await axiosInstance.get(`/api/v1/blog/${id}`, {
          headers: {'Authorization': `Bearer ${token}`}
        });

        if (response.data.author.profileImage) {
          try{
            const profileImageResponse = await axiosInstance.get(`/api/v1/user/get-image/${response.data.author.profileImage}`, {
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

        setBlog(response.data);
        setLocalLikesCount(response.data.likes.length)
        console.log("Your id: ", user);

        if(response.data.likes){
          response.data.likes.map((like) =>{
            if(like.userId === user){
              console.log("Liked Already");
              setIsLiked(true);
            }
          })
        }

        if(response.data.author.following){
          console.log("Followers:",response.data.author.following.length);
          response.data.author.following.map((follower) =>{
            if(user === follower.followerId){
              console.log("You're following the account.");
              setIsFollowing(true);
            }
          })
        }

        } catch (error) {
        console.error('Error fetching blogs:', error);
        toast({
           title: "Unable fetch blog.",
           description: "Failed to fetch blog. Please refresh the page or try again later.",
           variant: "destructive",
         });
      } finally {
        setIsLoading(false);
      }
    }

    const toggleLike = () => {
      if(isLiked){
        const token = localStorage.getItem('mediumAuthToken');
        axiosInstance.delete('/api/v1/like',{
          data: { postId: id },
          headers: { 'Authorization': `Bearer ${token}` } }
        )
      .then(response => {
          if (response.status === 200) {
              console.log(response.data);
              console.log("UnLiked the blog");
          }
      })
      .catch(error => {
          console.log(error);
          if (error.response) {
              console.log(error.response.data);
          }
      });

      }
      else{
        const token = localStorage.getItem('mediumAuthToken');
        axiosInstance.post('/api/v1/like', 
          { postId: id },
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(response => {
            if (response.status === 200) {
                console.log(response.data);
                console.log("Liked the blog");
            }
        })
        .catch(error => {
            console.log(error);
            if (error.response) {
                console.log(error.response.data);
            }
        });
      }
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLocalLikesCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);
  }
        
        const toggleFollow = () => {
            // Here you would typically call an API to update the follow status
            if(isFollowing){
              const token = localStorage.getItem('mediumAuthToken');
              axiosInstance.delete('/api/v1/follow',{
                data: { followingId: blog.authorId },
                headers: { 'Authorization': `Bearer ${token}` } }
              )
            .then(response => {
                if (response.status === 200) {
                    console.log("Unfollowed the author!");
                    setIsFollowing(false);
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response) {
                    console.log(error.response.data);
                }
            });
      
            }
            else{
              const token = localStorage.getItem('mediumAuthToken');
              axiosInstance.post('/api/v1/follow', 
                { followingId: blog.authorId },
                { headers: { 'Authorization': `Bearer ${token}` } }
              )
              .then(response => {
                  if (response.status === 200) {
                      console.log("Followed the author!");
                      setIsFollowing(true);
                  }
              })
              .catch(error => {
                  console.log(error);
                  if (error.response) {
                      console.log(error.response.data);
                  }
              });
            }
        }
        return (
            <Card className="w-full max-w-3xl mx-auto">
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
            (
              <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Link to={`/author/${blog.authorId}`}>
                      <Avatar>
                        <AvatarImage src={profileImage} alt={blog.author.name} />
                        <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link to={`/author/${blog.author.id}`} className="text-sm font-medium hover:underline">
                        {blog.author.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
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
                  {blog.title}
                </CardTitle>
                {blog.readingTime && (
                  <div className="flex items-center text-muted-foreground mt-2">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="text-sm">{blog.readingTime} min read</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {blog.content}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
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
                    <span>{blog.comments.length}</span>
                  </Button>
                </div>
              </CardFooter>
              {/* Placeholder for comments component */}
              <div className="mt-8 p-4 border-t">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                {/* Comments component will be inserted here */}
                <p className="text-muted-foreground">Comments component to be added...</p>
              </div>|
              </>
            )}
            </Card>
          )
}