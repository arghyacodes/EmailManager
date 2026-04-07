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

const producer = kafka.producer();

// { topic1: [ {id, message, time, details} ] }
let messagesStore = {};

const admin = kafka.admin();

async function initKafka() {
    await consumer.connect();
    await producer.connect();
    await admin.connect();

    const topics = await admin.listTopics();

    const validTopics = topics.filter(t => !t.startsWith("__"));

    validTopics.forEach(topic => {
        messagesStore[topic] = [];
    });

    for (let topic of validTopics) {
        await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const value = message.value.toString();

            messagesStore[topic].push({
                id: `${topic}-${message.offset}`,
                message: value,
                time: new Date().toISOString(),
                details: value,
            });
        },
    });
}


async function startServer() {
    await initKafka();   // WAIT for Kafka setup

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}


startServer();

async function getTopicFromKey(key) {
    const topics = await admin.listTopics();
    const validTopics = topics.filter(t => !t.startsWith("__"));

    if (validTopics.includes(key)) {
        return key;
    }

    // create topic
    await admin.createTopics({
        topics: [{
            topic: key,
            numPartitions: 1,
            replicationFactor: 1
        }]
    });

    console.log("🆕 New Created topic:", key);

    // update backend state
    messagesStore[key] = [];

    // restart consumer safely
    await consumer.stop();

    await consumer.subscribe({ topic: key, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const value = message.value.toString();

            if (!messagesStore[topic]) {
                messagesStore[topic] = [];
            }

            messagesStore[topic].push({
                id: `${topic}-${message.offset}`,
                message: value,
                time: new Date().toISOString(),
                details: value,
            });
        },
    });

    return key;
}


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
// app.get("/messages", (req, res) => {
//     let allMessages = [];

//     Object.keys(messagesStore).forEach(topic => {
//         const msgs = messagesStore[topic].map(m => ({
//             ...m,
//             topic
//         }));
//         allMessages = [...allMessages, ...msgs];
//     });

//     res.json(allMessages);
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

app.post("/send", async (req, res) => {
    const { key, message } = req.body;

    try {
        const topic = await getTopicFromKey(key);

        await producer.send({
            topic,
            messages: [
                {
                    key,
                    value: message,
                },
            ],
        });

        res.json({ status: "sent", topic });
    } catch (err) {
        res.status(500).send("Error sending message");
    }
});