import React, { useState, useEffect } from 'react';
import '../App.css'


function WinesOrders() {
  const [data, setData] = useState([]);
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
    price: "",
  });


  useEffect(() => {
    const fetchWinesOrders = async () => {
      try {
      const response = await fetch("http://localhost:35827/winesorders", {
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

    fetchWinesOrders();
  }, []); 

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:35827/winesorders/${id}`, { method: "DELETE" });
    console.log(data.filter(wineOrder => wineOrder.winesOrdersID !== id));
    setData(data.filter(wineOrder => wineOrder.winesOrdersID !== id));
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

// Update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    await fetch(`http://localhost:35827/winesorders/${editingWine.winesOrdersID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setData((prev) =>
      prev.map((wineOrder) =>
        wineOrder.winesOrdersID === editingWine.winesOrdersID ? { ...wineOrder, ...formData } : wineOrder
      )
    );
    setEditingWine(null);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:35827/winesorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWine),
      });

      if (!response.ok) throw new Error(`Error adding wine to order: ${response.status}`);

      const addedWine = await response.json();

      // Update table instantly
      setData((prev) => [...prev, addedWine]);
      setShowAddForm(false);

      // Reset form
      setNewWine({
        orderID: "",
        wineID: "",
        wineQuantity: "",
        price: "",
      });
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
              <th>Wine ID</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            {data.map((wineOrder) => (
              <WineOrderItem key={wineOrder.winesOrdersID} wineOrder={wineOrder} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowAddForm(true)}>Add New Wine to Order</button>
        {showAddForm && (
          <div>
            <h3>Add New Wine to Order</h3>
            <div>
              <input
                name="orderID"
                value={newWine.orderID}
                onChange={(e) => setNewWine({ ...newWine, orderID: e.target.value })}
                placeholder="Order ID"
              />
              <input
                name="wineID"
                value={newWine.wineID}
                onChange={(e) => setNewWine({ ...newWine, wineID: e.target.value })}
                placeholder="Wine ID"
              />
              <input
                name="wineQuantity"
                value={newWine.wineQuantity}
                onChange={(e) => setNewWine({ ...newWine, wineQuantity: e.target.value })}
                placeholder="Quantity"
              />
              <input
                name="price"
                value={newWine.price}
                onChange={(e) => setNewWine({ ...newWine, price: e.target.value })}
                placeholder="Price"
              />

              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingWine && (
          <div>
            <h3>Edit Wine in Order: {editingWine.winesOrdersID}</h3>
            <input
              name="orderID"
              value={formData.orderID}
              onChange={handleChange}
              placeholder="Order ID"
            />
            <input
              name="wineID"
              value={formData.wineID}
              onChange={handleChange}
              placeholder="Wine ID"
            />
            <input
              name="wineQuantity"
              value={formData.wineQuantity}
              onChange={handleChange}
              placeholder="Quantity"
            />
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />

            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingWine(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

function WineOrderItem({ wineOrder, handleDelete, handleEdit}) {
  return (
    <tr>
    <td>{wineOrder.winesOrdersID}</td>
    <td>{wineOrder.orderID}</td>
    <td>{wineOrder.wineID}</td>
    <td>{wineOrder.wineQuantity}</td>
    <td>${wineOrder.price}</td>
    <td>
      <button onClick={() => handleEdit(wineOrder)}>Edit</button>
      <button onClick={() => handleDelete(wineOrder.winesOrdersID)}>Delete</button>
    </td>
    </tr>
  )
}

export default WinesOrders

