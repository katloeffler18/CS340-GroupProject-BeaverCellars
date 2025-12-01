/*
# CreditCards Component
# Date: 11/19/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete buttons, and fix member dropdown
  # AI Source URL: https://chatgpt.com/
*/

import React, { useState, useEffect } from 'react';
import '../App.css';

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
  );
}

function CreditCards(url) {
  const [data, setData] = useState([]);          // credit cards
  const [members, setMembers] = useState([]);    // members table
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

  //
  // LOAD CREDIT CARDS + MEMBERS
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        // credit cards
        const ccRes = await fetch(url.url + ":35827/creditcards");
        const ccData = await ccRes.json();
        setData(ccData);

        // members
        const memberRes = await fetch(url.url + ":35827/members");
        const memberData = await memberRes.json();
        setMembers(memberData);

      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  //
  // DELETE CREDIT CARD
  //
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    await fetch(url.url + `:35827/creditcards/${id}`, { method: "DELETE" });
    setData(data.filter(cc => cc.cardID !== id));
  };

  //
  // BEGIN EDIT MODE
  //
  const handleEdit = (creditCard) => {
    setEditingCreditCard(creditCard);

    // Convert date to yyyy-mm-dd for <input type="date">
    const isoDate = new Date(creditCard.cardExpirationDate)
      .toISOString()
      .split("T")[0];

    setFormData({
      memberID: creditCard.memberID,
      cardName: creditCard.cardName,
      cardNumber: creditCard.cardNumber,
      cardExpirationDate: isoDate,
      billingZipCode: creditCard.billingZipCode,
    });
  };

  //
  // HANDLE EDIT FORM INPUT
  //
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //
  // SUBMIT UPDATE
  //
  const handleUpdate = async () => {
    await fetch(url.url + `:35827/creditcards/${editingCreditCard.cardID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Get selected member's name
    const selectedMember = members.find(m => m.memberID === Number(formData.memberID));

    setData(prev =>
      prev.map(cc =>
        cc.cardID === editingCreditCard.cardID
          ? {
              ...cc,
              ...formData,
              memberName: selectedMember ? selectedMember.memberName : "",
            }
          : cc
      )
    );

    setEditingCreditCard(null);
  };

  //
  // ADD NEW CREDIT CARD
  //
  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/creditcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCreditCard),
      });

      const added = await response.json();

      // Attach member name
      const selectedMember = members.find(
        m => m.memberID === Number(newCreditCard.memberID)
      );
      added.memberName = selectedMember ? selectedMember.memberName : "";

      setData(prev => [...prev, added]);

      setShowAddForm(false);

      setNewCreditCard({
        memberID: "",
        cardName: "",
        cardNumber: "",
        cardExpirationDate: "",
        billingZipCode: "",
      });
    } catch (err) {
      console.error("Add failed:", err);
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
          {data.map(card => (
            <CreditCardItem
              key={card.cardID}
              creditCard={card}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      {/* ADD NEW FORM */}
      <button onClick={() => setShowAddForm(true)}>Add New Credit Card</button>

      {showAddForm && (
        <div className="form">
          <label>Member Name:</label>
          <select
            value={newCreditCard.memberID}
            onChange={(e) =>
              setNewCreditCard({ ...newCreditCard, memberID: e.target.value })
            }
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.memberID} value={m.memberID}>
                {m.memberName}
              </option>
            ))}
          </select>

          <label>Name on Card:</label>
          <input
            name="cardName"
            value={newCreditCard.cardName}
            onChange={(e) =>
              setNewCreditCard({ ...newCreditCard, cardName: e.target.value })
            }
          />

          <label>Card Number:</label>
          <input
            name="cardNumber"
            value={newCreditCard.cardNumber}
            onChange={(e) =>
              setNewCreditCard({ ...newCreditCard, cardNumber: e.target.value })
            }
          />

          <label>Expiration Date:</label>
          <input
            type="date"
            name="cardExpirationDate"
            value={newCreditCard.cardExpirationDate}
            onChange={(e) =>
              setNewCreditCard({
                ...newCreditCard,
                cardExpirationDate: e.target.value,
              })
            }
          />

          <label>Zip Code:</label>
          <input
            name="billingZipCode"
            value={newCreditCard.billingZipCode}
            onChange={(e) =>
              setNewCreditCard({
                ...newCreditCard,
                billingZipCode: e.target.value,
              })
            }
          />

          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {/* EDIT FORM */}
      {editingCreditCard && (
        <div className="form">
          <h3>Edit Credit Card: {editingCreditCard.cardID}</h3>

          <label>Member:</label>
          <select
            name="memberID"
            value={formData.memberID}
            onChange={handleChange}
          >
            {members.map((m) => (
              <option key={m.memberID} value={m.memberID}>
                {m.memberName}
              </option>
            ))}
          </select>

          <label>Name on Card:</label>
          <input
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
          />

          <label>Card Number:</label>
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
          />

          <label>Expiration Date:</label>
          <input
            type="date"
            name="cardExpirationDate"
            value={formData.cardExpirationDate}
            onChange={handleChange}
          />

          <label>Zip Code:</label>
          <input
            name="billingZipCode"
            value={formData.billingZipCode}
            onChange={handleChange}
          />
          <br></br>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingCreditCard(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default CreditCards;
