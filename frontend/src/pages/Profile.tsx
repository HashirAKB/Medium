import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '../utils/axiosInstance'
// import { userUpdateSchema, UserUpdateInput } from '@hashirakb/common4medium'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/utils/AuthContext';

// Zod schema for form validation
const userUpdateSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    bio: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    confirmPassword: z.string().optional(),
    profileImageKey: z.any().optional(),
    followingIds: z.array(z.string()).optional(),
    tagFollowIds: z.array(z.string()).optional()
  })
  .refine((data) => (!data.password || data.password === data.confirmPassword), {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserUpdateInput = z.infer<typeof userUpdateSchema>;

const updateProfile = (data: UserUpdateInput): Promise<void> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('mediumAuthToken');
    axiosInstance.patch('/api/v1/user/me', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        }).then(function (response) {
            if (response.status === 200) {
            // console.log(response);
            console.log("pofile updation successful");
            resolve();
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response.data);
        reject(error);
      });
  });
}

export default function ProfileComponent() {
  const { user, userProfileImage, loading, setIsAuthenticated, fetchUser, setuserProfileImage } = useAuth();
  const [isLoading, setIsLoading] = useState(loading);
  const [profileImage, setProfileImage] = useState('');
  const [profileImageKey, setProfileImageKey] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const followersCount = followers.length;
  const { toast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setProfileImage(userProfileImage);
            reset({
              name: user.name,
              bio: user.bio,
              profileImageKey: user.profileImage,
              followingIds: user.following.map(user => user.id),
              tagFollowIds: user.TagFollow.map(tag => tag.id)
            });
      
            setProfileImageKey(user.profileImage);
            setFollowers(user.following);
            setFollowing(user.followers);
      } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
         title: "Fetch Error",
         description: "Failed to fetch user profile. Please refresh the page or try again later.",
         variant: "destructive",
       });
    }
  };

  const onSubmit = async (data: UserUpdateInput) => {
    // console.log(typeof(profileImageKey));
    setIsLoading(true);
    data.profileImageKey = profileImageKey;
    try {
      await updateProfile(data);
      await fetchUser();
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      reset();
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed",
        description: error.response?.data.error || "Can't update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
      console.log("Logging Out");
      localStorage.removeItem('mediumAuthToken');
      setuserProfileImage('');
      setIsAuthenticated(false);
      toast({
        title: "Logged Out Successfully",
        description: "See you again..."
      })
      navigate('/');
  };

  const handleDeleteProfile = () => {
    const token = localStorage.getItem('mediumAuthToken');
    axiosInstance.delete('/api/v1/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        }).then(function (response) {
            if (response.status === 200) {
            // console.log(response);
            localStorage.removeItem('mediumAuthToken');
            setuserProfileImage('');
            setIsAuthenticated(false);
            console.log("account deleted successfully");
            toast({
              title: "Success",
              description: "Account deleted successfully!",
            });
            navigate('/');
        }
      })
      .catch(function (error) {
        console.log(error);
        toast({
          title: "Failed",
          description: error.response?.data.error || "Can't delete account. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleUnfollow = (userId) => {
    // Implement API call to unfollow user
    const token = localStorage.getItem('mediumAuthToken');
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }
    axiosInstance.delete('/api/v1/follow',{
      data: { followingId: userId },
      headers: { 'Authorization': `Bearer ${token}` } }
    )
    .then(response => {
        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Unfollowed the author!",
          });
          console.log("Unfollowed the author!");
        }
    })
    .catch(error => {
        toast({
          title: "Failed",
          description: error.response?.data.error || "Please try again.",
          variant: "destructive",
        });
        if (error.response) {
            console.log(error.response.data);
        }
    });
    setFollowing(following.filter(user => user.id !== userId));
  };

  const handleImageUpload = async (event) => {
    console.log("imageUpload");
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      // console.log(formData.get("image"));

      try {
        const token = localStorage.getItem('mediumAuthToken');
        const response = await axiosInstance.post('/api/v1/user/upload-image', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          // console.log(response.data);
          console.log('Image uploaded successfully');
          setProfileImageKey(response.data.key);
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

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
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <span>{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && <span>{errors.password.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" {...register('bio')} />
                    {errors.bio && <span>{errors.bio.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profileImage} alt="" />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <Input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Followers ({followersCount})</h3>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      {followers.map((each) => (
                        <div key={each.follower.id} className="flex items-center space-x-2 mb-2">
                          <Avatar>
                            <AvatarImage src={each.follower.profileImage} alt={each.follower.name} />
                            <AvatarFallback>{each.follower.name ? each.follower.name.charAt(0) : each.follower.email.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{each.follower.name || each.follower.email}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Following ({following.length})</h3>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      {following.map((user) => (
                        <div key={user.following.id} className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage src={user.following.image} alt={user.following.name} />
                              <AvatarFallback>{user.following.name ? user.following.name.charAt(0) : user.following.email.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.following.name || user.following.email}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleUnfollow(user.following.id)}>
                            Unfollow
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                    {/* <h3 className="text-lg font-semibold mb-2">Tags ({following.length})</h3>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      {following.map((user) => (
                        <div key={user.id} className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>{user.following.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleUnfollow(user.id)}>
                            Unfollow
                          </Button>
                        </div>
                      ))}
                    </ScrollArea> */}
                  </div>
                </div>
              </div>
              <CardFooter className="flex flex-col space-y-2 mt-5 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <Button type="submit">{isLoading ? "Updating..." : "Update Profile"}</Button>
                </div>
                </CardFooter>
              </form>
              <CardFooter className="flex flex-col space-y-2 mt-5 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your profile.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => console.log('Canceled')}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDeleteProfile}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                </CardFooter>
              {/* </CardFooter>
            </form> */}
          </CardContent>
        </>
      )}
    </Card>
  );
}