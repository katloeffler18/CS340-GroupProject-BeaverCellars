/*
# WinesOrders Component
# Date: 11/30/2025
# Citation for use of AI Tools:
  # Prompt: Implement add/edit/delete functionality and add validation for both add/edit forms
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
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wines, setWines] = useState([]);

  const [editingWine, setEditingWine] = useState(null);

  const [formData, setFormData] = useState({
    orderID: "",
    wineID: "",
    wineQuantity: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWine, setNewWine] = useState({
    orderID: "",
    wineID: "",
    wineQuantity: "",
  });

  const [errors, setErrors] = useState({}); // shared for add + edit

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
    setErrors({});
    setEditingWine(wineOrder);
    setFormData({
      orderID: wineOrder.orderID,
      wineID: wineOrder.wineID,
      wineQuantity: wineOrder.wineQuantity,
    });
  };

  // Handle edit change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // clear individual error
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // Validation (shared)
  const validate = (wo) => {
    let errs = {};

    if (!wo.orderID) errs.orderID = "Order is required.";
    if (!wo.wineID) errs.wineID = "Wine is required.";

    if (!wo.wineQuantity) {
      errs.wineQuantity = "Quantity is required.";
    } else if (isNaN(wo.wineQuantity) || Number(wo.wineQuantity) <= 0) {
      errs.wineQuantity = "Quantity must be a number greater than 0.";
    }

    return errs;
  };

  // Submit edit update
  const handleUpdate = async () => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      orderID: Number(formData.orderID),
      wineID: Number(formData.wineID),
      wineQuantity: Number(formData.wineQuantity),
    };
    
    await fetch(url.url + `:35827/winesorders/${editingWine.winesOrdersID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    woRes = await fetch(url.url + ":35827/winesorders");
    woData = await woRes.json();
    setData(woData);
    // const selectedOrder = orders.find(o => o.orderID === Number(formData.orderID));
    // const selectedWine = wines.find(w => w.wineID === Number(formData.wineID));
    
    // setData(prev =>
    //   prev.map(wo =>
    //     wo.winesOrdersID === editingWine.winesOrdersID
    //       ? {
    //           ...wo,
    //           ...formData,
    //           memberName: selectedOrder ? selectedOrder.memberName : "",
    //           wineName: selectedWine ? selectedWine.wineName : "",
    //         }
    //       : wo
    //   )
    // );

    setEditingWine(null);
  };

  // ADD wine order
  const handleAdd = async () => {
    const validationErrors = validate(newWine);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      orderID: Number(newWine.orderID),
      wineID: Number(newWine.wineID),
      wineQuantity: Number(newWine.wineQuantity),
    };

    try {
      const response = await fetch(url.url + ":35827/winesorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const added = await response.json();

      const selectedOrder = orders.find(o => o.orderID === payload.orderID);
      const selectedWine = wines.find(w => w.wineID === payload.wineID);

      added.memberName = selectedOrder ? selectedOrder.memberName : "";
      added.wineName = selectedWine ? selectedWine.wineName : "";

      setData(prev => [...prev, added]);
      setShowAddForm(false);

      setNewWine({ orderID: "", wineID: "", wineQuantity: "" });
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

      <button onClick={() => { setShowAddForm(true); setErrors({}); }}>
        Add Wine to Existing Order
      </button>

      {showAddForm && (
        <div className="form">
          <label>Order:</label>
          <select
            value={newWine.orderID}
            onChange={(e) => {
              setNewWine({ ...newWine, orderID: e.target.value });
              setErrors({ ...errors, orderID: "" });
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

          <label>Wine:</label>
          <select
            value={newWine.wineID}
            onChange={(e) => {
              setNewWine({ ...newWine, wineID: e.target.value });
              setErrors({ ...errors, wineID: "" });
            }}
          >
            <option value="">Select Wine</option>
            {wines.map(w => (
              <option key={w.wineID} value={w.wineID}>
                {w.wineName}
              </option>
            ))}
          </select>
          {errors.wineID && <p className="error">{errors.wineID}</p>}

          <label>Quantity:</label>
          <input
            name="wineQuantity"
            value={newWine.wineQuantity}
            onChange={(e) => {
              setNewWine({ ...newWine, wineQuantity: e.target.value });
              setErrors({ ...errors, wineQuantity: "" });
            }}
          />
          {errors.wineQuantity && <p className="error">{errors.wineQuantity}</p>}

          <br />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => { setShowAddForm(false); setErrors({}); }}>
            Cancel
          </button>
        </div>
      )}

      {editingWine && (
        <div className="form">
          <h3>Edit Wine in Order: {editingWine.winesOrdersID}</h3>

          <label>Order:</label>
          <select name="orderID" value={formData.orderID} onChange={handleChange}>
            <option value="">Select Order</option>
            {orders.map(o => (
              <option key={o.orderID} value={o.orderID}>
                {o.orderID} - {o.memberName}
              </option>
            ))}
          </select>
          {errors.orderID && <p className="error">{errors.orderID}</p>}

          <label>Wine:</label>
          <select name="wineID" value={formData.wineID} onChange={handleChange}>
            <option value="">Select Wine</option>
            {wines.map(w => (
              <option key={w.wineID} value={w.wineID}>
                {w.wineName}
              </option>
            ))}
          </select>
          {errors.wineID && <p className="error">{errors.wineID}</p>}

          <label>Quantity:</label>
          <input name="wineQuantity" value={formData.wineQuantity} onChange={handleChange} />
          {errors.wineQuantity && <p className="error">{errors.wineQuantity}</p>}

          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingWine(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default WinesOrders;
