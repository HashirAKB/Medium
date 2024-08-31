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
import { BlogContent } from '@/components/BlogContentCard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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
    const navigate = useNavigate();
    const [isViewingOwnBlogs, setIsViewingOwnBlogs] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteBlog = async () => {
      setIsDeleting(true);
      const token = localStorage.getItem('mediumAuthToken');
      try {
        const response = await axiosInstance.delete(`/api/v1/blog/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Blog deleted successfully!",
          });
          navigate('/myblogs');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Failed",
            description: error.response?.data.error || "Failed to delete blog. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsDeleting(false);
      }
    };


    const checkIfViewingOwnBlog = (authorId: string) => {
      return authorId === user.id;
    };

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
        setIsViewingOwnBlogs(checkIfViewingOwnBlog(response.data.authorId));

        if(response.data.likes){
          const userHasLiked = response.data.likes.some(like => like.userId === user.id);
          if (userHasLiked) {
            console.log("Liked Already");
            setIsLiked(true);
          }
        }

        if(response.data.author.following){
          console.log("Followers:",response.data.author.following.length);
          const userIsFollowing = response.data.author.following.some(follower => user.id === follower.followerId);
          if (userIsFollowing) {
            console.log("You're following the account.");
            setIsFollowing(true);
          }
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
      const token = localStorage.getItem('mediumAuthToken');
            if (!token) {
              console.error("Authentication token is missing.");
              return;
            }
      if(isLiked){
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
            const token = localStorage.getItem('mediumAuthToken');
            if (!token) {
              console.error("Authentication token is missing.");
              return;
            }
            // Here you would typically call an API to update the follow status
            if(isFollowing){
              axiosInstance.delete('/api/v1/follow',{
                // @ts-ignore
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
              axiosInstance.post('/api/v1/follow', 
                // @ts-ignore
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
                    <Link to='#'>
                      <Avatar>
                      {/* @ts-ignore */}
                        <AvatarImage src={profileImage} alt={blog.author.name} />
                        {/* @ts-ignore */}
                        <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                    {/* @ts-ignore */}
                      <Link to={`/author/${blog.author.id}`} className="text-sm font-medium hover:underline">
                      {/* @ts-ignore */}
                        {blog.author.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                      {/* @ts-ignore */}
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
                {/* @ts-ignore */}
                  {blog.title}
                </CardTitle>
                {/* @ts-ignore */}
                {blog.readingTime && (
                  <div className="flex items-center text-muted-foreground mt-2">
                    <Clock className="mr-1 h-4 w-4" />
                    {/* @ts-ignore */}
                    <span className="text-sm">{blog.readingTime} min read</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                {/* @ts-ignore */}
                  <BlogContent content={blog.content} />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                {/* @ts-ignore */}
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
                    <span>
                    {/* @ts-ignore */}
                      {blog.comments.length}</span>
                  </Button>
                </div>
                {isViewingOwnBlogs ? (
                <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Blog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the blog.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => console.log('Canceled')}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteBlog}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
                ):(<></>)}
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