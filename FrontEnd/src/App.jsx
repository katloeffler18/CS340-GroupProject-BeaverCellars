import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Wines from './components/Wines';
import Members from './components/Members';
import CreditCards from './components/CreditCards';


function App() {

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/wines">Wines</Link> | <Link to="/members">Members</Link> | <Link to="/creditcards">Credit Cards</Link> 
      </nav>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/wines" element={<Wines />} />
        <Route path="/members" element={<Members />} />
        <Route path="/creditcards" element={<CreditCards />} />
      </Routes>
    </Router>
  );
}

export default App
