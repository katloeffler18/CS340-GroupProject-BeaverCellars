/*
# WinesOrders Component
# Date: 11/30/2025
# Citation for use of AI Tools:
  # Prompt: Fix add/edit to populate names immediately
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

function WinesOrders({ url }) {
  const [data, setData] = useState([]);
  const [editingWine, setEditingWine] = useState(null);
  const [formData, setFormData] = useState({ wineID: "", wineQuantity: "", price: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWine, setNewWine] = useState({ orderID: "", wineID: "", wineQuantity: "", price: "" });

  const fetchWinesOrders = async () => {
    try {
      const response = await fetch(`${url}:35827/winesorders`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchWinesOrders(); }, [url]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this wine order?")) return;
    await fetch(`${url}:35827/winesorders/${id}`, { method: "DELETE" });
    fetchWinesOrders();
  };

  const handleEdit = (wineOrder) => {
    setEditingWine(wineOrder);
    setFormData({ wineID: wineOrder.wineID, wineQuantity: wineOrder.wineQuantity, price: wineOrder.price });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    await fetch(`${url}:35827/winesorders/${editingWine.winesOrdersID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setEditingWine(null);
    fetchWinesOrders();
  };

  const handleAdd = async () => {
    try {
      await fetch(`${url}:35827/winesorders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWine),
      });
      setShowAddForm(false);
      setNewWine({ orderID: "", wineID: "", wineQuantity: "", price: "" });
      fetchWinesOrders(); // Refetch to populate member/wine names
    } catch (err) {
      console.error(err);
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
          {data.map((wineOrder) => (
            <WineOrderItem
              key={wineOrder.winesOrdersID}
              wineOrder={wineOrder}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddForm(true)}>Add Wine to Existing Order</button>

      {showAddForm && (
        <div className="form">
          <h3>Add Wine to Order</h3>
          <label>Order: </label>
          <select value={newWine.orderID} onChange={(e) => setNewWine({ ...newWine, orderID: e.target.value })}>
            <option value="">Select Order</option>
            {data.map((wo) => (
              <option key={wo.orderID} value={wo.orderID}>{wo.memberName} (Order #{wo.orderID})</option>
            ))}
          </select>
          <br />
          <label>Wine: </label>
          <select value={newWine.wineID} onChange={(e) => setNewWine({ ...newWine, wineID: e.target.value })}>
            <option value="">Select Wine</option>
            {data.map((wo) => (
              <option key={wo.wineID} value={wo.wineID}>{wo.wineName}</option>
            ))}
          </select>
          <br />
          <label>Quantity: </label>
          <input type="number" value={newWine.wineQuantity} onChange={(e) => setNewWine({ ...newWine, wineQuantity: e.target.value })} />
          <br />
          <label>Price: </label>
          <input type="number" value={newWine.price} onChange={(e) => setNewWine({ ...newWine, price: e.target.value })} />
          <br />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {editingWine && (
        <div className="form">
          <h3>Edit Wine in Order: {editingWine.winesOrdersID}</h3>
          <label>Wine: </label>
          <select name="wineID" value={formData.wineID} onChange={handleChange}>
            <option value="">Select Wine</option>
            {data.map((wo) => (
              <option key={wo.wineID} value={wo.wineID}>{wo.wineName}</option>
            ))}
          </select>
          <br />
          <label>Quantity: </label>
          <input type="number" name="wineQuantity" value={formData.wineQuantity} onChange={handleChange} />
          <br />
          <label>Price: </label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingWine(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default WinesOrders;
