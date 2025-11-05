import React, { useState, useEffect } from 'react';


function MemberItem({ member }) {
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
    </tr>
  )
}

function Members() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
      const response = await fetch("http://localhost:35827/members", {
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

    return (
      <>
          <table>
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
              </tr>
          </thead>
          <tbody>
            {data.map((member) => (
              <MemberItem key={member.memberID} member={member} />
            ))}
          </tbody>
        </table>
      </>
    )
}

export default Members

