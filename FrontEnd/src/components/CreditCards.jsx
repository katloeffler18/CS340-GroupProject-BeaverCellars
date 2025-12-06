/*
# CreditCards Component
# Date: 11/19/2025, Updated: 12/5/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete functionality, validation, and member dropdown
  # AI Source URL: https://chatgpt.com/
*/

import React, { useState, useEffect } from 'react';
import '../App.css';

// Single row for a credit card
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
  const [data, setData] = useState([]);       // All credit cards
  const [members, setMembers] = useState([]); // Members dropdown list
  const [errors, setErrors] = useState({});

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

  // Load members + credit cards
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ccRes = await fetch(url.url + ":35827/creditcards");
        const ccData = await ccRes.json();
        setData(ccData);

        const memRes = await fetch(url.url + ":35827/members");
        const memData = await memRes.json();
        setMembers(memData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // -----------------------------
  // VALIDATION
  // -----------------------------
  const validateCardForm = (card) => {
    let errors = {};

    if (!card.memberID) {
      errors.memberID = "You must select a member.";
    }

    if (!card.cardName.trim()) {
      errors.cardName = "Name on card is required.";
    }

    // Card Number (16 digits)
    const digits = String(card.cardNumber).replace(/\D/g, "");
    if (!digits) {
      errors.cardNumber = "Card number is required.";
    } else if (digits.length < 13 || digits.length > 16) {
      errors.cardNumber = "Card number must be 13–16 digits.";
    }

    // Expiration date
    const today = new Date();
    const exp = new Date(card.cardExpirationDate);
    if (!card.cardExpirationDate || exp <= today) {
      errors.cardExpirationDate = "Expiration date must be a future date.";
    }

    // ZIP code
    const zip = String(card.billingZipCode).replace(/\D/g, "");
    if (!zip) {
      errors.billingZipCode = "Billing ZIP is required.";
    } else if (zip.length !== 5) {
      errors.billingZipCode = "ZIP must be 5 digits.";
    }

    return errors;
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    await fetch(url.url + `:35827/creditcards/${id}`, { method: "DELETE" });

    setData((prev) => prev.filter(card => card.cardID !== id));
  };

  // -----------------------------
  // EDIT MODE
  // -----------------------------
  const handleEdit = (card) => {
    setErrors({});
    setEditingCreditCard(card);

    const isoDate = new Date(card.cardExpirationDate).toISOString().split("T")[0];

    setFormData({
      memberID: card.memberID,
      cardName: card.cardName,
      cardNumber: card.cardNumber,
      cardExpirationDate: isoDate,
      billingZipCode: card.billingZipCode,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // UPDATE CARD
  // -----------------------------
  const handleUpdate = async () => {
    const validationErrors = validateCardForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const cleanData = {
      ...formData,
      cardNumber: formData.cardNumber.replace(/\D/g, ""),
      billingZipCode: formData.billingZipCode.replace(/\D/g, ""),
    };

    try {
      await fetch(url.url + `:35827/creditcards/${editingCreditCard.cardID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      const member = members.find(m => m.memberID === Number(cleanData.memberID));

      setData((prev) =>
        prev.map((card) =>
          card.cardID === editingCreditCard.cardID
            ? { ...card, ...cleanData, memberName: member?.memberName || "" }
            : card
        )
      );

      setEditingCreditCard(null);
    } catch (err) {
      console.error("Error updating card:", err);
      alert(err.message);
    }
  };

  // -----------------------------
  // ADD NEW CARD
  // -----------------------------
  const handleAdd = async () => {
    const validationErrors = validateCardForm(newCreditCard);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const cleanData = {
      ...newCreditCard,
      cardNumber: newCreditCard.cardNumber.replace(/\D/g, ""),
      billingZipCode: newCreditCard.billingZipCode.replace(/\D/g, ""),
    };

    try {
      const res = await fetch(url.url + ":35827/creditcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      const added = await res.json();
      const member = members.find(m => m.memberID === Number(cleanData.memberID));

      added.memberName = member?.memberName || "";

      setData((prev) => [...prev, added]);

      // Reset
      setShowAddForm(false);
      setNewCreditCard({
        memberID: "",
        cardName: "",
        cardNumber: "",
        cardExpirationDate: "",
        billingZipCode: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.message);
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
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
            <th>Billing ZIP</th>
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

      {/* ADD FORM */}
      <button onClick={() => { setShowAddForm(true); setErrors({}); }}>
        Add New Credit Card
      </button>

      {showAddForm && (
        <div className="form">
          <h3>Add Credit Card</h3>

          <label>Member:</label>
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
          {errors.memberID && <p className="error">{errors.memberID}</p>}

          <label>Name on Card:</label>
          <input
            name="cardName"
            value={newCreditCard.cardName}
            onChange={(e) =>
              setNewCreditCard({ ...newCreditCard, cardName: e.target.value })
            }
          />
          {errors.cardName && <p className="error">{errors.cardName}</p>}

          <label>Card Number:</label>
          <input
            name="cardNumber"
            value={newCreditCard.cardNumber}
            onChange={(e) =>
              setNewCreditCard({ ...newCreditCard, cardNumber: e.target.value })
            }
          />
          {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

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
          {errors.cardExpirationDate && (
            <p className="error">{errors.cardExpirationDate}</p>
          )}

          <label>Billing ZIP:</label>
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
          {errors.billingZipCode && (
            <p className="error">{errors.billingZipCode}</p>
          )}
        <br></br>
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {/* EDIT FORM */}
      {editingCreditCard && (
        <div className="form">
          <h3>Edit Credit Card #{editingCreditCard.cardID}</h3>

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
          {errors.memberID && <p className="error">{errors.memberID}</p>}

          <label>Name on Card:</label>
          <input
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
          />
          {errors.cardName && <p className="error">{errors.cardName}</p>}

          <label>Card Number:</label>
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
          />
          {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

          <label>Expiration Date:</label>
          <input
            type="date"
            name="cardExpirationDate"
            value={formData.cardExpirationDate}
            onChange={handleChange}
          />
          {errors.cardExpirationDate && (
            <p className="error">{errors.cardExpirationDate}</p>
          )}

          <label>Billing ZIP:</label>
          <input
            name="billingZipCode"
            value={formData.billingZipCode}
            onChange={handleChange}
          />
          {errors.billingZipCode && (
            <p className="error">{errors.billingZipCode}</p>
          )}
          <br></br>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingCreditCard(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default CreditCards;
