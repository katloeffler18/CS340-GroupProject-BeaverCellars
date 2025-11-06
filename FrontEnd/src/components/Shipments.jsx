import React, { useState, useEffect } from 'react';
import '../App.css'

function ShipmentItem({ shipment, handleDelete, handleEdit }) {
  return (
    <tr>
    <td>{shipment.shipmentID}</td>
    <td>{shipment.orderID}</td>
    <td>{shipment.shipmentDate}</td>
    <td>{shipment.carrier}</td>
    <td>{shipment.trackingNumber}</td>
    <td>
      <button onClick={() => handleEdit(shipment)}>Edit</button>
      <button onClick={() => handleDelete(shipment.shipmentID)}>Delete</button>
    </td>
    </tr>
  )
}

function Shipments() {
  const [data, setData] = useState([]);
  const [editingShipment, setEditingShipment] = useState(null);
  const [formData, setFormData] = useState({
    orderID: "",
    shipmentDate: "",
    carrier: "",
    trackingNumber: "",
  });
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
      const response = await fetch("http://localhost:35827/shipments", {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      } catch (error) {
      console.error('Error fetching data:', error);
      return null;
      }
    };

    fetchShipments();
  }, []); 

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:35827/shipments/${id}`, { method: "DELETE" });
    console.log(data.filter(shipment => shipment.shipmentID !== id));
    setData(data.filter(shipment => shipment.shipmentID !== id));
  };

  // Edit handler
  const handleEdit = (shipment) => {
    setEditingShipment(shipment);
    setFormData({
      orderID: shipment.orderID,
      shipmentDate: shipment.shipmentDate,
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber,
    });
  };

// Update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    await fetch(`http://localhost:35827/shipments/${editingShipment.shipmentID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setData((prev) =>
      prev.map((shipment) =>
        shipment.shipmentID === editingShipment.shipmentID ? { ...shipment, ...formData } : shipment
      )
    );
    setEditingShipment(null);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:35827/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipment),
      });

      if (!response.ok) throw new Error(`Error adding shipment: ${response.status}`);

      const addedShipment = await response.json();

      // Update table instantly
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
              <th>Shipment Date</th>
              <th>Carrier</th>
              <th>Tracking Number</th>
              <th>Actions</th>   
              </tr>
          </thead>
          <tbody>
            {data.map((shipment) => (
              <ShipmentItem key={shipment.shipmentID} shipment={shipment} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowAddForm(true)}>Add New Shipment</button>
        {showAddForm && (
          <div>
            <h3>Add New Shipment</h3>
            <div>
              <input
                name="orderID"
                value={newShipment.orderID}
                onChange={(e) => setNewShipment({ ...newShipment, orderID: e.target.value })}
                placeholder="Order ID"
              />
              <input
                name="shipmentDate"
                value={newShipment.shipmentDate}
                onChange={(e) => setNewShipment({ ...newShipment, shipmentDate: e.target.value })}
                placeholder="Date"
              />
              <input
                name="carrier"
                value={newShipment.carrier}
                onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
                placeholder="Carrier"
              />
              <input
                name="trackingNumber"
                value={newShipment.trackingNumber}
                onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
                placeholder="Tracking Number"
              />
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingShipment && (
          <div>
            <h3>Edit Shipment: {editingShipment.shipmentID}</h3>
            <input
              name="orderID"
              value={formData.orderID}
              onChange={handleChange}
              placeholder="Order ID"
            />
            <input
              name="shipmentDate"
              value={formData.shipmentDate}
              onChange={handleChange}
              placeholder="Date"
            />
            <input
              name="carrier"
              value={formData.carrier}
              onChange={handleChange}
              placeholder="Carrier"
            />
            <input
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="Tracking Number"
            />          
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingShipment(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default Shipments

