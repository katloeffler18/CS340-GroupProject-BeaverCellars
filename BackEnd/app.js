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


    // Delete credit card
    app.delete('/creditcards/:cardID', async (req, res) => {
        try {
            await db.query(`call sp_delete_creditcard(${req.params.creditCardID})`);
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


    // Delete wine order
    app.delete('/winesorders/:winesOrdersID', (req, res) => {
        res.status(200).json({ message: 'Wine deleted from order' });
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


    // Delete shipment
    app.delete('/shipments/:shipmentID', (req, res) => {
        res.status(200).json({ message: 'Shipment deleted' });
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