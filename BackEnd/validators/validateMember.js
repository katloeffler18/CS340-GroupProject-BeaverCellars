/*
# Citation for the following code:
# Date: 2025-12-4
# AI-assisted: Added validation in backend with AI help (ChatGPT)
*/

module.exports = function validateMember(req, res, next) {
    const { memberName, email, address, city, state, memberZipCode, phoneNumber } = req.body;

    if (!memberName || memberName.trim() === "") {
        return res.status(400).json({ error: "Member name is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    if (!address || address.trim() === "") {
        return res.status(400).json({ error: "Address is required." });
    }

    if (!city || city.trim() === "") {
        return res.status(400).json({ error: "City is required." });
    }

    const stateRegex = /^[A-Z]{2}$/;
    if (!stateRegex.test(state)) {
        return res.status(400).json({ error: "State must be 2 uppercase letters." });
    }

    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(memberZipCode)) {
        return res.status(400).json({ error: "Zipcode must be 5 digits." });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: "Phone number must be 10 digits." });
    }

    next();
};
