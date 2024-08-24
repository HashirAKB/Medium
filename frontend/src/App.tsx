import './App.css'
import { Toaster } from "@/components/ui/toaster"
import SignUp from './pages/SignupForm'
import SignIn from './pages/SigninForm'
import Navbar from './components/NavBar'
import Home from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './utils/AuthContext'
import { BlogFeed } from './pages/BlogFeed'
import { dummyBlogs } from './assets/dummyBlogs'
import { FullBlogPost } from './pages/FullBlogPost'
import { ProtectedRoute } from './components/ProtectedRoutes'
import CreateBlog from './pages/CreateBlog'
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Navbar />
          <Toaster/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/signin" element={<SignIn />}/>
            <Route element={<ProtectedRoute />}>
              <Route path="/feed" element={<BlogFeed posts={dummyBlogs}/>}/>
              <Route path="/post/:id" element={<FullBlogPost />}/>
              <Route path="/create" element={<CreateBlog />}/>
              {/* <Route path="/viewblog" element={<BlogPostPage />}/> */}
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
