/*
# CreditCards Component
# Date: 11/19/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete buttons
  # AI Source URL: https://chatgpt.com/ 
*/

import React, { useState, useEffect } from 'react';
import '../App.css'

// Table row for a single credit card
function CreditCardItem({ creditCard, handleDelete, handleEdit }) {
  return (
    <tr>
      <td>{creditCard.cardID}</td>
      <td>{creditCard.memberID}</td>
      <td>{creditCard.memberName}</td>
      <td>{creditCard.cardName}</td>
      <td>{creditCard.cardNumber}</td>
      <td>{new Date(creditCard.cardExpirationDate).toLocaleDateString()}</td>
      <td>{creditCard.billingZipCode}</td>
      <td>
        <button onClick={() => handleEdit(creditCard)}>Edit</button>
        <button onClick={() => handleDelete(creditCard.cardID)}>Delete</button>
      </td>
    </tr>
  )
}

function CreditCards(url) {
  const [data, setData] = useState([]);
  const [editingCreditCard, setEditingCreditCard] = useState(null);
  const [formData, setFormData] = useState({
    memberID: "", cardName: "", cardNumber: "", cardExpirationDate: "", billingZipCode: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCreditCard, setNewCreditCard] = useState({
    memberID: "", cardName: "", cardNumber: "", cardExpirationDate: "", billingZipCode: "",
  });

  // Fetch credit cards from backend
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(url.url + ":35827/creditcards", { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCards();
  }, []);

  // Delete a credit card
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await fetch(url.url + `:35827/creditcards/${id}`, { method: "DELETE" });
    setData(data.filter(creditCard => creditCard.cardID !== id));
  };

  // Start editing a credit card
  const handleEdit = (creditCard) => {
    setEditingCreditCard(creditCard);
    setFormData({ ...creditCard });
  };

  // Update form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit credit card update
  const handleUpdate = async () => {
    await fetch(url.url + `:35827/creditcards/${editingCreditCard.cardID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setData(prev => prev.map(cc => cc.cardID === editingCreditCard.cardID ? { ...cc, ...formData } : cc));
    setEditingCreditCard(null);
  };

  // Add new credit card
  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/creditcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCreditCard),
      });
      if (!response.ok) throw new Error(`Error adding credit card: ${response.status}`);
      const addedCreditCard = await response.json();
      setData(prev => [...prev, addedCreditCard]);
      setShowAddForm(false);
      setNewCreditCard({ memberID: "", cardName: "", cardNumber: "", cardExpirationDate: "", billingZipCode: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <table>
        <caption>Credit Cards</caption>
        <thead>
          <tr>
            <th>Card ID</th>
            <th>Member ID</th>
            <th>Member Name</th>
            <th>Name on Card</th>
            <th>Card Number</th>
            <th>Expiration Date</th>
            <th>Billing Zip Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((creditCard) => (
            <CreditCardItem key={creditCard.cardID} creditCard={creditCard} handleDelete={handleDelete} handleEdit={handleEdit} />
          ))}
        </tbody>
      </table>

      {/* Add new credit card form */}
      <button onClick={() => setShowAddForm(true)}>Add New Credit Card</button>
      {showAddForm && (
        <div className='form'>
          <label>Member Name:</label>
          <select defaultValue="Member Name" onChange={(e) => setNewCreditCard({ ...newCreditCard, memberID: e.target.value })}>
            <option disabled>Member Name</option>
            {data.map((cc) => (<option key={cc.memberID} value={cc.memberID}>{cc.memberName}</option>))}
          </select>

          <label>Name on Card:</label>
          <input name="cardName" value={newCreditCard.cardName} onChange={(e) => setNewCreditCard({ ...newCreditCard, cardName: e.target.value })} placeholder="Name on Card" />

          <label>Card Number:</label>
          <input name="cardNumber" value={newCreditCard.cardNumber} onChange={(e) => setNewCreditCard({ ...newCreditCard, cardNumber: e.target.value })} placeholder="Card Number" />

          <label>Expiration Date:</label>
          <input name="cardExpirationDate" value={newCreditCard.cardExpirationDate} onChange={(e) => setNewCreditCard({ ...newCreditCard, cardExpirationDate: e.target.value })} placeholder="Expiration Date" />

          <label>Zip Code:</label>
          <input name="billingZipCode" value={newCreditCard.billingZipCode} onChange={(e) => setNewCreditCard({ ...newCreditCard, billingZipCode: e.target.value })} placeholder="Billing Zip Code" />

          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={handleAdd}>Save</button>
            <button onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit credit card form */}
      {editingCreditCard && (
        <div className='form'>
          <h3>Edit Credit Card: {editingCreditCard.cardID}</h3>
          <label>Name on Card:</label>
          <input name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Card Name" />
          <label>Card Number:</label>
          <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card Number" />
          <label>Expiration Date:</label>
          <input name="cardExpirationDate" value={formData.cardExpirationDate} onChange={handleChange} placeholder="Expiration Date" />
          <label>Zip Code:</label>
          <input name="billingZipCode" value={formData.billingZipCode} onChange={handleChange} placeholder="Billing Zip Code" />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingCreditCard(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default CreditCards;
