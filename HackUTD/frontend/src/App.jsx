import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import FileUpload from './components/FileUpload';
import Home from './components/Home';
import FilesList from './components/FilesList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/home" element={<Home />} />
        <Route path="/files" element={<FilesList />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;