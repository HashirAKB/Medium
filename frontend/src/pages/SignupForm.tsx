import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupInput } from '@hashirakb/common4medium';
import axiosInstance from '@/utils/axiosInstance';
import { Loader2, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/utils/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const doSignup = (data: SignupInput): Promise<void> => {
  console.log(data);
  return new Promise((resolve, reject) => {
      axiosInstance.post('/api/v1/user/signup', data)
      .then(function (response) {
        if(response.status == 201){
            console.log("Signup successfull");
            console.log(response);
            localStorage.setItem('mediumAuthToken', response.data.token);
            resolve();
        }
      })
      .catch(function (error) {
        console.log(error.response.data);
        reject(error);
      });
  })
}

// Simulated social login functions
const simulateSocialLogin = (provider: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${provider} login initiated`)
      resolve()
    }, 1500)
  })
}

export default function SignUp() {
  const { fetchUser,setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const handleNavigateToHome = async () => {
    await fetchUser();
    navigate('/');
  }

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true)
    try {
      await doSignup(data);
      setIsAuthenticated(true);
      console.log("next toast")
      toast({
        title: "Signup Successful",
        description: "Welcome to Medium!",
      })
      handleNavigateToHome();
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.response || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      await simulateSocialLogin(provider)
      toast({
        title: "Social Login Successful",
        description: `You've successfully signed in with ${provider}!`,
      })
    } catch (error) {
      toast({
        title: "Social Login Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to start blogging</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
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
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Sign Up with Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}