/*
# Shipments Component
# Date: 11/30/2025, Updated 12/4/2025
# Citation for use of AI Tools:
  # Prompt: Implement add/delete functionality and add validation for add form
  # AI Source URL: https://chatgpt.com/
*/

import React, { useState, useEffect } from 'react';
import '../App.css';

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

  const [errors, setErrors] = useState({}); // NEW validation state

  // Load shipments + orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipmentsRes, ordersRes] = await Promise.all([
          fetch(url.url + ":35827/shipments"),
          fetch(url.url + ":35827/orders")
        ]);

        const [shipmentsData, ordersData] = await Promise.all([
          shipmentsRes.json(),
          ordersRes.json()
        ]);

        setData(shipmentsData);
        setOrders(ordersData);

      } catch (err) {
        console.error("Error fetching shipments or orders:", err);
      }
    };

    fetchData();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await fetch(url.url + `:35827/shipments/${id}`, { method: "DELETE" });
    setData(data.filter(s => s.shipmentID !== id));
  };

  // Validation
  const validateShipment = (s) => {
    let errs = {};

    if (!s.orderID) errs.orderID = "Order is required.";
    if (!s.shipmentDate) errs.shipmentDate = "Shipment date is required.";
    if (!s.carrier.trim()) errs.carrier = "Carrier is required.";
    if (!s.trackingNumber.trim()) errs.trackingNumber = "Tracking number is required.";

    return errs;
  };

  // Add shipment
  const handleAdd = async () => {
    const validationErrors = validateShipment(newShipment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      const payload = { ...newShipment, orderID: Number(newShipment.orderID) };

      const response = await fetch(url.url + ":35827/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const added = await response.json();

      // Attach memberName
      const order = orders.find(o => o.orderID === Number(newShipment.orderID));
      added.memberName = order ? order.memberName : "";

      setData(prev => [...prev, added]);
      setShowAddForm(false);

      setNewShipment({ orderID: "", shipmentDate: "", carrier: "", trackingNumber: "" });

    } catch (err) {
      console.error("Add failed:", err);
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

      <button onClick={() => { setShowAddForm(true); setErrors({}); }}>
        Add New Shipment
      </button>

      {showAddForm && (
        <div className="form">
          <h3>Add New Shipment</h3>

          <label>Order ID:</label>
          <select
            value={newShipment.orderID}
            onChange={e => {
              setNewShipment({ ...newShipment, orderID: e.target.value });
              setErrors(prev => ({ ...prev, orderID: "" }));
            }}
          >
            <option value="">Select Order</option>
            {orders.map(o => (
              <option key={o.orderID} value={o.orderID}>
                {o.orderID} - {o.memberName}
              </option>
            ))}
          </select>
          {errors.orderID && <p className="error">{errors.orderID}</p>}

          <label>Shipment Date:</label>
          <input
            type="date"
            value={newShipment.shipmentDate}
            onChange={e => {
              setNewShipment({ ...newShipment, shipmentDate: e.target.value });
              setErrors(prev => ({ ...prev, shipmentDate: "" }));
            }}
          />
          {errors.shipmentDate && <p className="error">{errors.shipmentDate}</p>}

          <label>Carrier:</label>
          <input
            value={newShipment.carrier}
            onChange={e => {
              setNewShipment({ ...newShipment, carrier: e.target.value });
              setErrors(prev => ({ ...prev, carrier: "" }));
            }}
          />
          {errors.carrier && <p className="error">{errors.carrier}</p>}

          <label>Tracking Number:</label>
          <input
            value={newShipment.trackingNumber}
            onChange={e => {
              setNewShipment({ ...newShipment, trackingNumber: e.target.value });
              setErrors(prev => ({ ...prev, trackingNumber: "" }));
            }}
          />
          {errors.trackingNumber && <p className="error">{errors.trackingNumber}</p>}

          <br />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default Shipments;
