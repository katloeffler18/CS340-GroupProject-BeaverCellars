-- Citation for the following code:
-- Date: 2025-11-16
-- Adapted from: SELECT and DELETE procedures are orinigal work of authors. 
-- Source URL: N/A
-- If AI tools were used: Generated with assistance from ChatGPT using prompt "Can you turn this sql code into stored procedures?" 
-- and copying in SELECT and DELETE procedures


-- ===========================================
-- SELECTS
-- ===========================================

-- Procedure: Get all wines
DROP PROCEDURE IF EXISTS sp_get_wines;
DELIMITER //
CREATE PROCEDURE sp_get_wines()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 'Error occurred in sp_get_wines' AS error_message;
    END;

    SELECT wineID, wineName, wineVariety, wineYear, winePrice, grapeRegion 
    FROM Wines;
END //
DELIMITER ;


-- Procedure: Get all members
DROP PROCEDURE IF EXISTS sp_get_members;
DELIMITER //
CREATE PROCEDURE sp_get_members()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 'Error occurred in sp_get_members' AS error_message;
    END;

    SELECT memberID, memberName, email, address, city, state, memberZipCode, phoneNumber
    FROM Members;
END //
DELIMITER ;


-- Procedure: Get all credit cards with member
DROP PROCEDURE IF EXISTS sp_get_creditcards;
DELIMITER //
CREATE PROCEDURE sp_get_creditcards()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 'Error occurred in sp_get_creditcards' AS error_message;
    END;

    SELECT 
        CreditCards.cardID, 
        CreditCards.memberID, 
        Members.memberName, 
        CreditCards.cardName, 
        CreditCards.cardNumber, 
        CreditCards.cardExpirationDate, 
        CreditCards.billingZipCode
    FROM CreditCards
    JOIN Members ON CreditCards.memberID = Members.memberID;
END //
DELIMITER ;


-- Procedure: Get all orders with member/card info
DROP PROCEDURE IF EXISTS sp_get_orders;
DELIMITER //
CREATE PROCEDURE sp_get_orders()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 'Error occurred in sp_get_orders' AS error_message;
    END;

    SELECT 
        Orders.orderID, 
        Orders.memberID, 
        Members.memberName, 
        Orders.cardID, 
        CreditCards.cardName, 
        Orders.orderDate, 
        Orders.orderPrice, 
        Orders.hasShipped
    FROM Orders
    JOIN Members ON Orders.memberID = Members.memberID
    JOIN CreditCards ON Orders.cardID = CreditCards.cardID;
END //
DELIMITER ;


-- Procedure: Get all wine orders with wine & member info
DROP PROCEDURE IF EXISTS sp_get_winesorders;
DELIMITER //
CREATE PROCEDURE sp_get_winesorders()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 'Error occurred in sp_get_winesorders' AS error_message;
    END;

    SELECT 
        WinesOrders.winesOrdersID, 
        WinesOrders.orderID, 
        Members.memberName, 
        WinesOrders.wineID, 
        Wines.wineName, 
        WinesOrders.wineQuantity, 
        WinesOrders.price
    FROM WinesOrders
    JOIN Wines ON WinesOrders.wineID = Wines.wineID
    JOIN Orders ON WinesOrders.orderID = Orders.orderID
    JOIN Members ON Orders.memberID = Members.memberID;
END //
DELIMITER ;


-- Procedure: Get all shipments with member info
DROP PROCEDURE IF EXISTS sp_get_shipments;
DELIMITER //
CREATE PROCEDURE sp_get_shipments()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 'Error occurred in sp_get_shipments' AS error_message;
    END;

    SELECT 
        Shipments.shipmentID, 
        Shipments.orderID, 
        Members.memberName, 
        Shipments.shipmentDate, 
        Shipments.carrier, 
        Shipments.trackingNumber
    FROM Shipments
    JOIN Orders ON Shipments.orderID = Orders.orderID
    JOIN Members ON Orders.memberID = Members.memberID;
END //
DELIMITER ;


-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Helper function to calculate order price total based on wines in WinesOrders
DROP PROCEDURE IF EXISTS sp_recalculate_order_total;
DELIMITER //

CREATE PROCEDURE sp_recalculate_order_total(IN p_orderID INT)
BEGIN
    DECLARE total DECIMAL(10,2);

    SELECT COALESCE(SUM(price), 0)
    INTO total
    FROM WinesOrders
    WHERE orderID = p_orderID;

    UPDATE Orders
    SET orderPrice = total
    WHERE orderID = p_orderID;
END //

DELIMITER ;


-- ===========================================
-- DELETES
-- ===========================================

-- Delete wine from Wines table
DROP PROCEDURE IF EXISTS sp_delete_wine;
DELIMITER //

CREATE PROCEDURE sp_delete_wine(IN p_wineID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `Wines` WHERE `wineID` = p_wineID;
    COMMIT;

    SELECT 'Wine deleted' AS Result;
END //
DELIMITER ;


-- Delete member from Members table
DROP PROCEDURE IF EXISTS sp_delete_member;
DELIMITER //

CREATE PROCEDURE sp_delete_member(IN p_memberID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Member not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `Members` WHERE `memberID` = p_memberID;
    COMMIT;

    SELECT 'Member deleted' AS Result;
END //
DELIMITER ;


-- Delete credit card from CreditCards table
DROP PROCEDURE IF EXISTS sp_delete_card;
DELIMITER //

CREATE PROCEDURE sp_delete_card(IN p_cardID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Credit card not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `CreditCards` WHERE `cardID` = p_cardID;
    COMMIT;

    SELECT 'Credit card deleted' AS Result;
END //
DELIMITER ;


-- Delete order from Orders table
DROP PROCEDURE IF EXISTS sp_delete_order;
DELIMITER //

CREATE PROCEDURE sp_delete_order(IN p_orderID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Order not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `Orders` WHERE `orderID` = p_orderID;
    COMMIT;

    SELECT 'Order deleted' AS Result;
END //
DELIMITER ;


-- Delete wine order from WinesOrders table
DROP PROCEDURE IF EXISTS sp_delete_winesorders;
DELIMITER //

CREATE PROCEDURE sp_delete_winesorders(IN p_winesOrdersID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine order not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `WinesOrders` WHERE `winesOrdersID` = p_winesOrdersID;
    COMMIT;

    SELECT 'Wine order deleted' AS Result;
END //
DELIMITER ;


-- Delete shipment from Shipments table
DROP PROCEDURE IF EXISTS sp_delete_shipment;
DELIMITER //

CREATE PROCEDURE sp_delete_shipment(IN p_shipmentID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Shipment not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `Shipments` WHERE `shipmentID` = p_shipmentID;
    COMMIT;

    SELECT 'Shipment deleted' AS Result;
END //
DELIMITER ;

-- ===========================================
-- Inserts
-- ===========================================

-- Insert a new wine into Wines table
DROP PROCEDURE IF EXISTS sp_insert_wine;
DELIMITER //

CREATE PROCEDURE sp_insert_wine(
    IN p_wineName VARCHAR(100),
    IN p_wineVariety VARCHAR(50),
    IN p_wineYear INT,
    IN p_winePrice DECIMAL(6,2),
    IN p_grapeRegion VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine not inserted.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Wines (wineName, wineVariety, wineYear, winePrice, grapeRegion)
    VALUES (p_wineName, p_wineVariety, p_wineYear, p_winePrice, p_grapeRegion);

    COMMIT;

    SELECT 'Wine inserted successfully' AS Result;
END //

DELIMITER ;

-- Insert a new member into Members
DROP PROCEDURE IF EXISTS sp_insert_member;
DELIMITER //

CREATE PROCEDURE sp_insert_member(
    IN p_memberName VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(50),
    IN p_memberZipCode VARCHAR(20),
    IN p_phoneNumber VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Member not inserted.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Members (memberName, email, address, city, state, memberZipCode, phoneNumber)
    VALUES (p_memberName, p_email, p_address, p_city, p_state, p_memberZipCode, p_phoneNumber);

    COMMIT;

    SELECT 'Member inserted successfully' AS Result;
END //

DELIMITER ;


-- Insert a new card into CreditCards
DROP PROCEDURE IF EXISTS sp_insert_card;
DELIMITER //

CREATE PROCEDURE sp_insert_card(
    IN p_memberID INT,
    IN p_cardName VARCHAR(100),
    IN p_cardNumber VARCHAR(50),
    IN p_cardExpirationDate DATE,
    IN p_billingZipCode VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Card not inserted.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO CreditCards (memberID, cardName, cardNumber, cardExpirationDate, billingZipCode)
    VALUES (p_memberID, p_cardName, p_cardNumber, p_cardExpirationDate, p_billingZipCode);

    COMMIT;

    SELECT 'Card inserted successfully' AS Result;
END //

DELIMITER ;


-- Insert a new order into Orders
DROP PROCEDURE IF EXISTS sp_insert_order;
DELIMITER //

CREATE PROCEDURE sp_insert_order(
    IN p_memberID INT,
    IN p_cardID INT,
    IN p_orderDate DATE,
    IN p_orderPrice DECIMAL(10,2),
    IN p_hasShipped TINYINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Order not inserted.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Orders (memberID, cardID, orderDate, orderPrice, hasShipped)
    VALUES (p_memberID, p_cardID, p_orderDate, p_orderPrice, p_hasShipped);

    COMMIT;

    SELECT 'Order inserted successfully' AS Result;
END //

DELIMITER ;


-- Trigger to calculate price of wines in WinesOrders based on quantity
DROP TRIGGER IF EXISTS trg_winesorders_price_insert;
DELIMITER //
CREATE TRIGGER trg_winesorders_price_insert
BEFORE INSERT ON WinesOrders
FOR EACH ROW
BEGIN
    DECLARE base_price DECIMAL(10,2);

    SELECT winePrice INTO base_price
    FROM Wines
    WHERE wineID = NEW.wineID;

    SET NEW.price = base_price * NEW.wineQuantity;
END //
DELIMITER ;


-- Insert a new wine into WinesOrders
DROP PROCEDURE IF EXISTS sp_insert_winesorder;
DELIMITER //

CREATE PROCEDURE sp_insert_winesorder(
    IN p_orderID INT,
    IN p_wineID INT,
    IN p_wineQuantity INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine order not inserted.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO WinesOrders (orderID, wineID, wineQuantity)
    VALUES (p_orderID, p_wineID, p_wineQuantity);

    COMMIT;

    SELECT 'Wine order inserted successfully' AS Result;
END //

DELIMITER ;


-- Add new shipment to Shipments
DROP PROCEDURE IF EXISTS sp_insert_shipment;
DELIMITER //

CREATE PROCEDURE sp_insert_shipment(
    IN p_orderID INT,
    IN p_shipmentDate DATE,
    IN p_carrier VARCHAR(100),
    IN p_trackingNumber VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Shipment not inserted.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Shipments (orderID, shipmentDate, carrier, trackingNumber)
    VALUES (p_orderID, p_shipmentDate, p_carrier, p_trackingNumber);

    COMMIT;

    SELECT 'Shipment inserted successfully' AS Result;
END //

DELIMITER ;


-- ===========================================
-- Updates
-- ===========================================

-- Update an existing wine
DROP PROCEDURE IF EXISTS sp_update_wine;
DELIMITER //

CREATE PROCEDURE sp_update_wine(
    IN p_wineID INT,
    IN p_wineName VARCHAR(100),
    IN p_wineVariety VARCHAR(50),
    IN p_wineYear INT,
    IN p_winePrice DECIMAL(6,2),
    IN p_grapeRegion VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine not updated.' AS Result;
    END;

    START TRANSACTION;

    UPDATE Wines
    SET 
        wineName = p_wineName,
        wineVariety = p_wineVariety,
        wineYear = p_wineYear,
        winePrice = p_winePrice,
        grapeRegion = p_grapeRegion
    WHERE wineID = p_wineID;

    COMMIT;

    SELECT 'Wine updated successfully' AS Result;
END //

DELIMITER ;

-- Update an existing member
DROP PROCEDURE IF EXISTS sp_update_member;
DELIMITER //

CREATE PROCEDURE sp_update_member(
    IN p_memberID INT,
    IN p_memberName VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(50),
    IN p_memberZipCode VARCHAR(20),
    IN p_phoneNumber VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Member not updated.' AS Result;
    END;

    START TRANSACTION;

    UPDATE Members
    SET
        memberName = p_memberName,
        email = p_email,
        address = p_address,
        city = p_city,
        state = p_state,
        memberZipCode = p_memberZipCode,
        phoneNumber = p_phoneNumber
    WHERE memberID = p_memberID;

    COMMIT;

    SELECT 'Member updated successfully' AS Result;
END //

DELIMITER ;

-- Update an existing Credit Card
DROP PROCEDURE IF EXISTS sp_update_card;
DELIMITER //

CREATE PROCEDURE sp_update_card(
    IN p_cardID INT,
    IN p_memberID INT,
    IN p_cardName VARCHAR(100),
    IN p_cardNumber VARCHAR(50),
    IN p_cardExpirationDate DATE,
    IN p_billingZipCode VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Card not updated.' AS Result;
    END;

    START TRANSACTION;

    UPDATE CreditCards
    SET
        cardName = p_cardName,
        cardNumber = p_cardNumber,
        cardExpirationDate = p_cardExpirationDate,
        billingZipCode = p_billingZipCode
    WHERE cardID = p_cardID;

    COMMIT;

    SELECT 'Card updated successfully' AS Result;
END //

DELIMITER ;


-- Update existing order
DROP PROCEDURE IF EXISTS sp_update_order;
DELIMITER //

CREATE PROCEDURE sp_update_order(
    IN p_orderID INT,
    IN p_hasShipped TINYINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Order not updated.' AS Result;
    END;

    START TRANSACTION;

    UPDATE Orders
    SET
        hasShipped = p_hasShipped
    WHERE orderID = p_orderID;

    COMMIT;

    SELECT 'Order updated successfully' AS Result;
END //

DELIMITER ;


-- Trigger to update price of wines in WinesOrders based on quantity
DROP TRIGGER IF EXISTS trg_winesorders_price_update;
DELIMITER //
CREATE TRIGGER trg_winesorders_price_update
BEFORE UPDATE ON WinesOrders
FOR EACH ROW
BEGIN
    DECLARE base_price DECIMAL(10,2);

    SELECT winePrice INTO base_price
    FROM Wines
    WHERE wineID = NEW.wineID;

    SET NEW.price = base_price * NEW.wineQuantity;
END //
DELIMITER ;


-- Update wine in WinesOrders
DROP PROCEDURE IF EXISTS sp_update_winesorder;
DELIMITER //

CREATE PROCEDURE sp_update_winesorder(
    IN p_winesOrdersID INT,
    IN p_orderID INT,
    IN p_wineID INT,
    IN p_wineQuantity INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine order not updated.' AS Result;
    END;

    START TRANSACTION;

    UPDATE WinesOrders
    SET
        orderID = p_orderID,
        wineID = p_wineID,
        wineQuantity = p_wineQuantity
    WHERE winesOrdersID = p_winesOrdersID;

    COMMIT;

    SELECT 'Wine order updated successfully' AS Result;
END //

DELIMITER ;


-- ===========================================
-- FINAL ORDER TOTAL TRIGGERS (AFTER INSERT, UPDATE, DELETE)
-- ===========================================

-- Trigger to calculate order total after insert into WinesOrders
DROP TRIGGER IF EXISTS trg_order_total_after_insert;
DELIMITER //
CREATE TRIGGER trg_order_total_after_insert
AFTER INSERT ON WinesOrders
FOR EACH ROW
BEGIN
    CALL sp_recalculate_order_total(NEW.orderID);
END //
DELIMITER ;


-- Trigger to recalculate order total after an update to WinesOrders
DROP TRIGGER IF EXISTS trg_order_total_after_update;
DELIMITER //
CREATE TRIGGER trg_order_total_after_update
AFTER UPDATE ON WinesOrders
FOR EACH ROW
BEGIN
    CALL sp_recalculate_order_total(NEW.orderID);
END //
DELIMITER ;


-- Trigger to recalculate order total after delete in WinesOrders
DROP TRIGGER IF EXISTS trg_order_total_after_delete;
DELIMITER //
CREATE TRIGGER trg_order_total_after_delete
AFTER DELETE ON WinesOrders
FOR EACH ROW
BEGIN
    CALL sp_recalculate_order_total(OLD.orderID);
END //
DELIMITER ;
