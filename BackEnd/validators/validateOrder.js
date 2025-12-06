// validators/validateOrder.js

module.exports = function validateOrder(req, res, next) {
    const { memberID, cardID, orderDate, hasShipped } = req.body;

    if (!Number.isInteger(memberID)) {
        return res.status(400).json({ error: "MemberID must be an integer." });
    }

    if (!Number.isInteger(cardID)) {
        return res.status(400).json({ error: "CardID must be an integer." });
    }

    if (isNaN(Date.parse(orderDate))) {
        return res.status(400).json({ error: "Order date is invalid." });
    }

    if (hasShipped !== true && hasShipped !== false) {
        return res.status(400).json({ error: "hasShipped must be 0 or 1." });
    }

    // Prevent client from adding orderPrice manually
    if ("orderPrice" in req.body) {
        return res.status(400).json({ error: "orderPrice cannot be set manually." });
    }

    next();
};
