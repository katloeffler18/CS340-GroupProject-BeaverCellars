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
SELECT memberID, memberName, email, address, city, state, memberZipCode, phoneNumber FROM Members;

-- Select CreditCards table
SELECT CreditCards.cardID, CreditCards.memberID, Members.memberName, CreditCards.cardName, CreditCards.cardNumber, CreditCards.cardExpirationDate, CreditCards.billingZipCode
FROM CreditCards
JOIN Members ON CreditCards.memberID = Members.memberID;

-- Select Orders table
SELECT Orders.orderID, Orders.memberID, Members.memberName, Orders.cardID, CreditCards.cardName, Orders.orderDate, Orders.orderPrice, Orders.hasShipped
FROM Orders
JOIN Members ON Orders.memberID = Members.memberID
JOIN CreditCards ON Orders.cardID = CreditCards.cardID;

-- Select WinesOrders table
SELECT WinesOrders.winesOrdersID, WinesOrders.orderID, Members.memberName, WinesOrders.wineID, Wines.wineName, WinesOrders.wineQuantity, WinesOrders.price
FROM WinesOrders
JOIN Wines ON WinesOrders.wineID = Wines.wineID
JOIN Orders ON WinesOrders.orderID = Orders.orderID
JOIN Members ON Orders.memberID = Members.memberID;

-- Select Shipments table
SELECT Shipments.shipmentID, Shipments.orderID, Members.memberName, Shipments.shipmentDate, Shipments.carrier, Shipments.trackingNumber
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
VALUES (@memberIDinput, @cardNameInput, @cardNumberInput, @cardExpirationDateInput, @billingZipCodeInput);

-- Insert new Order
INSERT INTO Orders (memberID, cardID, orderDate, orderPrice, hasShipped)
VALUES (@memberIDInput, @cardIDInput, @orderDateInput, @orderPriceInput, @hasShippedInput);

-- Insert new shipment
INSERT INTO Shipments (orderID, shipmentDate, carrier, trackingNumber)
VALUES (@orderIDInput, @shipmentDateInput, @carrierInput, @trackingInput);

-- Insert new wine into an order
INSERT INTO WineOrders (orderID, wineID, wineQuantity, price)
VALUES (@corderIDInput, @wineIDInput, @wineQuantityInput, @priceInput);

-- ===================== UPDATE =====================

-- Update Wine
UPDATE Wines 
SET wineName = @newWineNameInput, 
    wineVariety = @newWineVarietyInput, 
    wineYear = @newWineYearInput, 
    winePrice = @newPriceInput,
    grapeRegion = @newGrapeRegionInput
WHERE wineID = @wineIDInput;

-- Update Member address, city, state, and zip
UPDATE Members
SET memberName = @newMemberNameInput,
    email = @newEmailInput,
    address = @newAddressInput, 
    city = @newCityInput, 
    state = @newStateInput, 
    memberZipCode = @newZipInput
    phoneNumber = @newPhoneNumberInput
WHERE memberID = @memberIDInput;

-- Update Credit Card info
UPDATE CreditCards
SET cardName = @newcardNameInput,
    cardNumber = @newcardNumberInput,
    cardExpirationDate = @newcardExpirationDateInput, 
    billingZipCode = @newbillingZipCodeInput, 
WHERE cardID = @cardIDInput;

-- Update Order shipping status
UPDATE Orders 
SET hasShipped = @newHasShippedInput ,
WHERE orderID = @orderIDInput;

-- Update wine in an order
UPDATE WinesOrders
SET wineID = @newWineIDInput,
    wineQuantity = @newWineQuantityInput,
    price = @newPriceInput
WHERE winesOrdersID = @winesOrdersIDInput

-- ===================== DELETE =====================

-- Delete wine
DELETE FROM Wines WHERE wineID = @wineIDInput;

-- Delete member
DELETE FROM Members WHERE memberID = @memberIDInput;

-- Delete credit card
DELETE FROM CreditCards WHERE creditCardID = @creditcardIDInput;

-- Delete order
DELETE FROM Orders WHERE orderID = @orderIDInput;

-- Delete WinesOrders
DELETE FROM WinesOrders WHERE wineOrderID = @wineOrderIDInput;

-- Delete shipment
DELETE FROM Shipments WHERE shipmentID = @shipmentIDInput;
