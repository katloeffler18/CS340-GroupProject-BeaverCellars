import React, { useState, useEffect } from 'react';


function WineItem({ wine }) {
  return (
    <tr>
    <td>{wine.wineID}</td>
    <td>{wine.wineName}</td>
    <td>{wine.wineVariety}</td>
    <td>{wine.wineYear}</td>
    <td>${wine.winePrice}</td>
    <td>{wine.grapeRegion}</td>
    </tr>
  )
}

function Wines() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWines = async () => {
      try {
      const response = await fetch("http://localhost:35827/wines", {
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

    return (
      <>
          <table>
          <thead>
              <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Variety</th>
              <th>Year</th>
              <th>Price</th>
              <th>Region</th>
              </tr>
          </thead>
          <tbody>
            {data.map((wine) => (
              <WineItem key={wine.wineID} wine={wine} />
            ))}
          </tbody>
        </table>
      </>
    )
}

export default Wines

