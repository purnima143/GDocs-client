import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Editor from './components/Editor';
import Home from './components/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/docs/:fileName/:id' element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
