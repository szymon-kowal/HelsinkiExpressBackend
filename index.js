const express = require("express");
let morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const data = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("postJSON", function (req, res) {
    if (req.method === "POST") {
        if (
            req.headers["content-type"] &&
            req.headers["content-type"].includes("application/json")
        ) {
            return JSON.stringify(req.body);
        }
        return "Not JSON";
    }
    return null;
});

app.use(cors());

app.use(express.json());

// app.use(requestLogger);

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :postJSON"
    )
);

// app.use(requestLogger);

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/api/persons", (req, res) => {
    res.send(data);
});

app.get("/api/persons/:id", (req, res) => {
    const reqId = req.params.id;
    const foundPerson = data.find((person) => person.id === reqId);
    if (foundPerson === undefined) {
        res.status(404).send(`Person with id : ${reqId} not found :c`);
    }
    res.send(foundPerson);
});

app.delete("/api/persons/:id", (req, res) => {
    console.log(req.params);
    const reqId = req.params.id;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == reqId) {
            const [deletedUser] = data.splice(i, 1);
            res.status(200).send(deletedUser);
            console.log(data);
            return;
        }
    }
    res.status(404).send("User not found");
});

app.post("/api/persons", (req, res) => {
    const { name: reqName, number: reqNumber } = req.body;
    if (!reqName || !reqNumber) {
        return res.status(400).json({ error: "Name and number are required" });
    }
    const isDuplicatedName = data.find((person) => person.name === reqName);
    if (isDuplicatedName !== undefined) {
        return res.status(400).json({ error: "name must be unique" });
    }
    const newId = Math.floor(Math.random() * 2000);
    const newPerson = { id: newId, name: reqName, number: reqNumber };
    data.push(newPerson);
    res.status(200).send(newPerson);
});

app.get("/info", (req, res) => {
    res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My HTML Response</title>
            </head>
            <body>
                <h1>Phonebook has info for ${data.length} people</h1>
                <p>${new Date()}</p>
            </body>
            </html>
        `);
});

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
