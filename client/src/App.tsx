import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import PostFeed from './components/Feeds/PostFeed'
import FriendFeed from './components/Feeds/FriendsFeed'
import OwnRecipeFeed from './components/Feeds/OwnRecipeFeed'
import EmailVerify from './components/Modal/EmailVerify'
import ForgetPassword from './components/Modal/ForgetPassword'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      {/* Routes imbriquées pour Home */}
      <Route path="/home" element={<Home />}>
        {/* Route par défaut : redirige vers /home/feed */}
        <Route index element={<Navigate to="feed" replace />} />
        <Route path="feed" element={<PostFeed />} />
        <Route path="for-you" element={<PostFeed />} />
        <Route path="followers" element={<FriendFeed />} />
        <Route path="followings" element={<FriendFeed />} />
        <Route path="my-recipes" element={<OwnRecipeFeed />} />
      </Route>
    </Routes>
  )
}

export default App
