import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Wines from './components/Wines';
import Members from './components/Members';


function App() {

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/wines">Wines</Link> | <Link to="/members">Members</Link> 
      </nav>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/wines" element={<Wines />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
}

export default App
