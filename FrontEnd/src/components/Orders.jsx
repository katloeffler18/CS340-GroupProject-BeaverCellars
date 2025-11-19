import React, { useState, useEffect } from 'react';
import '../App.css'

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
      <td>{order.hasShipped}</td>
      <td>
        <button onClick={() => handleEdit(order)}>Edit</button>
        <button onClick={() => handleDelete(order.orderID)}>Delete</button>
      </td>
    </tr>
  );
}

function Orders(url) {
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(url.url + ":35827/orders", {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOrders();
  }, [url.url]);

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(url.url + `:35827/orders/${id}`, { method: "DELETE" });
    setData(data.filter(order => order.orderID !== id));
  };

  // Edit handler (only hasShipped)
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ hasShipped: order.hasShipped });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, hasShipped: e.target.value });
  };

  // Submit edit (only updates hasShipped)
  const handleUpdate = async () => {
    await fetch(url.url + `:35827/orders/${editingOrder.orderID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hasShipped: formData.hasShipped }),
    });

    setData((prev) =>
      prev.map((order) =>
        order.orderID === editingOrder.orderID
          ? { ...order, hasShipped: formData.hasShipped }
          : order
      )
    );
    setEditingOrder(null);
  };

  // Add handler (unchanged)
  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error(`Error adding order: ${response.status}`);

      const addedOrder = await response.json();
      setData((prev) => [...prev, addedOrder]);
      setShowAddForm(false);

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
        <div>
          <div>
            <label htmlFor="memberID">Member Name: </label>
            <select defaultValue="Member Name" id="dropdown" name="memberName" onChange={(e) => setNewOrder({ ...newOrder, memberID: e.target.value })}>
              <option disabled>Member Name</option>
              {data.map((order) => (<option key={order.memberID} value={order.memberID}>{order.memberName}</option>))}
            </select>

            <br></br>
            <label htmlFor="cardID">Name on Card: </label>
              <select defaultValue="Name on Card" id="dropdown" name="cardName" onChange={(e) => setNewOrder({ ...newOrder, cardID: e.target.value })}>
                <option disabled>Name on Card</option>
                {data.map((order) => (<option key={order.cardID} value={order.cardID}>{order.cardName}</option>))}
            </select>
            
            <br></br>
            <label htmlFor="orderDate">Order Date: </label>            
            <input
              name="orderDate"
              value={newOrder.orderDate}
              onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
              placeholder="Date"
            />
            <br></br>
            <label htmlFor="orderPrice">Order Price: </label> 
            <input
              name="orderPrice"
              value={newOrder.orderPrice}
              onChange={(e) => setNewOrder({ ...newOrder, orderPrice: e.target.value })}
              placeholder="Price"
            />
            <br></br>
            <label htmlFor="hasShipped">Shipping Status: </label> 
            <select
              name="hasShipped"
              value={newOrder.hasShipped}
              onChange={(e) => setNewOrder({ ...newOrder, hasShipped: e.target.value })}
            >
              <option value="">Select Shipped Status</option>
              <option value="TRUE">True</option>
              <option value="FALSE">False</option>
            </select>
            <br></br>
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={handleAdd}>Save</button>
              <button onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <div>
          <h3>Edit Order Shipping Status: {editingOrder.orderID}</h3>
           <label htmlFor="hasShipped">Shipped: </label>
          <select
            name="hasShipped"
            value={formData.hasShipped}
            onChange={handleChange}
          >
            <option value="">Select Shipped Status</option>
              <option value="TRUE">True</option>
              <option value="FALSE">False</option>
          </select>
          <br></br>
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingOrder(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
