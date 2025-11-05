    const cors = require('cors');
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 35827;

    app.use(express.json());
    app.use(cors());

    // Define Wines
    app.get('/wines', (req, res) => {
        const wines = [
        {
            wineID: 1,
            wineName: "Iron Orchard",
            wineVariety: "Cabernet Sauvignon",
            wineYear: 2022,
            winePrice: '75.00',
            grapeRegion: "Napa Valley"
        },
        {
            wineID: 2,
            wineName: "Rogue Vineyard",
            wineVariety: "Chardonnay",
            wineYear: 2020,
            winePrice: '60.00',
            grapeRegion: "Rogue Valley"
        },
        {
            wineID: 3,
            wineName: "Morning Slate",
            wineVariety: "Pinot Noir",
            wineYear: 2018,
            winePrice: '50.00',
            grapeRegion: "Willamette Valley"
        },
        {
            wineID: 4,
            wineName: "Clear Creek",
            wineVariety: "Pinot Gris",
            wineYear: 2023,
            winePrice: '35.00',
            grapeRegion: "Yakima Valley"
        }
    ]
        res.json(wines);
    });

    // Define Members
    app.get('/members', (req, res) => {
        members = [
        {
            memberID: 1,
            memberName: "Ava Morrison",
            email: "amorrison@email.com",
            address: "3748 Lone Tree Rd",
            city: "Denver",
            state: "CO",
            memberZipCode: "80201",
            phoneNumber: "5035555555"
        },
        {
            memberID: 2,
            memberName: "Jessie Hale",
            email: "jess-hale-18@email.com",
            address: "88821 Church St",
            city: "Nashville",
            state: "TN",
            memberZipCode: "37027",
            phoneNumber: "6155555555"
        },
        {
            memberID: 3,
            memberName: "Lucas Avery",
            email: "lucasavery5@email.com",
            address: "147 Aspen Ct",
            city: "Portland",
            state: "OR",
            memberZipCode: "97203",
            phoneNumber: "3035555555"
        }
        ]
        res.json(members);
    });

    // Define CreditCards
    app.get('/creditcards', (req, res) => {
        creditCards = [
        {
            cardID: 1,
            memberID: 2,
            cardName: "Jessie Hale",
            cardNumber: "1928554249773270",
            cardExpirationDate: "06/01/2027",
            billingZipCode: "37027"
        },
        {
            cardID: 2,
            memberID: 3,
            cardName: "Lauren Avery",
            cardNumber: "6079515370416374",
            cardExpirationDate: "08/01/2028",
            billingZipCode: "97203"
        },
        {
            cardID: 3,
            memberID: 1,
            cardName: "Ava Morrison",
            cardNumber: "4265852982433821",
            cardExpirationDate: "03/01/2027",
            billingZipCode: "80123"
        }
        ]
        res.json(creditCards);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });