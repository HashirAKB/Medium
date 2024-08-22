import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Edit, Home, Menu, Search, User } from 'lucide-react'
import { useAuth } from '@/utils/AuthContext'
import { Link } from 'react-router-dom'

// This would come from your authentication context or state management
// const isAuthenticated = true // Change this to false to see the unsigned-in state

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    console.log("Logging Out");
    localStorage.removeItem('mediumAuthToken');
    setIsAuthenticated(false);
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
            {isAuthenticated && (
                <>
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-5 w-5" />
                Your Feed
              </Link>
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    Your Blogs
                  </Link>
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                    <Edit className="h-5 w-5" />
                    Write a Story
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <Link to='/' className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="h-6 w-6" />
            Medium Vanced
          </Link>
          <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
              <>
            <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
              Your Feed
            </Link>
                <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
                  Your Blogs
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          {isAuthenticated ? (
            <>
              <Button className="hidden md:inline-flex">
                Write a Story
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      src="/placeholder.svg"
                      alt="User avatar"
                      className="rounded-full"
                      height="32"
                      width="32"
                    />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Your Blogs</DropdownMenuItem>
                  <DropdownMenuItem>Write a Story</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link prefetch={false} to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link prefetch={false} to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      {isSearchOpen && (
        <div className="border-t p-4 md:hidden">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  )
}