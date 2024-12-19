const personsRouter = require("express").Router();
const Person = require("../models/person");
// Routes

personsRouter.get("/", (req, res, next) => {
    Person.find({})
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            next(err);
        });
});

personsRouter.get("/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

personsRouter.delete("/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => next(error));
});

personsRouter.put("/:id", (req, res, next) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" }
    )
        .then((updatedPerson) => {
            if (!updatedPerson) {
                return res.status(404).json({ error: "Person not found" });
            }
            res.status(200).json(updatedPerson);
        })
        .catch((error) => next(error));
});

personsRouter.post("/", (req, res, next) => {
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
                    .json({ error: "Person with this name already exists" });
            }

            const newPerson = new Person({ name: reqName, number: reqNumber });

            newPerson.validateSync();

            return newPerson.save();
        })
        .then((savedPerson) => {
            if (savedPerson) {
                return res.status(201).json(savedPerson);
            }
        })
        .catch((error) => {
            next(error);
        });
});

personsRouter.get("/info", (req, res, next) => {
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

module.exports = personsRouter;
