/*
# Citation for the following code:
# Date: 2025-11-19
# AI-assisted: Reset database endpoint was generated with AI help (ChatGPT)
# Based on: OSU CS 340 course materials
# Source URL: https://canvas.oregonstate.edu/courses/2017561/assignments/10111722
*/
    
    const cors = require('cors');
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 35827;
    const db = require('./db-connector');


    app.use(express.json());
    app.use(cors());


    // Define Wines
    app.get('/wines', async (req, res) => {
        try {
            const [rows] = await db.query("call sp_get_wines()")
            res.status(200).json(rows[0])

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });


    // Delete wine
    app.delete('/wines/:wineID', async (req, res) => {
        try {
            await db.query(`call sp_delete_wine(${req.params.wineID})`);
            res.status(200).json({ message: 'Wine deleted' });

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });

    // Add new Wine
    app.post('/wines', async (req, res) => {
        const { wineName, wineVariety, wineYear, winePrice, grapeRegion } = req.body;

        try {
            await db.query(
                `CALL sp_insert_wine(?, ?, ?, ?, ?)`,
                [wineName, wineVariety, wineYear, winePrice, grapeRegion]
            );

            const [result] = await db.query("SELECT * FROM Wines ORDER BY wineID DESC LIMIT 1");
            res.status(201).json(result[0]);
            
        } catch (error) {
            console.error("Error inserting wine:", error);
            res.status(500).send("An error occurred while inserting the wine.");
        }
    });

    // Update Wines
    app.put('/wines/:wineID', async (req, res) => {
        const { wineID } = req.params;
        const { wineName, wineVariety, wineYear, winePrice, grapeRegion } = req.body;

        try {
            await db.query(
                `CALL sp_update_wine(?, ?, ?, ?, ?, ?)`,
                [wineID, wineName, wineVariety, wineYear, winePrice, grapeRegion]
            );

            res.status(200).json({ message: 'Wine updated' });
            
        } catch (error) {
            console.error("Error updating wine:", error);
            res.status(500).send("An error occurred while updating the wine.");
        }
    });

    // Get Members
    app.get('/members', async (req, res) => {
        try {
            const [rows] = await db.query("call sp_get_members()")
            res.status(200).json(rows[0])

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });

    // Add new Member
    app.post('/members', async (req, res) => {
        const { memberName, email, address, city, state, memberZipCode, phoneNumber } = req.body;

        try {
            await db.query(
                `CALL sp_insert_member(?, ?, ?, ?, ?, ?, ?)`,
                [memberName, email, address, city, state, memberZipCode, phoneNumber]
            );

            const [result] = await db.query("SELECT * FROM Members ORDER BY memberID DESC LIMIT 1");
            res.status(201).json(result[0]);

        } catch (error) {
            console.error("Error inserting member:", error);
            res.status(500).send("An error occurred while inserting the member.");
        }
    });

    // Update Member
    app.put('/members/:memberID', async (req, res) => {
        const { memberID } = req.params;
        const { memberName, email, address, city, state, memberZipCode, phoneNumber } = req.body;

        try {
            await db.query(
                `CALL sp_update_member(?, ?, ?, ?, ?, ?, ?, ?)`,
                [memberID, memberName, email, address, city, state, memberZipCode, phoneNumber]
            );

            res.status(200).json({ message: 'Member updated' });

        } catch (error) {
            console.error("Error updating member:", error);
            res.status(500).send("An error occurred while updating the member.");
        }
    });


    // Delete member
    app.delete('/members/:memberID', async (req, res) => {
        try {
            await db.query(`call sp_delete_member(${req.params.memberID})`);
            res.status(200).json({ message: 'Member deleted' });

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
        });


    // Get CreditCards
    app.get('/creditcards', async (req, res) => {
        try {
            const [rows] = await db.query("call sp_get_creditcards()")
            res.status(200).json(rows[0])

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });

    // Add Credit Card
    app.post('/creditcards', async (req, res) => {
        const { memberID, cardName, cardNumber, cardExpirationDate, billingZipCode } = req.body;

        try {
            await db.query(
                `CALL sp_insert_card(?, ?, ?, ?, ?)`,
                [memberID, cardName, cardNumber, cardExpirationDate, billingZipCode]
            );

            const [result] = await db.query("SELECT * FROM CreditCards ORDER BY cardID DESC LIMIT 1");
            res.status(201).json(result[0]);

        } catch (error) {
            console.error("Error inserting credit card:", error);
            res.status(500).send("An error occurred while inserting the credit card.");
        }
    });


    // Update Credit Card
    app.put('/creditcards/:cardID', async (req, res) => {
        const { cardID } = req.params;
        const { memberID, cardName, cardNumber, cardExpirationDate, billingZipCode } = req.body;

        try {
            await db.query(
                `CALL sp_update_card(?, ?, ?, ?, ?, ?)`,
                [cardID, memberID, cardName, cardNumber, cardExpirationDate, billingZipCode]
            );

            res.status(200).json({ message: 'Credit card updated' });

        } catch (error) {
            console.error("Error updating credit card:", error);
            res.status(500).send("An error occurred while updating the credit card.");
        }
    });


    // Delete credit card
    app.delete('/creditcards/:cardID', async (req, res) => {
        try {
            await db.query(`call sp_delete_card(${req.params.cardID})`);
            res.status(200).json({ message: 'Credit card deleted' });

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
        });


    // Get Orders
    app.get('/orders', async(req, res) => {
        try {
            const [rows] = await db.query("call sp_get_orders()")
            res.status(200).json(rows[0])

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });


    // Add new Order
    app.post('/orders', async (req, res) => {
        const { memberID, cardID, orderDate, orderPrice, hasShipped } = req.body;

        try {
            await db.query(
                `CALL sp_insert_order(?, ?, ?, ?, ?)`,
                [memberID, cardID, orderDate, orderPrice, hasShipped]
            );

            const [result] = await db.query("SELECT * FROM Orders ORDER BY orderID DESC LIMIT 1");
            res.status(201).json(result[0]);

        } catch (error) {
            console.error("Error inserting order:", error);
            res.status(500).send("An error occurred while inserting the order.");
        }
    });
    

    // Update Order
    app.put('/orders/:orderID', async (req, res) => {
        const { orderID } = req.params;
        const { memberID, cardID, orderDate, orderPrice, hasShipped } = req.body;

        try {
            await db.query(
                `CALL sp_update_order(?, ?, ?, ?, ?, ?)`,
                [orderID, memberID, cardID, orderDate, orderPrice, hasShipped]
            );

            res.status(200).json({ message: 'Order updated' });

        } catch (error) {
            console.error("Error updating order:", error);
            res.status(500).send("An error occurred while updating the order.");
        }
    });


    // Delete order
    app.delete('/orders/:orderID', async (req, res) => {
        try {
            await db.query(`call sp_delete_order(${req.params.orderID})`);
            res.status(200).json({ message: 'Order deleted' });

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
        });


    // Get WinesOrders
    app.get('/winesorders', async (req, res) => {
        try {
            const [rows] = await db.query("call sp_get_winesorders()")
            res.status(200).json(rows[0])

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });


    // Add Wine Order
    app.post('/winesorders', async (req, res) => {
        const { orderID, wineID, wineQuantity, price } = req.body;

        try {
            await db.query(
                `CALL sp_insert_winesorder(?, ?, ?, ?)`,
                [orderID, wineID, wineQuantity, price]
            );

            const [result] = await db.query("SELECT * FROM WinesOrders ORDER BY winesOrdersID DESC LIMIT 1");
            res.status(201).json(result[0]);

        } catch (error) {
            console.error("Error inserting wine order:", error);
            res.status(500).send("An error occurred while inserting the wine order.");
        }
    });


    // Update Wine Order
    app.put('/winesorders/:winesOrdersID', async (req, res) => {
        const { winesOrdersID } = req.params;
        const { orderID, wineID, wineQuantity, price } = req.body;

        try {
            await db.query(
                `CALL sp_update_winesorder(?, ?, ?, ?, ?)`,
                [winesOrdersID, orderID, wineID, wineQuantity, price]
            );

            res.status(200).json({ message: 'Wine order updated' });

        } catch (error) {
            console.error("Error updating wine order:", error);
            res.status(500).send("An error occurred while updating the wine order.");
        }
    });


    // Delete wine order
    app.delete('/winesorders/:winesOrdersID', async (req, res) => {
        try {
            await db.query(`call sp_delete_winesorder(${req.params.winesOrdersID})`);
            res.status(200).json({ message: 'Wine order deleted' });

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
        });

    
    // Get Shipments
    app.get('/shipments', async (req, res) => {
        try {
            const [rows] = await db.query("call sp_get_shipments()")
            res.status(200).json(rows[0])

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
    });

    
    // Add Shipment
    app.post('/shipments', async (req, res) => {
        const { orderID, shipmentDate, carrier, trackingNumber } = req.body;

        try {
            await db.query(
                `CALL sp_insert_shipment(?, ?, ?, ?)`,
                [orderID, shipmentDate, carrier, trackingNumber]
            );

            const [result] = await db.query("SELECT * FROM Shipments ORDER BY shipmentID DESC LIMIT 1");
            res.status(201).json(result[0]);

        } catch (error) {
            console.error("Error inserting shipment:", error);
            res.status(500).send("An error occurred while inserting the shipment.");
        }
    });


    // Delete shipment
    app.delete('/shipments/:shipmentID', async (req, res) => {
        try {
            await db.query(`call sp_delete_shipment(${req.params.shipmentID})`);
            res.status(200).json({ message: 'Shipment deleted' });

        } catch (error) {
            console.error("Error executing queries:", error);
            res.status(500).send("An error occurred while executing the database queries.");
        }
        });


    // Reset database
    app.post('/reset-database', async (req, res) => {
        try {
            const [rows] = await db.query("CALL ResetBeaverCellars()");
            res.status(200).json({
                message: "Database reset successfully",
                result: rows
            });
        } catch (error) {
            console.error("Error resetting database:", error);
            res.status(500).send("An error occurred while resetting the database.");
        }
    });


    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });