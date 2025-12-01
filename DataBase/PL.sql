-- Citation for the following code:
-- Date: 2025-11-16
-- Adapted from: SELECT and DELETE procedures are orinigal work of authors. 
-- Source URL: N/A
-- If AI tools were used: Generated with assistance from ChatGPT using prompt "Can you turn this sql code into stored procedures?" and copying in SELECT and DELETE procedures


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
