/*
# Orders Component
# Date: 11/30/2025
# Citation for use of AI Tools:
  # Prompt: Fix add/edit to populate names immediately and format booleans/dates
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

function Orders({ url }) {
  const [data, setData] = useState([]);
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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${url}:35827/orders`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [url]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    await fetch(`${url}:35827/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ hasShipped: order.hasShipped ? "1" : "0" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(`${url}:35827/orders/${editingOrder.orderID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hasShipped: formData.hasShipped }),
    });
    setEditingOrder(null);
    fetchOrders();
  };

  const handleAdd = async () => {
    try {
      await fetch(`${url}:35827/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      setShowAddForm(false);
      setNewOrder({
        memberID: "",
        cardID: "",
        orderDate: "",
        orderPrice: "",
        hasShipped: "",
      });
      fetchOrders(); // Refetch to populate memberName and cardName
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
          {data.map((order) => (
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
          <h3>Add New Order</h3>
          <label>Member: </label>
          <select
            value={newOrder.memberID}
            onChange={(e) => setNewOrder({ ...newOrder, memberID: e.target.value })}
          >
            <option value="">Select Member</option>
            {data.map((order) => (
              <option key={order.memberID} value={order.memberID}>
                {order.memberName}
              </option>
            ))}
          </select>
          <br />
          <label>Card: </label>
          <select
            value={newOrder.cardID}
            onChange={(e) => setNewOrder({ ...newOrder, cardID: e.target.value })}
          >
            <option value="">Select Card</option>
            {data.map((order) => (
              <option key={order.cardID} value={order.cardID}>
                {order.cardName}
              </option>
            ))}
          </select>
          <br />
          <label>Order Date: </label>
          <input
            type="date"
            value={newOrder.orderDate}
            onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
          />
          <br />
          <label>Order Price: </label>
          <input
            type="number"
            value={newOrder.orderPrice}
            onChange={(e) => setNewOrder({ ...newOrder, orderPrice: e.target.value })}
          />
          <br />
          <label>Shipped: </label>
          <select
            value={newOrder.hasShipped}
            onChange={(e) => setNewOrder({ ...newOrder, hasShipped: e.target.value })}
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          <br />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {editingOrder && (
        <div className="form">
          <h3>Edit Shipping Status: {editingOrder.orderID}</h3>
          <label>Shipped: </label>
          <select
            name="hasShipped"
            value={formData.hasShipped}
            onChange={handleChange}
          >
            <option value="">Select</option>
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
