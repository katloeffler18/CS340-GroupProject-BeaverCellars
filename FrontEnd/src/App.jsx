/*
# Citation for the following code:
# Date: 2025-11-19
# AI-assisted: Reset database button handler was adapted with AI help (ChatGPT)
# Source URL: N/A
*/

import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Wines from './components/Wines';
import Members from './components/Members';
import CreditCards from './components/CreditCards';
import Orders from './components/Orders';
import WinesOrders from './components/WinesOrders';
import Shipments from './components/Shipments';

function App() {
  const url = "http://classwork.engr.oregonstate.edu";

  // Handler for the "Reset Database" button
  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to RESET the entire database? This cannot be undone."
    );
    if (!confirmReset) return;

    try {
      const response = await fetch(`${url}:35827/reset-database`, { method: "POST" });

      if (response.ok) {
        alert("Database reset successfully!");
        window.location.reload(); // Refresh page to reflect reset
      } else {
        alert("Error resetting database.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while resetting database.");
    }
  };

  return (
    <Router>
      <header>
        {/* App title */}
        <h1 className='header'>Beaver Cellars</h1>

        {/* Top navigation bar */}
        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/wines">Wines</Link>
          <Link to="/members">Members</Link>
          <Link to="/creditcards">Credit Cards</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/winesorders">Order Details</Link>
          <Link to="/shipments">Shipments</Link>

          {/* Reset database button */}
          <button 
            className="reset-btn" 
            onClick={handleReset}
          >
            Reset
          </button>
        </nav>

        {/* Define routes for the app */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wines" element={<Wines url={url}/>} />
          <Route path="/members" element={<Members url={url}/>} />
          <Route path="/creditcards" element={<CreditCards url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
          <Route path="/winesorders" element={<WinesOrders url={url}/>} />
          <Route path="/shipments" element={<Shipments url={url}/>} />
        </Routes>
      </header>
    </Router>
  );
}

export default App;
