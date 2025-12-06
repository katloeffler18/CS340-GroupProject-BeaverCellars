/*
# Wine Component
# Date: 11/19/2025
# Citation for use of AI Tools:
  # Prompt: Help me implement add, edit, and delete functionality
  # AI Source URL: https://chatgpt.com/ 
*/


import React, { useState, useEffect } from 'react';
import '../App.css'


function WineItem({ wine, handleDelete, handleEdit}) {
  return (
    <tr>
    <td>{wine.wineID}</td>
    <td>{wine.wineName}</td>
    <td>{wine.wineVariety}</td>
    <td>{wine.wineYear}</td>
    <td>${wine.winePrice}</td>
    <td>{wine.grapeRegion}</td>
    <td>
      <button onClick={() => handleEdit(wine)}>Edit</button>
      <button onClick={() => handleDelete(wine.wineID)}>Delete</button>
    </td>
    </tr>
  )
}

function Wines(url) {
  const [data, setData] = useState([]);
  const [editingWine, setEditingWine] = useState(null);
  const [formData, setFormData] = useState({
    wineName: "",
    wineVariety: "",
    wineYear: "",
    winePrice: "",
    grapeRegion: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWine, setNewWine] = useState({
    wineName: "",
    wineVariety: "",
    wineYear: "",
    winePrice: "",
    grapeRegion: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchWines = async () => {
      try {
      const response = await fetch(url.url + ":35827/wines", {
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

    fetchWines();
  }, []); 

  // Frontend validation for adding a wine
  const validateWineForm = (wine) => {
    let errors = {};

    if (!wine.wineName.trim()) errors.wineName = "Name is required.";
    if (!wine.wineVariety.trim()) errors.wineVariety = "Variety is required.";

    const year = parseInt(wine.wineYear, 10);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      errors.wineYear = "Year must be a valid number between 1900 and next year.";
    }

    const price = parseFloat(wine.winePrice);
    if (isNaN(price) || price <= 0) {
      errors.winePrice = "Price must be a positive number.";
    }

    if (!wine.grapeRegion.trim()) errors.grapeRegion = "Region is required.";

    return errors;
  };

  // Frontend validation for editing
  const validateWineEditForm = validateWineForm; // same rules

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(url.url + `:35827/wines/${id}`, { method: "DELETE" });
    console.log(data.filter(wine => wine.wineID !== id));
    setData(data.filter(wine => wine.wineID !== id));
  };

  // Edit handler
  const handleEdit = (wine) => {
    setErrors({});
    setEditingWine(wine);
    setFormData({
      wineName: wine.wineName,
      wineVariety: wine.wineVariety,
      wineYear: wine.wineYear,
      winePrice: wine.winePrice,
      grapeRegion: wine.grapeRegion,
    });
  };

// Update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleUpdate = async () => {
    const validationErrors = validateWineEditForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await fetch(url.url + `:35827/wines/${editingWine.wineID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setData((prev) =>
        prev.map((wine) =>
          wine.wineID === editingWine.wineID ? { ...wine, ...formData } : wine
        )
      );

      setEditingWine(null);

    } catch (err) {
      console.error("Error updating wine:", err);
      alert("Could not update wine: " + err.message);
    }
  };


  const handleAdd = async () => {
    const validationErrors = validateWineForm(newWine);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // clear previous errors

    try {
      const response = await fetch(url.url + ":35827/wines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWine),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server rejected the request.");
      }

      const addedWine = await response.json();
      setData((prev) => [...prev, addedWine]);
      setShowAddForm(false);

      setNewWine({
        wineName: "",
        wineVariety: "",
        wineYear: "",
        winePrice: "",
        grapeRegion: "",
      });

    } catch (err) {
      console.error(err);
      alert("Error adding wine: " + err.message);
    }
  };
    return (
      <>
        <table>
          <caption>Wines</caption>
          <thead>
              <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Variety</th>
              <th>Year</th>
              <th>Price</th>
              <th>Region</th>
              <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            {data.map((wine) => (
              <WineItem key={wine.wineID} wine={wine} handleDelete={handleDelete} handleEdit={handleEdit}/>
            ))}
          </tbody>
        </table>
        <button onClick={() => { setShowAddForm(true); setErrors({}); }}>
          Add New Wine
        </button>
        {showAddForm && (
          <div>
            <div>
              <label htmlFor="wineName">Name: </label>
              <input
                name="wineName"
                value={newWine.wineName}
                onChange={(e) => setNewWine({ ...newWine, wineName: e.target.value })}
                placeholder="Name"
              />
              {errors.wineName && <p className="error">{errors.wineName}</p>}
              <br></br>
              <label htmlFor="wineVariety">Variety: </label>
              <input
                name="wineVariety"
                value={newWine.wineVariety}
                onChange={(e) => setNewWine({ ...newWine, wineVariety: e.target.value })}
                placeholder="Variety"
              />
              {errors.wineVariety && <p className="error">{errors.wineVariety}</p>}
              <br></br>
              <label htmlFor="wineYear">Year: </label>              
              <input
                name="wineYear"
                value={newWine.wineYear}
                onChange={(e) => setNewWine({ ...newWine, wineYear: e.target.value })}
                placeholder="Year"
              />
              {errors.wineYear && <p className="error">{errors.wineYear}</p>}
              <br></br>
              <label htmlFor="winePrice">Price: </label>  
              <input
                name="winePrice"
                value={newWine.winePrice}
                onChange={(e) => setNewWine({ ...newWine, winePrice: e.target.value })}
                placeholder="Price"
              />
              {errors.winePrice && <p className="error">{errors.winePrice}</p>}
              <br></br>
              <label htmlFor="grapeRegion">Grape Region: </label> 
              <input
                name="grapeRegion"
                value={newWine.grapeRegion}
                onChange={(e) => setNewWine({ ...newWine, grapeRegion: e.target.value })}
                placeholder="Region"
              />
              {errors.grapeRegion && <p className="error">{errors.grapeRegion}</p>}
              <br></br>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editingWine && (
          <div>
            <h3>Edit Wine: {editingWine.wineName}</h3>
            <label htmlFor="wineName">Name: </label>
            <input
              name="wineName"
              value={formData.wineName}
              onChange={handleChange}
              placeholder="Name"
            />
            {errors.wineName && <p className="error">{errors.wineName}</p>}
            <br></br>
            <label htmlFor="wineVariety">Variety: </label>
            <input
              name="wineVariety"
              value={formData.wineVariety}
              onChange={handleChange}
              placeholder="Variety"
            />
            {errors.wineVariety && <p className="error">{errors.wineVariety}</p>}
            <br></br>
            <label htmlFor="wineYear">Year: </label> 
            <input
              name="wineYear"
              value={formData.wineYear}
              onChange={handleChange}
              placeholder="Year"
            />
            {errors.wineYear && <p className="error">{errors.wineYear}</p>}
            <br></br>
            <label htmlFor="winePrice">Price: </label>
            <input
              name="winePrice"
              value={formData.winePrice}
              onChange={handleChange}
              placeholder="Price"
            />
            {errors.winePrice && <p className="error">{errors.winePrice}</p>}
            <br></br>
            <label htmlFor="grapeRegion">Grape Region: </label> 
            <input
              name="grapeRegion"
              value={formData.grapeRegion}
              onChange={handleChange}
              placeholder="Region"
            />
            {errors.grapeRegion && <p className="error">{errors.grapeRegion}</p>}
            <br></br>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingWine(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default Wines

