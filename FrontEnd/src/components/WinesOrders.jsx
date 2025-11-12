import React, { useState, useEffect } from 'react';
import '../App.css'


function WineOrderItem({ wineOrder, handleDelete, handleEdit}) {
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
  )
}

function WinesOrders(url) {
  const [data, setData] = useState([]);
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


  useEffect(() => {
    const fetchWinesOrders = async () => {
      try {
      const response = await fetch(url.url + ":35827/winesorders", {
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

    await fetch(url.url + `:35827/winesorders/${id}`, { method: "DELETE" });
    console.log(data.filter(wineOrder => wineOrder.winesOrdersID !== id));
    setData(data.filter(wineOrder => wineOrder.winesOrdersID !== id));
  };

  // Edit handler
  const handleEdit = (wineOrder) => {
    setEditingWine(wineOrder);
    setFormData({
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
    await fetch(url.url + `:35827/winesorders/${editingWine.winesOrdersID}`, {
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
      const response = await fetch(url.url + ":35827/winesorders", {
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
              <WineOrderItem key={wineOrder.winesOrdersID} wineOrder={wineOrder} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowAddForm(true)}>Add Wine to Existing Order</button>
        {showAddForm && (
          <div className='form'>
            <div>
            <label htmlFor="orderID">Order ID: </label>
              <select defaultValue="Order ID" id="dropdown" name="orderID" onChange={(e) => setNewWine({ ...newWine, orderID: e.target.value })}>
                 <option disabled>Order ID</option>
                 {data.map((wineOrder) => (<option key={wineOrder.orderID} value={wineOrder.orderID}>{wineOrder.orderID}</option>))}
              </select>
            <br></br>
            <label htmlFor="wineName">Wine Name: </label>
              <select defaultValue="Wine Name" id="dropdown" name="wineName" onChange={(e) => setNewWine({ ...newWine, wineID: e.target.value })}>
                 <option disabled>Wine Name</option>
                 {data.map((wineOrder) => (<option key={wineOrder.wineID} value={wineOrder.wineID}>{wineOrder.wineName}</option>))}
              </select>
              <br></br>
              <label htmlFor="wineQuantity">Wine Quantity: </label>
              <input
                name="wineQuantity"
                value={newWine.wineQuantity}
                onChange={(e) => setNewWine({ ...newWine, wineQuantity: e.target.value })}
                placeholder="Quantity"
              />
              <br></br>
              <label htmlFor="price">Price: </label>
              <input
                name="price"
                value={newWine.price}
                onChange={(e) => setNewWine({ ...newWine, price: e.target.value })}
                placeholder="Price"
              />
              <br></br>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingWine && (
          <div className='form'>
            <h3>Edit Wine in Order: {editingWine.winesOrdersID}</h3>
            <label htmlFor="wineID">Wine Name: </label>
            <select id="dropdown" name="wineID" value={formData.wineID} onChange={handleChange}>
              <option disabled value="">Select Wine</option>
              {data.map((wineOrder) => (<option key={wineOrder.wineID} value={wineOrder.wineID}>{wineOrder.wineName}</option>))}
            </select>
            <br></br>
            <label htmlFor="wineQuantity">Wine Quantity: </label>
            <input
              name="wineQuantity"
              value={formData.wineQuantity}
              onChange={handleChange}
              placeholder="Quantity"
            />
            <br></br>
            <label htmlFor="price">Price: </label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <br></br>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingWine(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}


export default WinesOrders

