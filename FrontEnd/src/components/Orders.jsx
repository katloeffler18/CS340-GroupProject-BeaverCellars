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

  useEffect(() => {
    fetchOrders();
    fetchMembers();
    fetchCards();
  }, [url]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${url}:35827/orders`);
      const result = await res.json();
      setOrders(result);
    } catch (err) { console.error(err); }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${url}:35827/members`);
      const result = await res.json();
      setMembers(result);
    } catch (err) { console.error(err); }
  };

  const fetchCards = async () => {
    try {
      const res = await fetch(`${url}:35827/creditcards`);
      const result = await res.json();
      setCards(result);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await fetch(`${url}:35827/orders/${id}`, { method: "DELETE" });
    setOrders(prev => prev.filter(o => o.orderID !== id));
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ hasShipped: order.hasShipped ? "1" : "0" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      const response = await fetch(`${url}:35827/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      const addedOrder = await response.json();

      // Immediately merge memberName and cardName
      const member = members.find(m => m.memberID === addedOrder.memberID);
      const card = cards.find(c => c.cardID === addedOrder.cardID);
      addedOrder.memberName = member?.memberName || "";
      addedOrder.cardName = card?.cardName || "";

      setOrders(prev => [...prev, addedOrder]);
      setShowAddForm(false);
      setNewOrder({ memberID: "", cardID: "", orderDate: "", orderPrice: "", hasShipped: "" });
    } catch (err) { console.error(err); }
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
            <th>Price</th>
            <th>Shipped</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <OrderItem key={order.orderID} order={order} handleDelete={handleDelete} handleEdit={handleEdit} />
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddForm(true)}>Add Order</button>

      {showAddForm && (
        <div className="form">
          <label>Member: </label>
          <select value={newOrder.memberID} onChange={e => setNewOrder({ ...newOrder, memberID: e.target.value })}>
            <option value="">Select Member</option>
            {members.map(m => <option key={m.memberID} value={m.memberID}>{m.memberName}</option>)}
          </select>
          <br />
          <label>Card: </label>
          <select value={newOrder.cardID} onChange={e => setNewOrder({ ...newOrder, cardID: e.target.value })}>
            <option value="">Select Card</option>
            {cards.filter(c => c.memberID === newOrder.memberID).map(c => (
              <option key={c.cardID} value={c.cardID}>{c.cardName}</option>
            ))}
          </select>
          <br />
          <label>Order Date: </label>
          <input type="date" value={newOrder.orderDate} onChange={e => setNewOrder({ ...newOrder, orderDate: e.target.value })} />
          <br />
          <label>Price: </label>
          <input type="number" value={newOrder.orderPrice} onChange={e => setNewOrder({ ...newOrder, orderPrice: e.target.value })} />
          <br />
          <label>Shipped: </label>
          <select value={newOrder.hasShipped} onChange={e => setNewOrder({ ...newOrder, hasShipped: e.target.value })}>
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
          <label>Shipped: </label>
          <select name="hasShipped" value={formData.hasShipped} onChange={handleChange}>
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
