const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter dog's name."]
    },
    description: String,
    status: {
        type: String,
        enum: ['AVAILABLE', 'ADOPTED'],
        default: 'AVAILABLE'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adoptedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    thankYouMsg: {
        type: String
    }
}, { timestamps: true });

const Dog = mongoose.model('dog', dogSchema);

module.exports = Dog;