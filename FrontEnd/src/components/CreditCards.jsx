import React, { useState, useEffect } from 'react';


function CreditCardItem({ creditCard }) {
  return (
    <tr>
    <td>{creditCard.cardID}</td>
    <td>{creditCard.memberID}</td>
    <td>{creditCard.cardName}</td>
    <td>{creditCard.cardNumber}</td>
    <td>{creditCard.cardExpirationDate}</td>
    <td>{creditCard.billingZipCode}</td>
    </tr>
  )
}

function CreditCards() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
      const response = await fetch("http://localhost:35827/creditcards", {
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

    return (
      <>
          <table>
          <thead>
              <tr>
              <th>Card ID</th>
              <th>Member ID</th>
              <th>Name</th>
              <th>Card Number</th>
              <th>Expiration Date</th>
              <th>Billing Zip Code</th>
              </tr>
          </thead>
          <tbody>
            {data.map((creditCard) => (
              <CreditCardItem key={creditCard.cardID} creditCard={creditCard} />
            ))}
          </tbody>
        </table>
      </>
    )
}

export default CreditCards

