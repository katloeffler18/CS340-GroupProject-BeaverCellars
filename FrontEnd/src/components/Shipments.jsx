import React, { useState, useEffect } from 'react';
import '../App.css'

function ShipmentItem({ shipment, handleDelete }) {
  return (
    <tr>
      <td>{shipment.shipmentID}</td>
      <td>{shipment.orderID}</td>
      <td>{shipment.memberName}</td>
      <td>{shipment.shipmentDate}</td>
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShipment, setNewShipment] = useState({
    orderID: "",
    shipmentDate: "",
    carrier: "",
    trackingNumber: "",
  });

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(url.url + ":35827/shipments", {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchShipments();
  }, [url.url]);

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(url.url + `:35827/shipments/${id}`, { method: "DELETE" });
    setData(data.filter(shipment => shipment.shipmentID !== id));
  };

  // Add new shipment
  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipment),
      });

      if (!response.ok) throw new Error(`Error adding shipment: ${response.status}`);

      const addedShipment = await response.json();
      setData((prev) => [...prev, addedShipment]);
      setShowAddForm(false);

      // Reset form
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
          {data.map((shipment) => (
            <ShipmentItem
              key={shipment.shipmentID}
              shipment={shipment}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddForm(true)}>Add New Shipment</button>

      {showAddForm && (
        <div>
          <h3>Add New Shipment</h3>
          <div>
            <label for="orderID">Order ID: </label>
              <select defaultValue="Order ID" id="dropdown" name="orderID" onChange={(e) => setNewShipment({ ...newShipment, orderID: e.target.value })}>
                 <option disabled>Order ID</option>
                 {data.map((shipment) => (<option key={shipment.orderID} value={shipment.orderID}>{shipment.orderID}</option>))}
              </select>
            <br></br>
            <label for="shipmentDate">Shipment Date: </label>
            <input
              name="shipmentDate"
              value={newShipment.shipmentDate}
              onChange={(e) => setNewShipment({ ...newShipment, shipmentDate: e.target.value })}
              placeholder="Date"
            />
            <br></br>
            <label for="carrier">Carrier: </label>
            <input
              name="carrier"
              value={newShipment.carrier}
              onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
              placeholder="Carrier"
            />
            <br></br>
            <label for="trackingNumber">Tracking Number: </label>
            <input
              name="trackingNumber"
              value={newShipment.trackingNumber}
              onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
              placeholder="Tracking Number"
            />
            <br></br>
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={handleAdd}>Save</button>
              <button onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Shipments;
