const express = require("express");
const { Kafka } = require("kafkajs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    clientId: "app",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "group1" });

// { topic1: [ {id, message, time, details} ] }
let messagesStore = {};

async function initKafka() {
    await consumer.connect();

    // connect admin
    await admin.connect();

    // get all topics
    const topics = await admin.listTopics();

    console.log("Topics from Kafka:", topics);

    // filter internal topics
    const validTopics = topics.filter(t => !t.startsWith("__"));

    // initialize store
    validTopics.forEach(topic => {
        messagesStore[topic] = [];
    });

    // subscribe dynamically
    for (let topic of validTopics) {
        await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const value = message.value.toString();

            const msgObj = {
                id: `${topic}-${message.offset}`,
                message: value,
                time: new Date().toISOString(),
                details: value,
            };

            messagesStore[topic].push(msgObj);
        },
    });
}

const admin = kafka.admin();

async function startServer() {
    await initKafka();   // WAIT for Kafka setup

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}


startServer();


//  API 1: Get all topics
app.get("/topics", (req, res) => {
    res.json(Object.keys(messagesStore));
});


//  API 2: Get messages by topic
app.get("/messages/:topic", (req, res) => {
    const topic = req.params.topic;
    res.json(messagesStore[topic] || []);
});


//  API 3: Get message details
// app.get("/message/:topic/:id", (req, res) => {
//     const { topic, id } = req.params;

//     const msg = (messagesStore[topic] || []).find(
//         (m) => m.id === id
//     );

//     res.json(msg || {});
// });

app.get("/messages", (req, res) => {
    let allMessages = [];

    Object.keys(messagesStore).forEach(topic => {
        const msgs = messagesStore[topic].map(m => ({
            ...m,
            topic
        }));
        allMessages = [...allMessages, ...msgs];
    });

    res.json(allMessages);
});

app.get("/messages", (req, res) => {
    let allMessages = [];

    Object.keys(messagesStore).forEach(topic => {
        const msgs = messagesStore[topic].map(m => ({
            ...m,
            topic
        }));
        allMessages = [...allMessages, ...msgs];
    });

    res.json(allMessages);
});

// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });