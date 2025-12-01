/*
# WinesOrders Component (Fully Updated)
# Date: 11/30/2025
# Citation for use of AI Tools:
  # Prompt: Fix dropdowns, add/edit logic, data formatting, and component behavior
  # AI Source URL: https://chatgpt.com/ 
*/

import React, { useState, useEffect } from "react";
import "../App.css";

function WineOrderItem({ wineOrder, handleDelete, handleEdit }) {
  return (
    <tr>
      <td>{wineOrder.winesOrdersID}</td>
      <td>{wineOrder.orderID}</td>
      <td>{wineOrder.memberName}</td>
      <td>{wineOrder.wineID}</td>
      <td>{wineOrder.wineName}</td>
      <td>{wineOrder.wineQuantity}</td>
      <td>${Number(wineOrder.price).toFixed(2)}</td>
      <td>
        <button onClick={() => handleEdit(wineOrder)}>Edit</button>
        <button onClick={() => handleDelete(wineOrder.winesOrdersID)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

function WinesOrders(url) {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wines, setWines] = useState([]);

  const [editingWine, setEditingWine] = useState(null);
  const [formData, setFormData] = useState({
    wineID: "",
    wineQuantity: "",
    price: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWine, setNewWine] = useState({
    orderID: "",
    wineID: "",
    wineQuantity: "",
    price: "",
  });

  // Fetch full lists
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [woRes, ordersRes, winesRes] = await Promise.all([
          fetch(url.url + ":35827/winesorders"),
          fetch(url.url + ":35827/orders"),
          fetch(url.url + ":35827/wines"),
        ]);

        const wineOrdersData = await woRes.json();
        const ordersData = await ordersRes.json();
        const winesData = await winesRes.json();

        setData(wineOrdersData);
        setOrders(ordersData);
        setWines(winesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAll();
  }, [url.url]);

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    await fetch(url.url + `:35827/winesorders/${id}`, { method: "DELETE" });

    setData((prev) =>
      prev.filter((wineOrder) => wineOrder.winesOrdersID !== id)
    );
  };

  // Edit
  const handleEdit = (wineOrder) => {
    setEditingWine(wineOrder);

    setFormData({
      wineID: wineOrder.wineID,
      wineQuantity: wineOrder.wineQuantity,
      price: wineOrder.price,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    await fetch(url.url + `:35827/winesorders/${editingWine.winesOrdersID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setData((prev) =>
      prev.map((wo) =>
        wo.winesOrdersID === editingWine.winesOrdersID
          ? { ...wo, ...formData }
          : wo
      )
    );

    setEditingWine(null);
  };

  // Add new wine to order
  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/winesorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWine),
      });

      if (!response.ok)
        throw new Error(`Error adding wine to order: ${response.status}`);

      const added = await response.json();

      setData((prev) => [...prev, added]);
      setShowAddForm(false);

      setNewWine({
        orderID: "",
        wineID: "",
        wineQuantity: "",
        price: "",
      });
    } catch (error) {
      console.error(error);
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

      <button onClick={() => setShowAddForm(true)}>
        Add Wine to Existing Order
      </button>

      {showAddForm && (
        <div className="form">
          <label>Order ID:</label>
          <select
            value={newWine.orderID}
            onChange={(e) =>
              setNewWine({ ...newWine, orderID: e.target.value })
            }
          >
            <option value="">Select Order</option>
            {orders.map((o) => (
              <option key={o.orderID} value={o.orderID}>
                {o.orderID} — {o.memberName}
              </option>
            ))}
          </select>

          <label>Wine:</label>
          <select
            value={newWine.wineID}
            onChange={(e) =>
              setNewWine({ ...newWine, wineID: e.target.value })
            }
          >
            <option value="">Select Wine</option>
            {wines.map((w) => (
              <option key={w.wineID} value={w.wineID}>
                {w.wineName}
              </option>
            ))}
          </select>

          <label>Quantity:</label>
          <input
            name="wineQuantity"
            value={newWine.wineQuantity}
            onChange={(e) =>
              setNewWine({ ...newWine, wineQuantity: e.target.value })
            }
          />

          <label>Price:</label>
          <input
            name="price"
            value={newWine.price}
            onChange={(e) =>
              setNewWine({ ...newWine, price: e.target.value })
            }
          />

          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {editingWine && (
        <div className="form">
          <h3>Edit Wine in Order #{editingWine.winesOrdersID}</h3>

          <label>Wine:</label>
          <select
            name="wineID"
            value={formData.wineID}
            onChange={handleChange}
          >
            <option value="">Select Wine</option>
            {wines.map((w) => (
              <option key={w.wineID} value={w.wineID}>
                {w.wineName}
              </option>
            ))}
          </select>

          <label>Quantity:</label>
          <input
            name="wineQuantity"
            value={formData.wineQuantity}
            onChange={handleChange}
          />

          <label>Price:</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingWine(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default WinesOrders;
