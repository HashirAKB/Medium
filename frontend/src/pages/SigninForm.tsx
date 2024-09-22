import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SigninSchema, SigninInput } from '@hashirakb/common4medium';
import axiosInstance from '@/utils/axiosInstance';
import { Loader2, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/utils/AuthContext';
import { useToast } from "@/components/ui/use-toast"
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const DoSignIn = (data: SigninInput): Promise<void> => {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/v1/user/signin', data)
      .then(function (response) {
        if(response.status == 200){
            console.log("Signin successfull");
            localStorage.setItem('mediumAuthToken', response.data.token);
            resolve();
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response.data);
        reject(error);
      });
  })
}

// Simulated social login function
const simulateSocialLogin = (provider: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${provider} login initiated`)
      resolve()
    }, 1500)
  })
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { setIsAuthenticated, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInput>({
    resolver: zodResolver(SigninSchema),
  })

  const handleNavigateDashboard = () => {
    // Redirect the user
    const origin = location.state?.from?.pathname || '/';
    navigate(origin);
  }

  const onSubmit = async (data: SigninInput) => {
    setIsLoading(true)
    try {
      await DoSignIn(data);
      await fetchUser(); // Fetch user profile after successful sign-in
      toast({
        title: "Sign In Successful",
        description: "Welcome back!",
      })
      setIsAuthenticated(true);
      handleNavigateDashboard();
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Sign In Failed",
        description: error.response?.data.error || "An error occurred. Please try again.",
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
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Access your account to start blogging</CardDescription>
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
          <div className="flex justify-end">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Sign In with Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}