import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Board from './pages/Board.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostItem from './pages/PostItem.jsx';
import ItemDetail from './pages/itemDetail.jsx';
import MyPosts from './pages/MyPosts.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<PostItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/my-posts" element={<MyPosts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}