const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const app = express();

const fs = require("fs");

const parseTime = require("./utils/parseTime.cjs");

const usersOnlineFile = "/data/usersOnline.json";
const messageDataFile = "/data/messageData.json";

app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: "asecretivekey12369",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Helper Functions

function getFileData(file) {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return [];
        }
        data = JSON.parse(data);
        return data;
    })
}

function updateFileData(file, updatedData) {
    fs.writeFile(file, JSON.stringify(updatedData, null, 2), "utf-8", (err) => {
        if (err) {
            console.error(err);
        }
    });
}

function addOnlineUser(username) {
    let data = getFileData(usersOnlineFile);
    data.push(username);
    updateFileData(usersOnlineFile, data);
}

// POST requests

app.post("/uploadMessage", (req, res) => {
    const { username, msg } = req.body;
    let time = parseTime(new Date().toLocaleTimeString());
    const newMessage = {
        id: Date.now(),
        time,
        username,
        msg
    };
    messages.push(newMessage);
    res.status(201).json({ message: `Pushed ${username}'s message` });
});

app.post("/login", (req, res) => {
    const { username } = req.body;
    console.log("Received login request for", username);
    if (!usersOnline.includes(username)) {
        usersOnline.push(username);
        req.session.userId = username;
        res.status(200).json({ message: `Logged in successfully as ${username}.` });
    } else {
        res.status(400);
    }
});

app.get("/authenticate", (req, res) => {
    console.log(`${req.session.userId} attempting to authenticate.`);
    if (req.session.userId) {
        res.status(200);
    } else {
        res.status(400);
    }
})

// GET requests

app.get("/getMessages", (req, res) => {
    res.json([]);
    // res.json(messages);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});