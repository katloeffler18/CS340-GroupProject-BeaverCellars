    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 35827;

    // Middleware to parse JSON request bodies
    app.use(express.json());

    // Define Wines
    app.get('/wines', (req, res) => {
        wine = [{
            wineID: 1,
            wineName: "Iron Orchard",
            wineVariety: "Cabernet Sauvignon",
            wineYear: 2022,
            winePrice: '75.00',
            grapeRegion: "Napa Valley"
        }]
        res.json(wine);
    });

    // Define Members
    app.get('/members', (req, res) => {
        member = [{
            memberID: 1,
            memberName: "Ava Morrison",
            email: "amorrison@email.com",
            address: "3748 Lone Tree Rd",
            city: "Denver",
            state: "CO",
            memberZipCode: "80201",
            phoneNumber: "5035555555"
        }]
        res.json(member);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });