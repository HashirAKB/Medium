import './App.css'
import { Toaster } from "@/components/ui/toaster"
import SignUp from './pages/SignupForm'
import SignIn from './pages/SigninForm'
import Navbar from './components/NavBar'
import Home from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './utils/AuthContext'
import { BlogFeed } from './pages/BlogFeed'
// import { ProtectedRoute } from './components/ProtectedRoutes'

const postsList = [
  // {
  //   id: '1',
  //   title: 'The Future of Artificial Intelligence',
  //   content: "Artificial Intelligence (AI) is rapidly evolving, transforming industries and reshaping our daily lives. From self-driving cars to advanced medical diagnostics, AI is pushing the boundaries of what's possible. But with great power comes great responsibility. As we continue to develop more sophisticated AI systems, we must also grapple with ethical considerations and potential societal impacts...",
  //   createdAt: new Date(2023, 5, 15), // June 15, 2023
  //   author: {
  //     name: 'Dr. Emily Chen',
  //     image: 'https://i.pravatar.cc/150?img=1'
  //   },
  //   tags: [{ name: 'AI' }, { name: 'Technology' }, { name: 'Ethics' }],
  //   readingTime: 8,
  //   likesCount: 127,
  //   commentsCount: 32
  // },
  // {
  //   id: '2',
  //   title: 'Sustainable Living in Urban Environments',
  //   content: 'As our cities grow larger and more populous, the need for sustainable living practices becomes increasingly crucial. Urban dwellers are finding innovative ways to reduce their carbon footprint, from vertical gardens to community-supported agriculture. This article explores practical tips and emerging trends in sustainable urban living...',
  //   createdAt: new Date(2023, 5, 20), // June 20, 2023
  //   author: {
  //     name: 'Michael Green',
  //     image: 'https://i.pravatar.cc/150?img=2'
  //   },
  //   tags: [{ name: 'Sustainability' }, { name: 'Urban Living' }, { name: 'Environment' }],
  //   readingTime: 6,
  //   likesCount: 95,
  //   commentsCount: 18
  // },
  // {
  //   id: '3',
  //   title: 'The Rise of Decentralized Finance (DeFi)',
  //   content: 'Decentralized Finance, or DeFi, is revolutionizing the world of finance. By leveraging blockchain technology, DeFi platforms are creating new financial instruments and services that operate without traditional intermediaries. From lending and borrowing to complex derivatives, DeFi is opening up a world of financial opportunities. However, it also comes with its own set of risks and challenges...',
  //   createdAt: new Date(2023, 5, 25), // June 25, 2023
  //   author: {
  //     name: 'Satoshi Nakamoto',
  //     image: 'https://i.pravatar.cc/150?img=3'
  //   },
  //   tags: [{ name: 'DeFi' }, { name: 'Blockchain' }, { name: 'Finance' }],
  //   readingTime: 10,
  //   likesCount: 210,
  //   commentsCount: 45
  // },
  {
    id: '1',
    title: "The Rise of TypeScript",
    content: "TypeScript has taken the JavaScript community by storm, offering static typing and improved tooling jjewdje jednjwdw jwnedwend ewdnwejndw wedlwdwemdw dnejdwne...",
    createdAt: new Date('2023-07-01T10:00:00Z'),
    author: {
      name: 'Dr. Emily Chen',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    tags: [{ name: 'AI' }, { name: 'Technology' }, { name: 'Ethics' }],
    readingTime: 5,
    _count: {
      likes: 120,
      comments: 30,
    },
  },
  {
    id: '2',
    title: "Understanding React Hooks",
    content: "React Hooks have revolutionized how developers build React applications. This post dives into useState, useEffect, and custom hooks...",
    createdAt: new Date('2023-07-05T14:00:00Z'),
    author: {
      name: "Jane Smith",
    },
    tags: [{ name: 'Sustainability' }, { name: 'Urban Living' }, { name: 'Environment' }],
    readingTime: 8,
    _count: {
      likes: 200,
      comments: 50,
    },
  },
  {
    id: '3',
    title: "A Guide to Responsive Design",
    content: "Responsive design is crucial in the modern web development landscape. Learn how to make your websites look great on any device...",
    createdAt: new Date('2023-07-10T08:30:00Z'),
    author: {
      name: "Alice Jhonson",
    },
    tags: [{ name: 'DeFi' }, { name: 'Blockchain' }, { name: 'Finance' }],
    readingTime: 7,
    _count: {
      likes: 180,
      comments: 25,
    },
  },
  {
    id: '4',
    title: "The Future of Web Development",
    content: "With the rise of new frameworks and tools, the future of web development looks promising. Explore what's on the horizon...",
    createdAt: new Date('2023-07-15T11:15:00Z'),
    author: {
      name: "Bob Brown",
    },
    tags: [{ name: 'DeFi' }, { name: 'Blockchain' }, { name: 'Finance' }],
    readingTime: 10,
    _count: {
      likes: 250,
      comments: 40,
    },
  },
  {
    id: '5',
    title: "Mastering CSS Grid",
    content: "CSS Grid has become a game-changer for web layouts. This post covers everything you need to know to start using CSS Grid like a pro...",
    createdAt: new Date('2023-07-20T09:45:00Z'),
    author: {
      name: "Charlie Davies",
    },
    tags: [{ name: 'DeFi' }, { name: 'Blockchain' }, { name: 'Finance' }],
    readingTime: 6,
    _count: {
      likes: 140,
      comments: 35,
    },
  },
];

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
            <Route path="/feed" element={<BlogFeed posts={postsList}/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
