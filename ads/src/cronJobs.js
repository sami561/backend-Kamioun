// cronJobs.js
require('dotenv').config();
const cron = require("node-cron");
const axios = require("axios");

const apiKey = process.env.API_KEY;
const baseURL = process.env.BASE_URL;

const servicesClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
    },
});

// Health Check
cron.schedule("* * * * *", async () => {
    try {
        console.info("Cron is Working ", Date());
    } catch (error) {
        console.error(error);
    }
});

// Midnight Crons
cron.schedule("0 0 0 * * *", async () => {
    try {
        await servicesClient.post("/api/typesense/populateOrdersCollection");
    } catch (error) {
        console.error(error);
    }
});

cron.schedule('0 0 2 * * *', async () => {
    try {
        await servicesClient.post("/api/typesense/analytics/nucCollections/nucPreviousMonthsCollection/populateCollection");
    } catch (error) {
        console.error(error);
    }
});

cron.schedule('0 0 2 * * *', async () => {
    try {
        await servicesClient.post("/api/typesense/analytics/gmvCollections/gmvPreviousMonthsCollection/populateCollection");
    } catch (error) {
        console.error(error);
    }
});

cron.schedule('0 0 2 * * *', async () => {
    try {
        await servicesClient.post("/api/typesense/analytics/gmvCollections/gmvPreviousDaysCollection/populateCollection");
    } catch (error) {
        console.error(error);
    }
});
