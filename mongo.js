const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://00szymonkowal:${password}@fullstackcluster.duojr.mongodb.net/personApp?retryWrites=true&w=majority&appName=fullstackCluster`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: name,
    number: number,
});

if (name === undefined) {
    Person.find({}).then((result) => {
        result.forEach((note) => {
            console.log(note);
        });
        mongoose.connection.close();
    });
    return;
}

person.save().then((result) => {
    console.log("Person saved!");
    console.log(result);
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
});
