// validators/validateCard.js

module.exports = function validateCard(req, res, next) {
    const {cardName, cardNumber, cardExpirationDate, billingZipCode } = req.body;

    if (!cardName || cardName.trim() === "") {
        return res.json(400).json({ error: "Card name is required." });
    }

    const ccRegex = /^\d{15,16}$/;
    if (!ccRegex.test(cardNumber)) {
        return res.status(400).json({ error: "Card number must be 15–16 digits." });
    }

    const today = new Date();
    const exp = new Date(cardExpirationDate);
    if (!(exp instanceof Date) || exp <= today) {
        return res.status(400).json({ error: "Card expiration must be a future date." });
    }

    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(billingZipCode)) {
        return res.status(400).json({ error: "Billing Zipcode must be 5 digits." });
    }

    next();
};
