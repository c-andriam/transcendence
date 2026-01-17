import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import PostFeed from './components/Feeds/PostFeed'
import FollowingFeed from './components/Feeds/FollowingFeed'
import FollowerFeed from './components/Feeds/FollowersFeed'
import OwnRecipeFeed from './components/Feeds/OwnRecipeFeed'
import ForgetPassword from './pages/ForgetPassword'
import EmailVerify from './pages/EmailVerify'
import NotFound from './pages/404'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="*" element={<NotFound />} />
      {/* Routes imbriquées pour Home */}
      <Route path="/home" element={<Home />}>
        {/* Route par défaut : redirige vers /home/feed */}
        <Route index element={<Navigate to="feed" replace />} />
        <Route path="feed" element={<PostFeed />} />
        <Route path="for-you" element={<PostFeed />} />
        <Route path="followers" element={<FollowerFeed />} />
        <Route path="followings" element={<FollowingFeed />} />
        <Route path="my-recipes" element={<OwnRecipeFeed />} />
      </Route>
    </Routes>
  )
}

export default App
