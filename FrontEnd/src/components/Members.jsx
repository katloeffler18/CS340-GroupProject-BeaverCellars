/*
# Members Component
# Date: 11/19/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete buttons
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
    await fetch(url.url + `:35827/members/${editingMember.memberID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setData((prev) =>
      prev.map((member) =>
        member.memberID === editingMember.memberID ? { ...member, ...formData } : member
      )
    );
    setEditingMember(null);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) throw new Error(`Error adding member: ${response.status}`);

      const addedMember = await response.json();

      // Update table instantly
      setData((prev) => [...prev, addedMember]);
      setShowAddForm(false);

      // Reset form
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
        <button onClick={() => setShowAddForm(true)}>Add New Member</button>
        {showAddForm && (
          <div>
            <div>
              <label for="memberName">Name: </label>
              <input
                name="memberName"
                value={newMember.memberName}
                onChange={(e) => setNewMember({ ...newMember, memberName: e.target.value })}
                placeholder="Name"
              />
              <br></br>
              <label for="email">Email: </label>
              <input
                name="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="Email"
              />
              <br></br>
              <label for="address">Address: </label>              
              <input
                name="address"
                value={newMember.address}
                onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                placeholder="Address"
              />
              <br></br>
              <label for="city">City: </label>              
              <input
                name="city"
                value={newMember.city}
                onChange={(e) => setNewMember({ ...newMember, city: e.target.value })}
                placeholder="City"
              />
              <br></br>
              <label for="state">State: </label>
              <input
                name="state"
                value={newMember.state}
                onChange={(e) => setNewMember({ ...newMember, state: e.target.value })}
                placeholder="State"
              />
              <br></br>
              <label for="memberZipCode">Zip Code: </label>
              <input
                name="memberZipCode"
                value={newMember.memberZipCode}
                onChange={(e) => setNewMember({ ...newMember, memberZipCode: e.target.value })}
                placeholder="Zip Code"
              /> 
              <br></br>
              <label for="phoneNumber">Phone Number: </label>             
              <input
                name="phoneNumber"
                value={newMember.phoneNumber}
                onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              /> 
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
            <label for="memberName">Name: </label>
            <input
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              placeholder="Name"
            />
            <br></br>
            <label for="email">Email: </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <br></br>
            <label for="address">Address: </label> 
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <br></br>
            <label for="city">City: </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            <br></br>
            <label for="state">State: </label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            <br></br>
            <label for="memberZipCode">Zip Code: </label>
            <input
              name="memberZipCode"
              value={formData.memberZipCode}
              onChange={handleChange}
              placeholder="Zip Code"
            />
            <br></br>
            <label for="phoneNumber">Phone Number: </label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <br></br>            
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingMember(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default Members

