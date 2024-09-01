# Medium Vanced

## Overview
**Medium Vanced** is a comprehensive, full-stack blogging platform inspired by Medium, built from scratch to offer a wide range of features for content creation, user interaction, and content management. The application consists of a backend API server, a frontend web application, and shared code components, evolving from a basic setup into a fully-featured, responsive web application.
## Key Features
**1. User Authentication and Management**
   - Signup and signin functionality
   - JWT-based authentication
   - User profile management with bio and profile images
   - Account deletion capability

**2. Content Creation and Management**
   - Blog post creation with a rich text editor
   - Tag system for categorizing content
   - Reading time estimation for posts
   - Image upload functionality

**3. Social Interactions**
   - Follow/unfollow users and tags
   - Like/unlike blog posts
   - Commenting system on blog posts

**4. Content Discovery**
   - Blog feed with filtering options
   - Featured articles section
   - Personalized feed based on followed users and tags

**5. User Interface**
   - Responsive design with mobile-friendly navigation
   - Dynamic content loading with skeleton loaders
   - Customizable UI components (buttons, cards, dropdowns, etc.)

**6. Security**
   - Password hashing and encryption
   - Protected routes for authenticated content

## Technologies Used

### Backend
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Deployment**: Cloudflare Workers (Serverless)
- **Image Storage**: Cloudflare KV

### Frontend
- **Language**: TypeScript
- **Framework**: React
- **State Management**: React Context API
- **Routing**: React Router
- **UI Framework**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Rich Text Editor**: (e.g., Quill, Draft.js)
- **Build Tool**: Vite

### Common
- **Validation**: Zod
- **API Requests**: Axios

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linter**: ESLint
- **Formatter**: Prettier

## Project Structure

1. **Backend**:
   - **Purpose**: RESTful API server for handling routes related to blogs, comments, feeds, user interactions, tags, and follows.
   - **Structure**: 
     - `src/` - Main server file (`index.ts`), middleware, and route handlers.
     - `prisma/` - Database schema and migration files.
     - `tsconfig.json` - TypeScript configuration.

2. **Common**:
   - **Purpose**: Shared code between frontend and backend, including utility functions and shared types/interfaces.
   - **Structure**:
     - `src/` - Shared code.
     - `dist/` - Compiled TypeScript code.
     - `tsconfig.json` - TypeScript configuration.

3. **Frontend**:
   - **Purpose**: React application for the blogging platform, including components for landing pages, blog feeds, blog creation, user profiles, and authentication.
   - **Structure**:
     - `src/` - React components, pages, and utility files.
     - `public/` - Static assets.
     - `dist/` - Built frontend assets.
     - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - TypeScript configurations.

## Gradual Evolution and Milestones

1. Backend Foundation (PR #1, #2)
   - Set up initial database schema
   - Implemented basic routing and API endpoints
   - Introduced Prisma for database management

2. User Authentication (PR #31, #39)
   - Added signup and signin functionality
   - Implemented JWT-based authentication
   - Created protected routes

3. Core Blogging Functionality (PR #36, #45)
   - Introduced blog post creation with rich text editor
   - Implemented blog feed and individual post views
   - Added commenting and liking features

4. Enhanced User Interactions (PR #23, #50)
   - Developed user follow/unfollow functionality
   - Implemented tag following system
   - Enhanced blog post interactions (like/unlike)

5. Frontend Development (PR #32, #35)
   - Created responsive UI with Tailwind CSS
   - Implemented dynamic routing in React
   - Added featured articles and platform showcase sections

6. Performance Optimization (PR #51, #52)
   - Introduced server-side data fetching
   - Implemented loading states and skeleton loaders
   - Enhanced authentication context for better state management

7. Advanced Features (PR #54, #55)
   - Added user-authored post fetching
   - Implemented account deletion feature
   - Enhanced profile management and data retrieval

8. Refinement and Polish (PR #56, #57)
   - Improved TypeScript integration
   - Enhanced UI responsiveness for smaller screens
   - Final touches on navbar and user interface

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/HashirAKB/Medium.git
   cd Medium
   ```

2. Install dependencies:
   ```
   cd ./backend
   npm install
   cd ./frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in frontend and backend directories.
   - Add necessary environment variables (database URL, JWT secret, etc.)

4. Set up the database:
   ```
   npx prisma migrate dev
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Contribution Guidelines

We welcome contributions to improve the Medium Clone application. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the project's coding standards and include tests for new features.

## Deployment

The application is deployed using a **serverless architecture**:

- **Backend:** Cloudflare Workers (Serverless)
- **Image Storage:** Cloudflare KV
- **Frontend:** vercel

- **Live Frontend:** http://medium-vanced.vercel.app/
- **API Endpoint:** https://backend.ahmedhashir96.workers.dev

The use of **Cloudflare Workers** for the backend allows for scalable, serverless execution of the application logic. **Cloudflare KV** is utilized for efficient storage and retrieval of images, providing a robust solution for handling user-uploaded content.

## Contact

HashirAKB - [twitter](https://x.com/HashirAKB)

Project Link: [https://github.com/HashirAKB/Medium](https://github.com/HashirAKB/Medium)
