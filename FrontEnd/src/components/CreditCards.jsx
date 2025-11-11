import React, { useState, useEffect } from 'react';
import '../App.css'

function CreditCardItem({ creditCard, handleDelete, handleEdit }) {
  return (
    <tr>
    <td>{creditCard.cardID}</td>
    <td>{creditCard.memberID}</td>
    <td>{creditCard.memberName}</td>
    <td>{creditCard.cardName}</td>
    <td>{creditCard.cardNumber}</td>
    <td>{creditCard.cardExpirationDate}</td>
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
    memberID: "",
    cardName: "",
    cardNumber: "",
    cardExpirationDate: "",
    billingZipCode: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCreditCard, setNewCreditCard] = useState({
    memberID: "",
    cardName: "",
    cardNumber: "",
    cardExpirationDate: "",
    billingZipCode: "",
  });

  useEffect(() => {
    const fetchCards = async () => {
      try {
      const response = await fetch(url.url + ":35827/creditcards", {
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

    fetchCards();
  }, []); 

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(url.url + `:35827/creditcards/${id}`, { method: "DELETE" });
    console.log(data.filter(creditCard => creditCard.cardID !== id));
    setData(data.filter(creditCard => creditCard.cardID !== id));
  };

  // Edit handler
  const handleEdit = (creditCard) => {
    setEditingCreditCard(creditCard);
    setFormData({
      cardID: creditCard.cardID,
      memberID: creditCard.memberID,
      cardName: creditCard.cardName,
      cardNumber: creditCard.cardNumber,
      cardExpirationDate: creditCard.cardExpirationDate,
      billingZipCode: creditCard.billingZipCode,
    });
  };

// Update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    await fetch(url.url + `:35827/creditcards/${editingCreditCard.cardID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setData((prev) =>
      prev.map((creditCard) =>
        creditCard.cardID === editingCreditCard.cardID ? { ...creditCard, ...formData } : creditCard
      )
    );
    setEditingCreditCard(null);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/creditcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCreditCard),
      });

      if (!response.ok) throw new Error(`Error adding credit card: ${response.status}`);

      const addedCreditCard = await response.json();

      // Update table instantly
      setData((prev) => [...prev, addedCreditCard]);
      setShowAddForm(false);

      // Reset form
      setNewCreditCard({
        memberID: "",
        cardName: "",
        cardNumber: "",
        cardExpirationDate: "",
        billingZipCode: "",
      });
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
              <CreditCardItem key={creditCard.cardID} creditCard={creditCard} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowAddForm(true)}>Add New Credit Card</button>
        {showAddForm && (
          <div>
            <h3>Add New Credit Card</h3>
            <div className='form'>
            <label for="memberName">Member Name: </label>
              <select defaultValue="Member Name" id="dropdown" name="memberName" onChange={(e) => setNewCreditCard({ ...newCreditCard, memberID: e.target.value })}>
                 <option disabled>Member Name</option>
                 {data.map((creditCard) => (<option key={creditCard.memberID} value={creditCard.memberID}>{creditCard.memberName}</option>))}
              </select>
              <br></br>
              <label for="cardName">Name on Card: </label>
              <input
                name="cardName"
                value={newCreditCard.cardcardNameID}
                onChange={(e) => setNewCreditCard({ ...newCreditCard, cardName: e.target.value })}
                placeholder="Name on Card"
              />
              <br></br>
              <label for="cardNumber">Card Number: </label>              
              <input
                name="cardNumber"
                value={newCreditCard.cardNumber}
                onChange={(e) => setNewCreditCard({ ...newCreditCard, cardNumber: e.target.value })}
                placeholder="Card Number"
              />
              <br></br>
              <label for="cardExpirationDate">Expiration Date: </label>               
              <input
                name="cardExpirationDate"
                value={newCreditCard.cardExpirationDate}
                onChange={(e) => setNewCreditCard({ ...newCreditCard, cardExpirationDate: e.target.value })}
                placeholder="Expiration Date"
              />
              <br></br>
              <label for="billingZipCode">Zip Code: </label>   
              <input
                name="billingZipCode"
                value={newCreditCard.billingZipCode}
                onChange={(e) => setNewCreditCard({ ...newCreditCard, billingZipCode: e.target.value })}
                placeholder="Billing Zip Code"
              />
              <br></br>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingCreditCard && (
          <div className='form'>
            <h3>Edit Credit Card: {editingCreditCard.cardID}</h3>
            <label for="cardName">Name on Card: </label>
            <input
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="Card Name"
            />
            <br></br>
            <label for="cardNumber">Card Number: </label>
            <input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
            />
            <br></br>
            <label for="cardExpirationDate">Expiration Date: </label>
            <input
              name="cardExpirationDate"
              value={formData.cardExpirationDate}
              onChange={handleChange}
              placeholder="Expiration Date"
            />
            <br></br>
            <label for="billingZipCode">Zip Code: </label>
            <input
              name="billingZipCode"
              value={formData.billingZipCode}
              onChange={handleChange}
              placeholder="Billing Zip Code"
            />         
            <br></br> 
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingCreditCard(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default CreditCards

