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
DROP PROCEDURE IF EXISTS sp_delete_creditcard;
DELIMITER //

CREATE PROCEDURE sp_delete_creditcard(IN p_creditcardID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Credit card not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `CreditCards` WHERE `creditCardID` = p_creditcardID;
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
DROP PROCEDURE IF EXISTS sp_delete_wineorder;
DELIMITER //

CREATE PROCEDURE sp_delete_wineorder(IN p_wineorderID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Wine order not deleted.' AS Result;
    END;

    START TRANSACTION;
    DELETE FROM `WinesOrders` WHERE `wineorderID` = p_wineorderID;
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