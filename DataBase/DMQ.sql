-- =========================================================
-- Beaver Cellars - Data Manipulation Queries
-- Last Updated: 12/5/2025
-- Written in Step 4 format, but consistent with server-side procedures
-- Authors: Fuhai Feng and Kat Loeffler
-- All work is our own
-- =========================================================


-- ===================== SELECT =====================

-- Select Wines table
SELECT wineID, wineName, wineVariety, wineYear, winePrice, grapeRegion
FROM Wines;

-- Select Members table
SELECT memberID, memberName, email, address, city, state, memberZipCode, phoneNumber 
FROM Members;

-- Select CreditCards table
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

-- Select Orders table
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

-- Select WinesOrders table
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

-- Select Shipments table
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


-- ===================== INSERT =====================

-- Insert new wine
INSERT INTO Wines (wineName, wineVariety, wineYear, winePrice, grapeRegion)
VALUES (@wineNameInput, @wineVarietyInput, @wineYearInput, @winePriceInput, @grapeRegionInput);

-- Insert new member
INSERT INTO Members (memberName, email, address, city, state, memberZipCode, phoneNumber)
VALUES (@memberNameInput, @emailInput, @addressInput, @cityInput, @stateInput, @zipInput, @phoneInput);

-- Insert new credit card
INSERT INTO CreditCards (memberID, cardName, cardNumber, cardExpirationDate, billingZipCode)
VALUES (@memberIDInput, @cardNameInput, @cardNumberInput, @cardExpirationDateInput, @billingZipCodeInput);

-- Insert new order 
-- NOTE: orderPrice is NOT inserted manually. It defaults to 0 then is auto-calculated based on add/update to WinesOrders.
INSERT INTO Orders (memberID, cardID, orderDate, orderPrice, hasShipped)
VALUES (@memberIDInput, @cardIDInput, @orderDateInput, 0, @hasShippedInput);

-- Insert new shipment
INSERT INTO Shipments (orderID, shipmentDate, carrier, trackingNumber)
VALUES (@orderIDInput, @shipmentDateInput, @carrierInput, @trackingInput);

-- Insert new wine into an order
-- NOTE: price is NOT manually inserted (auto-calculated by wine price × quantity)
INSERT INTO WinesOrders (orderID, wineID, wineQuantity, price)
VALUES (@orderIDInput, @wineIDInput, @wineQuantityInput);


-- ===================== UPDATE =====================

-- Update Wine
UPDATE Wines
SET wineName = @newWineNameInput,
    wineVariety = @newWineVarietyInput,
    wineYear = @newWineYearInput,
    winePrice = @newPriceInput,
    grapeRegion = @newGrapeRegionInput
WHERE wineID = @wineIDInput;

-- Update Member
UPDATE Members
SET memberName = @newMemberNameInput,
    email = @newEmailInput,
    address = @newAddressInput,
    city = @newCityInput,
    state = @newStateInput,
    memberZipCode = @newZipInput,
    phoneNumber = @newPhoneNumberInput
WHERE memberID = @memberIDInput;

-- Update Credit Card info
UPDATE CreditCards
SET cardName = @newCardNameInput,
    cardNumber = @newCardNumberInput,
    cardExpirationDate = @newCardExpirationDateInput,
    billingZipCode = @newBillingZipInput
WHERE cardID = @cardIDInput;

-- Update ONLY shipping status in Orders
UPDATE Orders
SET hasShipped = @newHasShippedInput
WHERE orderID = @orderIDInput;

-- Update wine in an order
-- NOTE: price automatically recalculated by wine price × quantity
UPDATE WinesOrders
SET wineID = @newWineIDInput,
    wineQuantity = @newWineQuantityInput
WHERE winesOrdersID = @winesOrdersIDInput;


-- ===================== DELETE =====================

-- Delete wine
DELETE FROM Wines WHERE wineID = @wineIDInput;

-- Delete member
DELETE FROM Members WHERE memberID = @memberIDInput;

-- Delete credit card
DELETE FROM CreditCards WHERE cardID = @cardIDInput;

-- Delete order
DELETE FROM Orders WHERE orderID = @orderIDInput;

-- Delete WinesOrders
DELETE FROM WinesOrders WHERE winesOrdersID = @winesOrdersIDInput;

-- Delete shipment
DELETE FROM Shipments WHERE shipmentID = @shipmentIDInput;
