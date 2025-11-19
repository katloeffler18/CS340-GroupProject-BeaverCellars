-- Beaver Cellars Database
-- Stored Procedure for RESET Function
-- Created by Kat Loeffler & Fuhai Feng
-- Step 4: PL/SQL Stored Procedure + RESET


DROP PROCEDURE IF EXISTS ResetBeaverCellars;
DELIMITER //

CREATE PROCEDURE ResetBeaverCellars()
BEGIN
    -- Error handler: rollback if ANY SQL exception occurs
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET FOREIGN_KEY_CHECKS = 1;
        SELECT 'ERROR: Database reset failed. All changes have been rolled back.' AS message;
    END;

    SET FOREIGN_KEY_CHECKS = 0;
    START TRANSACTION;

    -- DROP TABLES ------------------------------------------
    DROP TABLE IF EXISTS WinesOrders;
    DROP TABLE IF EXISTS Shipments;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS CreditCards;
    DROP TABLE IF EXISTS Members;
    DROP TABLE IF EXISTS Wines;

    -- CREATE TABLES -----------------------------------------
    CREATE TABLE Wines (
        wineID INT AUTO_INCREMENT PRIMARY KEY,
        wineName VARCHAR(100) NOT NULL,
        wineVariety VARCHAR(50) NOT NULL,
        wineYear INT NOT NULL,
        winePrice DECIMAL(6,2) NOT NULL,
        grapeRegion VARCHAR(50) NOT NULL
    );

    CREATE TABLE Members (
        memberID INT AUTO_INCREMENT PRIMARY KEY,
        memberName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        address VARCHAR(100) NOT NULL,
        city VARCHAR(25) NOT NULL,
        state CHAR(2) NOT NULL,
        memberZipCode CHAR(5) NOT NULL,
        phoneNumber VARCHAR(25) NOT NULL
    );

    CREATE TABLE CreditCards (
        cardID INT AUTO_INCREMENT PRIMARY KEY, 
        memberID INT NOT NULL,
        cardName VARCHAR(100) NOT NULL,
        cardNumber CHAR(16) NOT NULL,
        cardExpirationDate DATE NOT NULL,
        billingZipCode CHAR(5) NOT NULL,
        FOREIGN KEY (memberID) REFERENCES Members(memberID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );

    CREATE TABLE Orders (
        orderID INT AUTO_INCREMENT PRIMARY KEY,
        memberID INT NOT NULL,
        cardID INT NOT NULL,
        orderDate DATE NOT NULL,
        orderPrice DECIMAL(6,2) NOT NULL,
        hasShipped BOOLEAN NOT NULL,
        FOREIGN KEY (memberID) REFERENCES Members(memberID)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (cardID) REFERENCES CreditCards(cardID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );

    CREATE TABLE Shipments (
        shipmentID INT AUTO_INCREMENT PRIMARY KEY, 
        orderID INT NOT NULL,
        shipmentDate DATE NOT NULL,
        carrier VARCHAR(25) NOT NULL,
        trackingNumber VARCHAR(50) NOT NULL,
        FOREIGN KEY (orderID) REFERENCES Orders(orderID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );

    CREATE TABLE WinesOrders (
        winesOrdersID INT AUTO_INCREMENT PRIMARY KEY,
        orderID INT NOT NULL,
        wineID INT NOT NULL,
        wineQuantity INT NOT NULL,
        price DECIMAL(6,2) NOT NULL,
        FOREIGN KEY (orderID) REFERENCES Orders(orderID)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (wineID) REFERENCES Wines(wineID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );

    -- INSERT SAMPLE DATA ------------------------------------
    INSERT INTO Wines (wineName, wineVariety, wineYear, winePrice, grapeRegion)
    VALUES 
        ('Iron Orchard', 'Cabernet Sauvignon', 2022, 75.00, 'Napa Valley'),
        ('Rogue Vineyard', 'Chardonnay', 2020, 60.00, 'Rogue Valley'),
        ('Morning Slate', 'Pinot Noir', 2018, 50.00, 'Willamette Valley'),
        ('Clear Creek', 'Pinot Gris', 2023, 35.00, 'Yakima Valley');

    INSERT INTO Members (memberName, email, address, city, state, memberZipCode, phoneNumber)
    VALUES
        ('Ava Morrison', 'amorrison@email.com', '3748 Lone Tree Rd', 'Denver', 'CO', '80201', '5035555555'),
        ('Jessie Hale', 'jess-hale-18@email.com', '88821 Church St', 'Nashville', 'TN', '37027', '6155555555'),
        ('Lucas Avery', 'lucasavery5@email.com', '147 Aspen Ct', 'Portland', 'OR', '97203', '3035555555');

    INSERT INTO CreditCards (memberID, cardName, cardNumber, cardExpirationDate, billingZipCode)
    VALUES
        (2, 'Jessie Hale', '1928554249773270', '2027-06-01', '37027'),
        (3, 'Lauren Avery', '6079515370416374', '2028-08-01', '97203'),
        (1, 'Ava Morrison', '4265852982433821', '2027-03-01', '80123');

    INSERT INTO Orders (memberID, cardID, orderDate, orderPrice, hasShipped)
    VALUES
        (2, 1, '2025-03-13', 75.00, TRUE),
        (1, 3, '2025-07-25', 95.00, TRUE),
        (3, 2, '2025-09-09', 100.00, TRUE),
        (1, 3, '2025-10-31', 150.00, FALSE);

    INSERT INTO WinesOrders (orderID, wineID, wineQuantity, price)
    VALUES
        (1, 1, 1, 75.00),
        (2, 2, 1, 60.00),
        (2, 4, 1, 35.00),
        (3, 3, 2, 100.00),
        (4, 1, 2, 150.00);

    INSERT INTO Shipments (orderID, shipmentDate, carrier, trackingNumber)
    VALUES
        (1, '2025-03-23', 'UPS', '1Z5727545669644096'),
        (2, '2025-08-03', 'UPS', '1Z6593664850639875'),
        (3, '2025-09-18', 'FedEx', '847953969991');

    -- SUCCESS
    SET FOREIGN_KEY_CHECKS = 1;
    COMMIT;

    SELECT 'SUCCESS: Beaver Cellars database has been fully reset.' AS message;
END //

DELIMITER ;
