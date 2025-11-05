import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Wines from './components/Wines';


function App() {

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/wines">Wines</Link> 
      </nav>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/wines" element={<Wines />} />
      </Routes>
    </Router>
  );
}

export default App
