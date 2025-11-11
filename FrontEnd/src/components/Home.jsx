import React from "react";

function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "75vh",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "28",
          color: "black"
        }}
      >
        Beaver Cellars Member and Order Management System
      </h1>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "normal",
          marginBottom: "1rem",
          color: "black"
        }}
      >
        Created by Kat Loeffler and Fuhai Feng
      </h2>

      <p style={{ color: "black", fontSize: "20px", maxWidth: "600px" }}>
        Welcome! This database backend system will allow Beaver Cellars to 
        efficiently track members, manage inventory, process orders, 
        and coordinate shipments. Use the navigation above to view, add, 
        edit, or delete Wines, Members, Credit Cards, Orders, Order Details, and Shipments.
      </p>
    </div>
  );
}

export default HomePage;