import React, { useState, useEffect } from 'react';


function OrderItem({ order }) {
  return (
    <tr>
    <td>{order.orderID}</td>
    <td>{order.memberID}</td>
    <td>{order.cardID}</td>
    <td>{order.orderDate}</td>
    <td>{order.orderPrice}</td>
    <td>{order.hasShipped}</td>
    </tr>
  )
}

function Orders() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
      const response = await fetch("http://localhost:35827/orders", {
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

    fetchOrders();
  }, []); 

    return (
      <>
          <table>
          <thead>
              <tr>
              <th>Order ID</th>
              <th>Member ID</th>
              <th>Card ID</th>
              <th>Order Date</th>
              <th>Order Price</th>
              <th>Shipped</th>
              </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <OrderItem key={order.orderID} order={order} />
            ))}
          </tbody>
        </table>
      </>
    )
}

export default Orders

