/*
# Orders Component
# Date: 11/19/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete buttons and fix dropdown/data binding
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
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);
  const [cards, setCards] = useState([]);

  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ hasShipped: "" });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    memberID: "",
    cardID: "",
    orderDate: "",
    orderPrice: "",
    hasShipped: "",
  });

  // Fetch orders, members, credit cards
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, membersRes, cardsRes] = await Promise.all([
          fetch(url.url + ":35827/orders"),
          fetch(url.url + ":35827/members"),
          fetch(url.url + ":35827/creditcards")
        ]);

        const ordersData = await ordersRes.json();
        const membersData = await membersRes.json();
        const cardsData = await cardsRes.json();

        setOrders(ordersData);
        setMembers(membersData);
        setCards(cardsData);

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAll();
  }, [url.url]);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    await fetch(url.url + `:35827/orders/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o.orderID !== id));
  };

  // Edit shipping status
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ hasShipped: order.hasShipped ? "1" : "0" });
  };

  const handleChange = (e) => {
    setFormData({ hasShipped: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(url.url + `:35827/orders/${editingOrder.orderID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hasShipped: Number(formData.hasShipped) }),
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.orderID === editingOrder.orderID
          ? { ...o, hasShipped: Number(formData.hasShipped) }
          : o
      )
    );
    setEditingOrder(null);
  };

  // Add
  const handleAdd = async () => {
    const payload = {
      memberID: newOrder.memberID,
      cardID: newOrder.cardID,
      orderDate: newOrder.orderDate,
      orderPrice: newOrder.orderPrice,
      hasShipped: Number(newOrder.hasShipped)
    };

    try {
      const response = await fetch(url.url + ":35827/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const added = await response.json();

      // Join the returned row with names for display
      const member = members.find(m => m.memberID == added.memberID);
      const card = cards.find(c => c.cardID == added.cardID);

      const enriched = {
        ...added,
        memberName: member ? member.memberName : "",
        cardName: card ? card.cardName : ""
      };

      setOrders((prev) => [...prev, enriched]);

      setShowAddForm(false);
      setNewOrder({ memberID: "", cardID: "", orderDate: "", orderPrice: "", hasShipped: "" });

    } catch (err) {
      console.error(err);
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
            <th>Name on Card</th>
            <th>Order Date</th>
            <th>Order Price</th>
            <th>Shipped</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderItem
              key={order.orderID}
              order={order}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddForm(true)}>Add New Order</button>

      {showAddForm && (
        <div className="form">
          <label>Member Name:</label>
          <select
            value={newOrder.memberID}
            onChange={(e) => setNewOrder({ ...newOrder, memberID: e.target.value })}
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.memberID} value={m.memberID}>
                {m.memberName}
              </option>
            ))}
          </select>

          <label>Card Name:</label>
          <select
            value={newOrder.cardID}
            onChange={(e) => setNewOrder({ ...newOrder, cardID: e.target.value })}
          >
            <option value="">Select Card</option>
            {cards.map((c) => (
              <option key={c.cardID} value={c.cardID}>
                {c.cardName}
              </option>
            ))}
          </select>

          <label>Order Date:</label>
          <input
            type="date"
            value={newOrder.orderDate}
            onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
          />

          <label>Order Price:</label>
          <input
            type="number"
            value={newOrder.orderPrice}
            onChange={(e) => setNewOrder({ ...newOrder, orderPrice: e.target.value })}
          />

          <label>Shipped:</label>
          <select
            value={newOrder.hasShipped}
            onChange={(e) => setNewOrder({ ...newOrder, hasShipped: e.target.value })}
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {editingOrder && (
        <div className="form">
          <h3>Edit Order Shipping Status: {editingOrder.orderID}</h3>

          <label>Shipped:</label>
          <select value={formData.hasShipped} onChange={handleChange}>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingOrder(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default Orders;
