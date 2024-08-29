// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axiosInstance from './axiosInstance';
import EnhancedProgressLoader from '@/components/loader';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  user:CleanedProfileInfo;
  setUser: React.Dispatch<React.SetStateAction<CleanedProfileInfo>>;
  userProfileImage:string
}

// Interfaces
interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  readingTime: number | null;
  tags: Tag[];
  comments: Comment[];
  likes: Like[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

interface Like {
  id: string;
  createdAt: string;
  userId: string;
  postId: string;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  follower: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

interface ProfileInfo {
  id: string;
  email: string;
  name: string | null;
  password?: string;
  bio: string | null;
  profileImage: string | null;
  createdAt?: string;
  updatedAt?: string;
  posts: Post[];
  comments?: Comment[];
  likes: Like[];
  followers: Follow[];
  following: Follow[];
  TagFollow: any[]; // You might want to define a more specific interface for TagFollow if needed
}

type CleanedProfileInfo = Omit<ProfileInfo, 'updatedAt' | 'createdAt' | 'comments'>;

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<CleanedProfileInfo | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [userProfileImage, setuserProfileImage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('mediumAuthToken');
      if(!token){
        console.log("No existing sessions.")
      }
      else{
        fetchUser();
        setIsAuthenticated(!!token);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setLoadingProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 60); // Adjust timing as needed

      return () => clearInterval(timer);
    }
  }, [loading]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('mediumAuthToken');
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await axiosInstance.get('/api/v1/user/me', {
        headers: {'Authorization': `Bearer ${token}`}
      });
      const { data } = response;

      if (data.profileImage) {
        try{
          const profileImageResponse = await axiosInstance.get(`/api/v1/user/get-image/${data.profileImage}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'arraybuffer'
          });
          const profileImageBlob = new Blob([profileImageResponse.data], { type: 'image/jpeg' });
          setuserProfileImage(URL.createObjectURL(profileImageBlob));
        }
        catch (imageError) {
          console.error('Error fetching profile image:', imageError);
        }
      }

      const {
        updatedAt,
        password,
        createdAt,
        comments,
        ...cleanedProfileInfo
      } = data as ProfileInfo;
      setUser(cleanedProfileInfo);
      setIsLoading(false);
      // console.log("Auth context",data);
    }
    catch(error){
      console.error('Error fetching user:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, user, userProfileImage }}>
      {loading ? 
        (
          <EnhancedProgressLoader progress={loadingProgress}/>
        )
      : 
        (
          children
        )
      }
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};