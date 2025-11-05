    const cors = require('cors');
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 35827;

    app.use(express.json());
    app.use(cors());

    // Define Wines
    app.get('/wines', (req, res) => {
        const wines = [{
            wineID: 1,
            wineName: "Iron Orchard",
            wineVariety: "Cabernet Sauvignon",
            wineYear: 2022,
            winePrice: '75.00',
            grapeRegion: "Napa Valley"
        }]
        res.json(wines);
    });

    // Define Members
    app.get('/members', (req, res) => {
        members = [{
            memberID: 1,
            memberName: "Ava Morrison",
            email: "amorrison@email.com",
            address: "3748 Lone Tree Rd",
            city: "Denver",
            state: "CO",
            memberZipCode: "80201",
            phoneNumber: "5035555555"
        }]
        res.json(members);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });