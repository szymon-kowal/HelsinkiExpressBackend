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
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: [
            {
                validator: function (v) {
                    return /\d{2,3}-\d{4,}/.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number! Must be in the format 2/3 numbers - rest numbers (e.g., 12-3456 or 123-45678).`,
            },
            {
                validator: function (v) {
                    // Ensure the total number of digits is at least 8
                    const digitCount = v.replace(/[^0-9]/g, "").length; // Remove non-digit characters and count the digits
                    return digitCount >= 8;
                },
                message: (props) =>
                    `${props.value} must contain at least 8 digits in total.`,
            },
        ],
        required: [true, "User phone number is required"],
    },
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
