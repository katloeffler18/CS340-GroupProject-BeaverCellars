import React, { useState, useEffect } from 'react';


function ShipmentItem({ shipment }) {
  return (
    <tr>
    <td>{shipment.shipmentID}</td>
    <td>{shipment.orderID}</td>
    <td>{shipment.shipmentDate}</td>
    <td>{shipment.carrier}</td>
    <td>{shipment.trackingNumber}</td>
    </tr>
  )
}

function Shipments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
      const response = await fetch("http://localhost:35827/shipments", {
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

    fetchShipments();
  }, []); 

    return (
      <>
          <table>
          <thead>
              <tr>
              <th>Shipment ID</th>
              <th>Order ID</th>
              <th>Shipment Date</th>
              <th>Carrier</th>
              <th>Tracking Number</th>
              </tr>
          </thead>
          <tbody>
            {data.map((shipment) => (
              <ShipmentItem key={shipment.shipmentID} shipment={shipment} />
            ))}
          </tbody>
        </table>
      </>
    )
}

export default Shipments

