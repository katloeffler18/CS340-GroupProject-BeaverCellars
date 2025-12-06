/*
# Orders Component
# Date: 11/30/2025, Updated 12/4/2025
# Citation for use of AI Tools:
  # Prompt: Implement add/edit/delete functionality and add validation for add form
  # AI Source URL: https://chatgpt.com/
*/

import React, { useState, useEffect } from 'react';
import '../App.css';

function OrderItem({ order, handleDelete, handleEdit }) {
  return (
    <tr>
      <td>{order.orderID}</td>
      <td>{order.memberID}</td>
      <td>{order.memberName}</td>
      <td>{order.cardID}</td>
      <td>{order.cardName}</td>
      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
      <td>${order.orderPrice}</td>
      <td>{order.hasShipped ? "Yes" : "No"}</td>
      <td>
        <button onClick={() => handleEdit(order)}>Edit</button>
        <button onClick={() => handleDelete(order.orderID)}>Delete</button>
      </td>
    </tr>
  );
}

function Orders(url) {
  const [data, setData] = useState([]);       // orders
  const [members, setMembers] = useState([]); // members table
  const [cards, setCards] = useState([]);     // credit cards table

  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ hasShipped: "" });

  // ADD FORM STATE
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    memberID: "",
    cardID: "",
    orderDate: "",
    hasShipped: "",
  });

  const [errors, setErrors] = useState({}); // <-- NEW

  // Load orders, members, and credit cards
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, membersRes, cardsRes] = await Promise.all([
          fetch(url.url + ":35827/orders"),
          fetch(url.url + ":35827/members"),
          fetch(url.url + ":35827/creditcards")
        ]);

        const [ordersData, membersData, cardsData] = await Promise.all([
          ordersRes.json(),
          membersRes.json(),
          cardsRes.json()
        ]);

        setData(ordersData);
        setMembers(membersData);
        setCards(cardsData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await fetch(url.url + `:35827/orders/${id}`, { method: "DELETE" });
    setData(data.filter(o => o.orderID !== id));
  };

  // Edit order
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      hasShipped: order.hasShipped ? "1" : "0",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const updatedData = {
      hasShipped: formData.hasShipped === "1"
    };

    await fetch(url.url + `:35827/orders/${editingOrder.orderID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });

    setData(prev =>
      prev.map(o =>
        o.orderID === editingOrder.orderID
          ? { ...o, hasShipped: updatedData.hasShipped }
          : o
      )
    );

    setEditingOrder(null);
  };

  // -------------------------
  //   VALIDATION FOR ADD FORM
  // -------------------------
  const validateOrderForm = (order) => {
    let errors = {};

    if (!order.memberID) errors.memberID = "Member is required.";
    if (!order.cardID) errors.cardID = "Credit card is required.";
    if (!order.orderDate) errors.orderDate = "Order date is required.";
    if (order.hasShipped !== "1" && order.hasShipped !== "0")
      errors.hasShipped = "Shipping status is required.";

    return errors;
  };

  // -------------------------
  //      ADD ORDER SUBMIT
  // -------------------------
  const handleAdd = async () => {
    const validationErrors = validateOrderForm(newOrder);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear errors when valid

    try {
      const payload = {
        memberID: Number(newOrder.memberID),
        cardID: Number(newOrder.cardID),
        orderDate: newOrder.orderDate,
        orderPrice: 0,
        hasShipped: newOrder.hasShipped === "1"
      };

      const response = await fetch(url.url + ":35827/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const added = await response.json();

      // Attach memberName and cardName
      const selectedMember = members.find(m => m.memberID === Number(newOrder.memberID));
      const selectedCard = cards.find(c => c.cardID === Number(newOrder.cardID));
      added.memberName = selectedMember ? selectedMember.memberName : "";
      added.cardName = selectedCard ? selectedCard.cardName : "";

      setData(prev => [...prev, added]);
      setShowAddForm(false);

      setNewOrder({ memberID: "", cardID: "", orderDate: "", hasShipped: "" });

    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  return (
    <>
      <table>
        <caption>Orders</caption>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Member ID</th>
            <th>Member Name</th>
            <th>Card ID</th>
            <th>Card Name</th>
            <th>Order Date</th>
            <th>Order Price</th>
            <th>Shipped</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(order => (
            <OrderItem
              key={order.orderID}
              order={order}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      {/* Add new order */}
      <button onClick={() => { setShowAddForm(true); setErrors({}); }}>
        Add New Order
      </button>

      {showAddForm && (
        <div className="form">
          <label>Member:</label>
          <select
            value={newOrder.memberID}
            onChange={e => {
              setNewOrder({ ...newOrder, memberID: e.target.value });
              setErrors({ ...errors, memberID: "" });
            }}
          >
            <option value="">Select Member</option>
            {members.map(m => (
              <option key={m.memberID} value={m.memberID}>{m.memberName}</option>
            ))}
          </select>
          {errors.memberID && <p className="error">{errors.memberID}</p>}

          <label>Card:</label>
          <select
            value={newOrder.cardID}
            onChange={e => {
              setNewOrder({ ...newOrder, cardID: e.target.value });
              setErrors({ ...errors, cardID: "" });
            }}
          >
            <option value="">Select Card</option>
            {cards.map(c => (
              <option key={c.cardID} value={c.cardID}>{c.cardName}</option>
            ))}
          </select>
          {errors.cardID && <p className="error">{errors.cardID}</p>}

          <label>Order Date:</label>
          <input
            type="date"
            value={newOrder.orderDate}
            onChange={e => {
              setNewOrder({ ...newOrder, orderDate: e.target.value });
              setErrors({ ...errors, orderDate: "" });
            }}
          />
          {errors.orderDate && <p className="error">{errors.orderDate}</p>}

          <label>Shipped:</label>
          <select
            value={newOrder.hasShipped}
            onChange={e => {
              setNewOrder({ ...newOrder, hasShipped: e.target.value });
              setErrors({ ...errors, hasShipped: "" });
            }}
          >
            <option value="">Select Status</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          {errors.hasShipped && <p className="error">{errors.hasShipped}</p>}

          <br />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => { setShowAddForm(false); setErrors({}); }}>
            Cancel
          </button>
        </div>
      )}

      {/* Edit shipped status */}
      {editingOrder && (
        <div className="form">
          <h3>Edit Shipping Status: {editingOrder.orderID}</h3>
          <label>Shipped:</label>
          <select
            name="hasShipped"
            value={formData.hasShipped}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingOrder(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default Orders;
