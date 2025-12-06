/*
# WinesOrders Component
# Date: 11/30/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete functionality
  # AI Source URL: https://chatgpt.com/
*/

import React, { useState, useEffect } from 'react';
import '../App.css';

function WineOrderItem({ wineOrder, handleDelete, handleEdit }) {
  return (
    <tr>
      <td>{wineOrder.winesOrdersID}</td>
      <td>{wineOrder.orderID}</td>
      <td>{wineOrder.memberName}</td>
      <td>{wineOrder.wineID}</td>
      <td>{wineOrder.wineName}</td>
      <td>{wineOrder.wineQuantity}</td>
      <td>${wineOrder.price}</td>
      <td>
        <button onClick={() => handleEdit(wineOrder)}>Edit</button>
        <button onClick={() => handleDelete(wineOrder.winesOrdersID)}>Delete</button>
      </td>
    </tr>
  );
}

function WinesOrders(url) {
  const [data, setData] = useState([]); // WinesOrders table
  const [orders, setOrders] = useState([]); // Orders table
  const [wines, setWines] = useState([]); // Wines table
  const [editingWine, setEditingWine] = useState(null);

  const [formData, setFormData] = useState({
    orderID: "",
    wineID: "",
    wineQuantity: "",
    price: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWine, setNewWine] = useState({
    orderID: "",
    wineID: "",
    wineQuantity: "",
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [woRes, ordersRes, winesRes] = await Promise.all([
          fetch(url.url + ":35827/winesorders"),
          fetch(url.url + ":35827/orders"),
          fetch(url.url + ":35827/wines"),
        ]);

        const [woData, ordersData, winesData] = await Promise.all([
          woRes.json(),
          ordersRes.json(),
          winesRes.json(),
        ]);

        setData(woData);
        setOrders(ordersData);
        setWines(winesData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    await fetch(url.url + `:35827/winesorders/${id}`, { method: "DELETE" });
    setData(data.filter(wo => wo.winesOrdersID !== id));
  };

  // Edit handler
  const handleEdit = (wineOrder) => {
    setEditingWine(wineOrder);
    setFormData({
      orderID: wineOrder.orderID,
      wineID: wineOrder.wineID,
      wineQuantity: wineOrder.wineQuantity,
      price: wineOrder.price,
    });
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleUpdate = async () => {
    await fetch(url.url + `:35827/winesorders/${editingWine.winesOrdersID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const selectedOrder = orders.find(o => o.orderID === Number(formData.orderID));
    const selectedWine = wines.find(w => w.wineID === Number(formData.wineID));

    setData(prev =>
      prev.map(wo =>
        wo.winesOrdersID === editingWine.winesOrdersID
          ? {
              ...wo,
              ...formData,
              memberName: selectedOrder ? selectedOrder.memberName : "",
              wineName: selectedWine ? selectedWine.wineName : "",
            }
          : wo
      )
    );

    setEditingWine(null);
  };

  // Add new wine order
  const handleAdd = async () => {
    const payload = {
      orderID: parseInt(newWine.orderID, 10),
      wineID: parseInt(newWine.wineID, 10),
      wineQuantity: parseInt(newWine.wineQuantity, 10),
    };
    try {
      const response = await fetch(url.url + ":35827/winesorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const added = await response.json();

      const selectedOrder = orders.find(o => o.orderID === Number(newWine.orderID));
      const selectedWine = wines.find(w => w.wineID === Number(newWine.wineID));

      added.memberName = selectedOrder ? selectedOrder.memberName : "";
      added.wineName = selectedWine ? selectedWine.wineName : "";

      setData(prev => [...prev, added]);
      setShowAddForm(false);

      setNewWine({ orderID: "", wineID: "", wineQuantity: "", price: "" });
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  return (
    <>
      <table>
        <caption>Order Details</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order ID</th>
            <th>Member Name</th>
            <th>Wine ID</th>
            <th>Wine Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(wo => (
            <WineOrderItem
              key={wo.winesOrdersID}
              wineOrder={wo}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddForm(true)}>Add Wine to Existing Order</button>

      {showAddForm && (
        <div className="form">
          <label>Order:</label>
          <select
            value={newWine.orderID}
            onChange={(e) => setNewWine({ ...newWine, orderID: e.target.value })}
          >
            <option value="">Select Order</option>
            {orders.map(o => (
              <option key={o.orderID} value={o.orderID}>
                {o.orderID} - {o.memberName}
              </option>
            ))}
          </select>

          <label>Wine:</label>
          <select
            value={newWine.wineID}
            onChange={(e) => setNewWine({ ...newWine, wineID: e.target.value })}
          >
            <option value="">Select Wine</option>
            {wines.map(w => (
              <option key={w.wineID} value={w.wineID}>
                {w.wineName}
              </option>
            ))}
          </select>

          <label>Quantity:</label>
          <input
            name="wineQuantity"
            value={newWine.wineQuantity}
            onChange={(e) => setNewWine({ ...newWine, wineQuantity: e.target.value })}
          />

          <br />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {editingWine && (
        <div className="form">
          <h3>Edit Wine in Order: {editingWine.winesOrdersID}</h3>

          <label>Order:</label>
          <select name="orderID" value={formData.orderID} onChange={handleChange}>
            {orders.map(o => (
              <option key={o.orderID} value={o.orderID}>
                {o.orderID} - {o.memberName}
              </option>
            ))}
          </select>

          <label>Wine:</label>
          <select name="wineID" value={formData.wineID} onChange={handleChange}>
            {wines.map(w => (
              <option key={w.wineID} value={w.wineID}>
                {w.wineName}
              </option>
            ))}
          </select>

          <label>Quantity:</label>
          <input name="wineQuantity" value={formData.wineQuantity} onChange={handleChange} />

          <label>Price:</label>
          <input name="price" value={formData.price} onChange={handleChange} />

          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingWine(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default WinesOrders;
