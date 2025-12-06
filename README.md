
# README.md — Wine Club Management System

## Project Overview

This project implements a full-stack CRUD web application for a wine club. Users can manage Wines, Members, Credit Cards, Orders, Wine Orders, and Shipments. The backend is built in Node.js and Express using a MySQL/MariaDB database hosted on classwork.engr.oregonstate.edu, and the frontend is built with React.

This application was developed as part of Oregon State University’s CS340 – Introduction to Databases course.

---

## Features

### CRUD Functionality

- Wines  
- Members  
- Credit Cards  
- Orders  
- Order Details (WinesOrders)  
- Shipments  

### Frontend and Backend Validation

- Required-field validation for all Add and Edit forms  

---

## Project Structure

```
/BackEnd
    app.js
    db-connector.js
    package-lock.json
    package.json
    /validators
      validateWine.js
      validateMember.js
      validateCard.js
      validateOrder.js
      validateWinesOrders.js
      validateShipments.js
/Frontend
    reactServer.cjs
    package.json
    package-lock.json
    vite.config.js
    index.html
    /src
        /components
            Home.jsx
            Wines.jsx
            Members.jsx
            CreditCards.jsx
            Orders.jsx
            WinesOrders.jsx
            Shipments.jsx
        App.jsx
        App.css
        index.css
        main.jsx
/DataBase
    DDQ.sql
    DMQ.sql
    PL.sql
README.md
```

---

## Technologies Used

### Frontend

- React  
- Custom CSS (referenced examples from W3Schools)

### Backend

- Node.js  
- Express  
- MySQL/MariaDB on OSU Engineering servers - CS340_loefflek

### Deployment

- Runs forever entirely on the OSU class VM environment  

---
## Citations

### CS340 Backend Starter Code

Backend app.js setup, db-connector.js template, and reactServer.cjs were adapted from Oregon State University course materials:

**Oregon State University – CS340: Connect webapp to database**  
https://canvas.oregonstate.edu/courses/2017561/assignments/10111722

### CSS Reference

Some CSS examples were referenced or adapted from:

**W3Schools HTML/CSS Reference**  
https://www.w3schools.com/html/html_css.asp

---

### AI Assistance Citations

ChatGPT. (2025). Assistance with software development tasks including SQL stored procedures, React validation, debugging, and README creation. OpenAI.

Major prompts included:

#### Backend (Stored Procedures, RESET function)

- Help writing stored procedures for selecting, inserting, updating, and deleting records
- Help creating RESET stored proedure around CREATE/INSERT procedures  
- Add price calculation logic to WinesOrders stored procedures and Backend
- Help add RESET route to backend

#### Frontend (React Components)

- Implement add, edit, and delete functionality for Wines, Members, CreditCards, Orders, and Shipments  
- Fix dropdown population issues in Orders and WinesOrders  
- Help add validation to Wines, Members, Orders, WinesOrders, and Shipments components  
- Resolve state update issues and rendering bugs  

#### Miscellaneous

- Generate this README in GitHub-ready Markdown format  
