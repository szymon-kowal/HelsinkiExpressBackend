const mongoose = require("mongoose");

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

personSchema.set("toJSON", {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
