/*
# Members Component
# Date: 11/19/2025, Updated: 12/4/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete functionality and validation
  # AI Source URL: https://chatgpt.com/
*/

import React, { useState, useEffect } from 'react';
import '../App.css'

function MemberItem({ member, handleDelete, handleEdit }) {
  return (
    <tr>
    <td>{member.memberID}</td>
    <td>{member.memberName}</td>
    <td>{member.email}</td>
    <td>{member.address}</td>
    <td>{member.city}</td>
    <td>{member.state}</td>
    <td>{member.memberZipCode}</td>
    <td>{member.phoneNumber}</td>
    <td>
      <button onClick={() => handleEdit(member)}>Edit</button>
      <button onClick={() => handleDelete(member.memberID)}>Delete</button>
    </td>
    </tr>
  )
}

function Members(url) {
  const [data, setData] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    memberName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    memberZipCode: "",
    phoneNumber: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    memberName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    memberZipCode: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
      const response = await fetch(url.url + ":35827/members", {
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

    fetchMembers();
  }, []); 

  // Validation for new or edited member records
  const validateMemberForm = (member) => {
    let errors = {};

    // Name
    if (!member.memberName.trim()) {
      errors.memberName = "Name is required.";
    } else if (member.memberName.trim().length < 2) {
      errors.memberName = "Name must be at least 2 characters.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!member.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(member.email)) {
      errors.email = "Invalid email format.";
    }

    // Address
    if (!member.address.trim()) errors.address = "Address is required.";

    // City
    if (!member.city.trim()) errors.city = "City is required.";

    // State
    const stateRegex = /^[A-Za-z]{2}$/;
    if (!member.state.trim()) {
      errors.state = "State is required.";
    } else if (!stateRegex.test(member.state)) {
      errors.state = "Use 2-letter state code (e.g., CO).";
    }

    // Zip Code
    const zipRegex = /^\d{5}$/;
    if (!member.memberZipCode.trim()) {
      errors.memberZipCode = "ZIP code is required.";
    } else if (!zipRegex.test(member.memberZipCode)) {
      errors.memberZipCode = "ZIP must be 5 digits.";
    }

    // Phone Number
    const digitsOnly = String(member.phoneNumber || "").replace(/\D/g, "");
    if (!digitsOnly) {
      errors.phoneNumber = "Phone number is required.";
    } else if (digitsOnly.length !== 10) {
      errors.phoneNumber = "Phone must be 10 digits.";
    }

    return errors;
  };

  // Editing uses same rules
  const validateMemberEditForm = validateMemberForm;


  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(url.url + `:35827/members/${id}`, { method: "DELETE" });
    console.log(data.filter(member => member.memberID !== id));
    setData(data.filter(member => member.memberID !== id));
  };

  // Edit handler
  const handleEdit = (member) => {
    setErrors({});
    setEditingMember(member);
    setFormData({
      memberName: member.memberName,
      email: member.email,
      address: member.address,
      city: member.city,
      state: member.state,
      memberZipCode: member.memberZipCode,
      phoneNumber: member.phoneNumber,
    });
  };

// Update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    const validationErrors = validateMemberEditForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const cleanData = {
      ...formData, // or newMember
      phoneNumber: formData.phoneNumber.replace(/\D/g, ""),
      memberZipCode: formData.memberZipCode.replace(/\D/g, "")
    };

    try {
      await fetch(url.url + `:35827/members/${editingMember.memberID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      setData((prev) =>
        prev.map((member) =>
          member.memberID === editingMember.memberID ? { ...member, ...cleanData } : member
        )
      );


      setEditingMember(null);
    } catch (err) {
      console.error("Error updating member:", err);
      alert("Could not update member: " + err.message);
    }
  };


  // Insert handler
  const handleAdd = async () => {
    const validationErrors = validateMemberForm(newMember);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const cleanData = {
      ...newMember, 
      phoneNumber: newMember.phoneNumber.replace(/\D/g, ""),
      memberZipCode: newMember.memberZipCode.replace(/\D/g, "")
    };
    try {
      const response = await fetch(url.url + ":35827/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server rejected request.");
      }

      const addedMember = await response.json();
      setData((prev) => [...prev, addedMember]);
      setShowAddForm(false);

      setNewMember({
        memberName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        memberZipCode: "",
        phoneNumber: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding member: " + err.message);
    }
  };


    return (
      <>
          <table>
            <caption>Members</caption>
            <thead>
              <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip Code</th>
              <th>Phone Number</th>
              <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            {data.map((member) => (
              <MemberItem key={member.memberID} member={member} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => { setShowAddForm(true); setErrors({}); }}>
          Add New Member
        </button>
        {showAddForm && (
          <div>
            <div>
              <label htmlFor="memberName">Name: </label>
              <input
                name="memberName"
                value={newMember.memberName}
                onChange={(e) => setNewMember({ ...newMember, memberName: e.target.value })}
                placeholder="Name"
              />
              {errors.memberName && <p className="error">{errors.memberName}</p>}
              <br></br>
              <label htmlFor="email">Email: </label>
              <input
                name="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="Email"
              />
              {errors.email && <p className="error">{errors.email}</p>}
              <br></br>
              <label htmlFor="address">Address: </label>              
              <input
                name="address"
                value={newMember.address}
                onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                placeholder="Address"
              />
              {errors.address && <p className="error">{errors.address}</p>}
              <br></br>
              <label htmlFor="city">City: </label>              
              <input
                name="city"
                value={newMember.city}
                onChange={(e) => setNewMember({ ...newMember, city: e.target.value })}
                placeholder="City"
              />
              {errors.city && <p className="error">{errors.city}</p>}
              <br></br>
              <label htmlFor="state">State: </label>
              <input
                name="state"
                value={newMember.state}
                onChange={(e) => setNewMember({ ...newMember, state: e.target.value })}
                placeholder="State"
              />
              {errors.state && <p className="error">{errors.state}</p>}
              <br></br>
              <label htmlFor="memberZipCode">Zip Code: </label>
              <input
                name="memberZipCode"
                value={newMember.memberZipCode}
                onChange={(e) => setNewMember({ ...newMember, memberZipCode: e.target.value })}
                placeholder="Zip Code"
              /> 
              {errors.memberZipCode && <p className="error">{errors.memberZipCode}</p>}
              <br></br>
              <label htmlFor="phoneNumber">Phone Number: </label>             
              <input
                name="phoneNumber"
                value={newMember.phoneNumber}
                onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              /> 
              {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
              <br></br>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingMember && (
          <div>
            <h3>Edit Member: {editingMember.memberName}</h3>
            <label htmlFor="memberName">Name: </label>
            <input
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              placeholder="Name"
            />
            {errors.memberName && <p className="error">{errors.memberName}</p>}
            <br></br>
            <label htmlFor="email">Email: </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <br></br>
            <label htmlFor="address">Address: </label> 
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            {errors.address && <p className="error">{errors.address}</p>}
            <br></br>
            <label htmlFor="city">City: </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            {errors.city && <p className="error">{errors.city}</p>}
            <br></br>
            <label htmlFor="state">State: </label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            {errors.state && <p className="error">{errors.state}</p>}
            <br></br>
            <label htmlFor="memberZipCode">Zip Code: </label>
            <input
              name="memberZipCode"
              value={formData.memberZipCode}
              onChange={handleChange}
              placeholder="Zip Code"
            />
            {errors.memberZipCode && <p className="error">{errors.memberZipCode}</p>}
            <br></br>
            <label htmlFor="phoneNumber">Phone Number: </label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
            <br></br>            
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingMember(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default Members

