const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

console.log("connecting to", url);

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set("toJSON", {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);

// const Person = mongoose.model("Person", personSchema);

// const person = new Person({
//     name: name,
//     number: number,
// });

// if (name === undefined) {
//     Person.find({}).then((result) => {
//         result.forEach((note) => {
//             console.log(note);
//         });
//         mongoose.connection.close();
//     });
//     return;
// }

// person.save().then((result) => {
//     console.log("Person saved!");
//     console.log(result);
//     console.log(`added ${result.name} number ${result.number} to phonebook`);
//     mongoose.connection.close();
// });
