import './App.css'
import { Toaster } from "@/components/ui/toaster"
import SignUp from './pages/SignupForm'
import SignIn from './pages/SigninForm'
import Navbar from './components/NavBar'
import Home from './pages/LandingPage'
import { Footer } from './components/footer'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './utils/AuthContext'
import { BlogFeed } from './pages/BlogFeed'
import { FullBlogPost } from './pages/FullBlogPost'
import { ProtectedRoute } from './components/ProtectedRoutes'
import CreateBlog from './pages/CreateBlog'
import ProfileComponent from './pages/Profile'
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Toaster/>
          <div className="flex-grow"> {/* Added this div to wrap Routes */}
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/signin" element={<SignIn />}/>
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<BlogFeed/>}/>
              <Route path="/myblogs" element={<BlogFeed/>}/>
              <Route path="/feed" element={<BlogFeed/>}/>
              <Route path="/post/:id" element={<FullBlogPost />}/>
              <Route path="/create" element={<CreateBlog />}/>
              <Route path="/profile" element={<ProfileComponent />}/>
              {/* <Route path="/viewblog" element={<BlogPostPage />}/> */}
            </Route>
          </Routes>
          </div>
        <Footer/>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
