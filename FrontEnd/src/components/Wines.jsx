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
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(url.url + ":35827/wines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWine),
      });

      if (!response.ok) throw new Error(`Error adding wine: ${response.status}`);

      const addedWine = await response.json();

      // Update table instantly
      setData((prev) => [...prev, addedWine]);
      setShowAddForm(false);

      // Reset form
      setNewWine({
        wineName: "",
        wineVariety: "",
        wineYear: "",
        winePrice: "",
        grapeRegion: "",
      });
    } catch (err) {
      console.error(err);
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
        <button onClick={() => setShowAddForm(true)}>Add New Wine</button>
        {showAddForm && (
          <div>
            <div>
              <label for="wineName">Name: </label>
              <input
                name="wineName"
                value={newWine.wineName}
                onChange={(e) => setNewWine({ ...newWine, wineName: e.target.value })}
                placeholder="Name"
              />
              <br></br>
              <label for="wineVariety">Variety: </label>
              <input
                name="wineVariety"
                value={newWine.wineVariety}
                onChange={(e) => setNewWine({ ...newWine, wineVariety: e.target.value })}
                placeholder="Variety"
              />
              <br></br>
              <label for="wineYear">Year: </label>              
              <input
                name="wineYear"
                value={newWine.wineYear}
                onChange={(e) => setNewWine({ ...newWine, wineYear: e.target.value })}
                placeholder="Year"
              />
              <br></br>
              <label for="winePrice">Price: </label>  
              <input
                name="winePrice"
                value={newWine.winePrice}
                onChange={(e) => setNewWine({ ...newWine, winePrice: e.target.value })}
                placeholder="Price"
              />
              <br></br>
              <label for="grapeRegion">Grape Region: </label> 
              <input
                name="grapeRegion"
                value={newWine.grapeRegion}
                onChange={(e) => setNewWine({ ...newWine, grapeRegion: e.target.value })}
                placeholder="Region"
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
          <div>
            <h3>Edit Wine: {editingWine.wineName}</h3>
            <label for="wineName">Name: </label>
            <input
              name="wineName"
              value={formData.wineName}
              onChange={handleChange}
              placeholder="Name"
            />
            <br></br>
            <label for="wineVariety">Variety: </label>
            <input
              name="wineVariety"
              value={formData.wineVariety}
              onChange={handleChange}
              placeholder="Variety"
            />
            <br></br>
            <label for="wineYear">Year: </label> 
            <input
              name="wineYear"
              value={formData.wineYear}
              onChange={handleChange}
              placeholder="Year"
            />
            <br></br>
            <label for="winePrice">Price: </label>
            <input
              name="winePrice"
              value={formData.winePrice}
              onChange={handleChange}
              placeholder="Price"
            />
            <br></br>
            <label for="grapeRegion">Grape Region: </label> 
            <input
              name="grapeRegion"
              value={formData.grapeRegion}
              onChange={handleChange}
              placeholder="Region"
            />
            <br></br>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingWine(null)}>Cancel</button>
          </div>
      )}
      </>
    )
}

export default Wines

