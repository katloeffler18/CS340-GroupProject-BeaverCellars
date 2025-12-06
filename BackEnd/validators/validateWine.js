/*
# Citation for the following code:
# Date: 2025-12-4
# AI-assisted: Added validation in backend with AI help (ChatGPT)
*/

module.exports = function validateWine(req, res, next) {
    const { wineName, wineVariety, wineYear, winePrice, grapeRegion } = req.body;

    if (!wineName || wineName.trim() === "") {
        return res.status(400).json({ error: "Wine name is required." });
    }

    if (!wineVariety || wineVariety.trim() === "") {
        return res.status(400).json({ error: "Wine variety is required." });
    }

    if (!Number.isInteger(wineYear) || wineYear < 1900 || wineYear > new Date().getFullYear() + 1) {
        return res.status(400).json({ error: "Wine year is invalid." });
    }

    if (isNaN(winePrice) || winePrice <= 0) {
        return res.status(400).json({ error: "Wine price must be a positive number." });
    }

    if (!grapeRegion || grapeRegion.trim() === "") {
        return res.status(400).json({ error: "Grape region is required." });
    }

    next();
};
