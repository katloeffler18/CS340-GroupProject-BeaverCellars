-- =========================================================
-- Beaver Cellars - Data Manipulation Queries
-- Step 3: SELECT, INSERT, UPDATE, DELETE
-- Based on projectGroup26_Step2_DRAFT.sql
-- Authors: Fuhai Feng and Kat Loeffler
-- =========================================================

-- ===================== SELECT =====================

-- Select Wines table
SELECT wineID, wineName, wineVariety, wineYear, winePrice, grapeRegion FROM Wines;

-- Select Members table
SELECT memberID, memberName, email, city, state, phoneNumber FROM Members;

-- Select CreditCards table
SELECT CreditCards.cardID, Members.memberName, CreditCards.cardName, CreditCards.cardNumber, CreditCards.cardExpirationDate, CreditCards.billingZipCode
FROM CreditCards
JOIN Members ON CreditCards.memberID = Members.memberID;

-- Select Orders table
SELECT Orders.orderID, Members.memberName, CreditCards.cardName, Orders.orderDate, Orders.orderPrice, Orders.hasShipped
FROM Orders
JOIN Members ON Orders.memberID = Members.memberID
JOIN CreditCards ON Orders.cardID = CreditCards.cardID;

-- Select WinesOrders table
SELECT WinesOrders.winesOrdersID, WinesOrders.orderID, Wines.wineName, WinesOrders.wineQuantity, WinesOrders.price
FROM WinesOrders
JOIN Wines ON WinesOrders.wineID = Wines.wineID;

-- Select Shipments table
SELECT Shipments.shipmentID, Orders.orderID, Shipments.shipmentDate, Shipments.carrier, Shipments.trackingNumber
FROM Shipments
JOIN Orders ON Shipments.orderID = Orders.orderID;

-- ===================== INSERT =====================

-- Insert new wine
INSERT INTO Wines (wineName, wineVariety, wineYear, winePrice, grapeRegion)
VALUES (@wineNameInput, @wineVarietyInput, @wineYearInput, @winePriceInput, @grapeRegionInput);

-- Insert new member
INSERT INTO Members (memberName, email, address, city, state, memberZipCode, phoneNumber)
VALUES (@memberNameInput, @emailInput, @addressInput, @cityInput, @stateInput, @zipInput, @phoneInput);

-- Insert new Order
INSERT INTO Orders (memberID, cardID, orderDate, orderPrice, hasShipped)
VALUES (
    (SELECT memberID FROM Members WHERE memberName = @memberNameInput),
    (SELECT cardID FROM CreditCards WHERE cardName = @cardNameInput),
    @orderDateInput, @orderPriceInput, @hasShippedInput
);

-- Insert new shipment
INSERT INTO Shipments (orderID, shipmentDate, carrier, trackingNumber)
VALUES (
    (SELECT orderID FROM Orders WHERE orderNumber = @orderNumberInput),
    @shipmentDateInput, @carrierInput, @trackingInput
);

-- Insert new Order
INSERT INTO WineOrders (orderID, memberID, wineID, wineQuantity, price)
VALUES (
    (SELECT orderID FROM Orders WHERE orderID = @corderIDInput),
    (SELECT memberID FROM Members WHERE memberName = @memberNameInput),
    (SELECT wineID FROM Wines WHERE wineName = @wineNameInput),
    @wineQuantityInput, @priceInput
);

-- ===================== UPDATE =====================

-- Update Wine price
UPDATE Wines SET winePrice = @newPriceInput WHERE wineName = @wineNameInput;

-- Update Order shipping status
UPDATE Orders SET hasShipped = TRUE WHERE orderID = @orderIDInput;

-- Update Member address, city, state, and zip
UPDATE Members
SET address = @newAddressInput, city = @newCityInput, state = @newStateInput, memberZipCode = @newZipInput
WHERE memberName = @memberNameInput;

-- ===================== DELETE =====================

-- Delete order
DELETE FROM Orders WHERE orderID = @orderIDInput;

-- Delete member
DELETE FROM Members WHERE memberName = @memberNameInput;

-- Delete wine
DELETE FROM Wines WHERE wineName = @wineNameInput;

-- Delete wine order
DELETE FROM WinesOrders WHERE wineOrderID = @wineOrderIDInput;
