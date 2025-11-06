    const cors = require('cors');
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 35827;

    app.use(express.json());
    app.use(cors());

    // List of wines
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

    // Define Wines
    app.get('/wines', (req, res) => {
        res.json(wines);
    });

    // Delete wine
    app.delete('/wines/:wineID', (req, res) => {
        res.status(200).json({ message: 'Wine deleted' });
    });

    // List of members
    const members = [
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
    
    // Define Members
    app.get('/members', (req, res) => {
        res.json(members);
    });

    // Delete member
    app.delete('/members/:memberID', (req, res) => {
        res.status(200).json({ message: 'Member deleted' });
        });

    // List of credit cards
    const creditCards = [
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

    // Define CreditCards
    app.get('/creditcards', (req, res) => {
        res.json(creditCards);
    });

    // Delete credit card
    app.delete('/creditcards/:cardID', (req, res) => {
        res.status(200).json({ message: 'Credit Card deleted' });
        });

    // List of orders
    const orders = [
        {
            orderID: 1,
            memberID: 2,
            cardID: 1,
            orderDate: "3/13/2025",
            orderPrice: "$75.00",
            hasShipped: "True"
        },
        {
            orderID: 2,
            memberID: 1,
            cardID: 3,
            orderDate: "7/25/2025",
            orderPrice: "$95.00",
            hasShipped: "True"
        },
        {
            orderID: 3,
            memberID: 3,
            cardID: 2,
            orderDate: "9/9/2025",
            orderPrice: "$100.00",
            hasShipped: "True"
        },
        {
            orderID: 4,
            memberID: 1,
            cardID: 3,
            orderDate: "10/31/202",
            orderPrice: "$150.00",
            hasShipped: "False"
        }
    ]

    // Define Orders
    app.get('/orders', (req, res) => {
        res.json(orders);
    });

    // Delete order
    app.delete('/orders/:orderID', (req, res) => {
        res.status(200).json({ message: 'Order deleted' });
        });

    // List of wines in orders
    const winesOrders = [
        {
            winesOrdersID: 1,
            orderID: 1,
            wineID: 1,
            wineQuantity: 1,
            price: "75.00"
        },
        {
            winesOrdersID: 2,
            orderID: 2,
            wineID: 2,
            wineQuantity: 1,
            price: "60.00"
        },
        {
            winesOrdersID: 3,
            orderID: 2,
            wineID: 4,
            wineQuantity: 1,
            price: "35.00"
        },
        {
            winesOrdersID: 4,
            orderID: 3,
            wineID: 3,
            wineQuantity: 2,
            price: "100.00"
        },
        {
            winesOrdersID: 5,
            orderID: 4,
            wineID: 1,
            wineQuantity: 2,
            price: "150.00"
        }
    ]

    // Define WinesOrders
    app.get('/winesorders', (req, res) => {
        res.json(winesOrders);
    });

    // Delete wine order
    app.delete('/winesorders/:winesOrdersID', (req, res) => {
        res.status(200).json({ message: 'Wine deleted from order' });
        });

    // List of shipments
    const shipments = [
        {
            shipmentID: 1,
            orderID: 1,
            shipmentDate: "3/23/2025",
            carrier: "UPS",
            trackingNumber: "1Z5727545669644096"
        },
        {
            shipmentID: 2,
            orderID: 2,
            shipmentDate: "8/3/2025",
            carrier: "UPS",
            trackingNumber: "1Z6593664850639875"
        },
        {
            shipmentID: 3,
            orderID: 3,
            shipmentDate: "9/18/2025",
            carrier: "FedEx",
            trackingNumber: "847953969991"
        }
    ]
    
    // Define Shipments
    app.get('/shipments', (req, res) => {
        res.json(shipments);
    });

    // Delete shipment
    app.delete('/shipments/:shipmentID', (req, res) => {
        res.status(200).json({ message: 'Shipment deleted' });
        });


    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });