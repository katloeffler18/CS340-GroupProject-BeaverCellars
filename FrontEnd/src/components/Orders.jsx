import React, { useState, useEffect } from 'react';
import '../App.css'

function OrderItem({ order, handleDelete, handleEdit }) {
  return (
    <tr>
    <td>{order.orderID}</td>
    <td>{order.memberID}</td>
    <td>{order.cardID}</td>
    <td>{order.orderDate}</td>
    <td>{order.orderPrice}</td>
    <td>{order.hasShipped}</td>
    <td>
      <button onClick={() => handleEdit(order)}>Edit</button>
      <button onClick={() => handleDelete(order.orderID)}>Delete</button>
    </td>
    </tr>
  )
}

function Orders() {
  const [data, setData] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    memberID: "",
    cardID: "",
    orderDate: "",
    orderPrice: "",
    hasShipped: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    memberID: "",
    cardID: "",
    orderDate: "",
    orderPrice: "",
    hasShipped: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
      const response = await fetch("http://localhost:35827/orders", {
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

    fetchOrders();
  }, []); 

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:35827/orders/${id}`, { method: "DELETE" });
    console.log(data.filter(order => order.orderID !== id));
    setData(data.filter(order => order.orderID !== id));
  };

  // Edit handler
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      memberID: order.memberID,
      cardID: order.cardID,
      orderDate: order.orderDate,
      orderPrice: order.orderPrice,
      hasShipped: order.hasShipped,
    });
  };

// Update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    await fetch(`http://localhost:35827/orders/${editingOrder.orderID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setData((prev) =>
      prev.map((order) =>
        order.orderID === editingOrder.orderID ? { ...order, ...formData } : order
      )
    );
    setEditingOrder(null);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:35827/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error(`Error adding order: ${response.status}`);

      const addedOrder = await response.json();

      // Update table instantly
      setData((prev) => [...prev, addedOrder]);
      setShowAddForm(false);

      // Reset form
      setNewOrder({
        memberID: "",
        cardID: "",
        orderDate: "",
        orderPrice: "",
        hasShipped: "",
      });
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
              <th>Card ID</th>
              <th>Order Date</th>
              <th>Order Price</th>
              <th>Shipped</th>
              <th>Actions</th>              
              </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <OrderItem key={order.orderID} order={order} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowAddForm(true)}>Add New Order</button>
        {showAddForm && (
          <div>
            <h3>Add New Order</h3>
            <div>
              <input
                name="memberID"
                value={newOrder.memberID}
                onChange={(e) => setNewOrder({ ...newOrder, memberID: e.target.value })}
                placeholder="Member ID"
              />
              <input
                name="cardID"
                value={newOrder.cardID}
                onChange={(e) => setNewOrder({ ...newOrder, cardID: e.target.value })}
                placeholder="Card ID"
              />
              <input
                name="orderDate"
                value={newOrder.orderDate}
                onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
                placeholder="Date"
              />
              <input
                name="orderPrice"
                value={newOrder.orderPrice}
                onChange={(e) => setNewOrder({ ...newOrder, orderPrice: e.target.value })}
                placeholder="Price"
              />
              <input
                name="hasShipped"
                value={newOrder.hasShipped}
                onChange={(e) => setNewOrder({ ...newOrder, hasShipped: e.target.value })}
                placeholder="Shipped"
              />
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingOrder && (
          <div>
            <h3>Edit Order: {editingOrder.orderID}</h3>
            <input
              name="memberID"
              value={formData.memberID}
              onChange={handleChange}
              placeholder="Member ID"
            />
            <input
              name="cardID"
              value={formData.cardID}
              onChange={handleChange}
              placeholder="Card ID"
            />
            <input
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              placeholder="Date"
            />
            <input
              name="orderPrice"
              value={formData.orderPrice}
              onChange={handleChange}
              placeholder="Price"
            />
            <input
              name="hasShipped"
              value={formData.hasShipped}
              onChange={handleChange}
              placeholder="Shipped"
            />          
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingOrder(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default Orders

