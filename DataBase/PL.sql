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

-- Delete wine form Wines table
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