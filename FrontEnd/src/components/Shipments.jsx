/*
# Shipments Component (Updated)
# Date: 11/30/2025
# Citation for use of AI Tools:
  # Prompt: Fix add/delete, order dropdown, and date formatting
  # AI Source URL: https://chatgpt.com/ 
*/

import React, { useState, useEffect } from 'react';
import '../App.css'

function ShipmentItem({ shipment, handleDelete }) {
  return (
    <tr>
      <td>{shipment.shipmentID}</td>
      <td>{shipment.orderID}</td>
      <td>{shipment.memberName}</td>
      <td>{new Date(shipment.shipmentDate).toLocaleDateString()}</td>
      <td>{shipment.carrier}</td>
      <td>{shipment.trackingNumber}</td>
      <td>
        <button onClick={() => handleDelete(shipment.shipmentID)}>Delete</button>
      </td>
    </tr>
  );
}

function Shipments(url) {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShipment, setNewShipment] = useState({
    orderID: "",
    shipmentDate: "",
    carrier: "",
    trackingNumber: "",
  });

  // Fetch shipments and orders for dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipRes, ordersRes] = await Promise.all([
          fetch(url.url + ":35827/shipments"),
          fetch(url.url + ":35827/orders")
        ]);

        const shipments = await shipRes.json();
        const ordersData = await ordersRes.json();

        setData(shipments);
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [url.url]);

  // Delete shipment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) return;
    await fetch(url.url + `:35827/shipments/${id}`, { method: "DELETE" });
    setData(prev => prev.filter(shipment => shipment.shipmentID !== id));
  };

  // Add new shipment
  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipment)
      });

      if (!response.ok) throw new Error(`Error adding shipment: ${response.status}`);

      const addedShipment = await response.json();
      setData(prev => [...prev, addedShipment]);
      setShowAddForm(false);
      setNewShipment({
        orderID: "",
        shipmentDate: "",
        carrier: "",
        trackingNumber: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <table>
        <caption>Shipments</caption>
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Order ID</th>
            <th>Member Name</th>
            <th>Shipment Date</th>
            <th>Carrier</th>
            <th>Tracking Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(shipment => (
            <ShipmentItem key={shipment.shipmentID} shipment={shipment} handleDelete={handleDelete} />
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddForm(true)}>Add New Shipment</button>

      {showAddForm && (
        <div className='form'>
          <h3>Add New Shipment</h3>

          <label>Order:</label>
          <select
            value={newShipment.orderID}
            onChange={(e) => setNewShipment({...newShipment, orderID: e.target.value})}
          >
            <option value="">Select Order</option>
            {orders.map(order => (
              <option key={order.orderID} value={order.orderID}>
                {order.orderID} — {order.memberName}
              </option>
            ))}
          </select>

          <label>Shipment Date:</label>
          <input
            type="date"
            value={newShipment.shipmentDate}
            onChange={(e) => setNewShipment({...newShipment, shipmentDate: e.target.value})}
          />

          <label>Carrier:</label>
          <input
            value={newShipment.carrier}
            onChange={(e) => setNewShipment({...newShipment, carrier: e.target.value})}
            placeholder="Carrier"
          />

          <label>Tracking Number:</label>
          <input
            value={newShipment.trackingNumber}
            onChange={(e) => setNewShipment({...newShipment, trackingNumber: e.target.value})}
            placeholder="Tracking Number"
          />

          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={handleAdd}>Save</button>
            <button onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Shipments;
