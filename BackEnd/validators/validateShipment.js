/*
# Citation for the following code:
# Date: 2025-12-4
# AI-assisted: Added validation in backend with AI help (ChatGPT)
*/

module.exports = function validateShipment(req, res, next) {
    const { orderID, shipmentDate, carrier, trackingNumber } = req.body;

    if (!Number.isInteger(orderID)) {
        return res.status(400).json({ error: "orderID must be an integer." });
    }

    if (isNaN(Date.parse(shipmentDate))) {
        return res.status(400).json({ error: "Invalid shipment date." });
    }

    if (!carrier || carrier.trim() === "") {
        return res.status(400).json({ error: "Carrier is required." });
    }

    if (!trackingNumber || trackingNumber.trim() === "") {
        return res.status(400).json({ error: "Tracking number is required." });
    }

    next();
};
