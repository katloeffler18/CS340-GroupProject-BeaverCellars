import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Wines from './components/Wines';
import Members from './components/Members';
import CreditCards from './components/CreditCards';
import Orders from './components/Orders';
import Shipments from './components/Shipments';

function App() {

  return (
    <Router>
      <header>
        <h1>Beaver Cellars</h1>
        <nav class="topnav">
          <Link to="/">Home</Link><Link to="/wines">Wines</Link><Link to="/members">Members</Link> 
          <Link to="/creditcards">Credit Cards</Link><Link to="/orders">Orders</Link><Link to="/shipments">Shipments</Link>  
        </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wines" element={<Wines />} />
        <Route path="/members" element={<Members />} />
        <Route path="/creditcards" element={<CreditCards />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/shipments" element={<Shipments />} />
      </Routes>
      </header>
    </Router>
  );
}

export default App
