require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/note");
const app = express();
const PORT = process.env.PORT || 3001;

const data = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

// Morgan custom token
morgan.token("postJSON", function (req, res) {
    if (req.method === "POST") {
        if (
            req.headers["content-type"] &&
            req.headers["content-type"].includes("application/json")
        ) {
            return JSON.stringify(req.body || {});
        }
        return "Not JSON";
    }
    return null;
});

// Middleware
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :postJSON"
    )
);

// Routes

app.get("/api/persons", (req, res) => {
    Person.find({})
        .then((result) => {
            result.forEach((person) => {
                console.log(person);
            });
            res.send(result);
        })
        .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log(result);
            return res.status(200).json(result);
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true }
    )
        .then((updatedPerson) => {
            if (!updatedPerson) {
                return res.status(404).json({ error: "Person not found" });
            }
            res.status(200).json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
    const { name: reqName, number: reqNumber } = req.body;
    if (!reqName || !reqNumber) {
        return res.status(400).json({ error: "Name and number are required" });
    }
    // Check for duplicate name
    Person.findOne({ name: reqName })
        .then((existingPerson) => {
            if (existingPerson) {
                return res
                    .status(400)
                    .json({ error: "Person is being duplicated" });
            }
            const newPerson = new Person({ name: reqName, number: reqNumber });

            return newPerson.save();
        })
        .then((savedPerson) => {
            if (savedPerson) {
                res.status(201).json(savedPerson);
            }
        })
        .catch((error) => next(error));
});

app.get("/info", (req, res) => {
    Person.countDocuments()
        .then((count) => {
            return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Phonebook Info</title>
            </head>
            <body>
                <h1>Phonebook has info for ${count || 0} people</h1>
                <p>${new Date()}</p>
            </body>
            </html>
        `);
        })
        .catch((error) => {
            next(error);
        });
});

// Unknown endpoint handler
app.use((req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
