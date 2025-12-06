/*
# Citation for the following code:
# Date: 2025-12-4
# AI-assisted: Added validation in backend with AI help (ChatGPT)
*/

module.exports = function validateWinesOrder(req, res, next) {
    const { orderID, wineID, wineQuantity } = req.body;

    if (!Number.isInteger(orderID)) {
        return res.status(400).json({ error: "orderID must be an integer." });
    }

    if (!Number.isInteger(wineID)) {
        return res.status(400).json({ error: "wineID must be an integer." });
    }

    if (!Number.isInteger(wineQuantity) || wineQuantity < 1) {
        return res.status(400).json({ error: "wineQuantity must be an integer ≥ 1." });
    }

    // Clients CANNOT send price anymore
    if ("price" in req.body) {
        return res.status(400).json({ error: "price is calculated automatically and cannot be submitted." });
    }

    next();
};
