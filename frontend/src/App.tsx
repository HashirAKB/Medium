import './App.css'
import { Toaster } from "@/components/ui/toaster"
import SignUp from './pages/SignupForm'
import SignIn from './pages/SigninForm'
import Navbar from './components/NavBar'
import Home from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './utils/AuthContext'
// import { ProtectedRoute } from './components/ProtectedRoutes'


function App() {

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
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
