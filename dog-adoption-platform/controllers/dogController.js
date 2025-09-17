const Dog = require('../models/Dog');

const handleDogErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {};

    // Validation error
    if (err.message.includes('dog validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message; 
        })
    }

    return errors;
} 

module.exports.dog_register_post = async (req, res) => {
    const { name, description } = req.body;

    try {
        const dog = await Dog.create({ 
            name, 
            description,
            ownerId: req.userId
        });

        res.status(201).json({ dog });
    }
    catch (err) {
        const errors = handleDogErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.dog_adopt_post = async (req, res) => {
    const dogId = req.params.id;

    const { thankYouMsg = '' } = req.body || {};

    try {
        const dog = await Dog.findById(dogId);

        if (!dog) {
            return res.status(404).json({ error: 'Dog not found' });
        }

        if (dog.status === 'ADOPTED') {
            return res.status(400).json({
                message: 'Dog already adopted',
                status: dog.status,
                dogId: dog._id,
                adoptedBy: dog.adoptedById 
            })    
        }

        if (dog.ownerId.toString() === req.userId) {
            return res.status(400).json({ error: 'You cannot adopt your own dog.' });
        }

        dog.status = 'ADOPTED';
        dog.adoptedById = req.userId;
        dog.thankYouMsg = thankYouMsg;
        await dog.save();

        res.status(201).json({ dog });
    }
    catch (err) {
        const errors = handleDogErrors(err);
        res.status(400).json({ errors });
    }
}    

module.exports.dog_remove_post = async (req, res) => {
    const dogId = req.params.id;

    try {
        const dog = await Dog.findById(dogId);

        if (!dog) {
            return res.status(404).json({ error: 'Dog not found.' });
        }

        if (dog.status === 'ADOPTED') {
            return res.status(400).json({
                error: 'Cannot delete a dog who has been adopted.',
                status: dog.status,
                dogId: dog._id,
                adoptedBy: dog.adoptedById 
            })    
        }

        if (dog.ownerId.toString() != req.userId) {
            return res.status(400).json({ error: 'Cannot delete other users dog.' });
        }

        await Dog.deleteOne({ _id: dogId });

        res.status(200).json({ message: 'Dog removed successfully.' });
    }
    catch (err) {
        const errors = handleDogErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.dogs_registered_get = async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    try {
        let filter = { ownerId: req.userId };

        if (status) {
            filter.status = status.toUpperCase();
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const dogs = await Dog.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Dog.countDocuments(filter);

        if (total === 0) {
            return res.status(200).json({
                message: "You haven't registered any dogs yet.",
                total: 0,
                dogs
            })
        }

        res.status(200).json({
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            dogs
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch your registered dogs.' });
    }
}

module.exports.dogs_adopted_get = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = { adoptedById: req.userId };

        const dogs = await Dog.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Dog.countDocuments(filter);

        if (total === 0) {
            return res.status(200).json({
                message: "You haven't adopted any dogs yet.",
                total: 0,
                dogs
            })
        }

        res.status(200).json({
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            dogs
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch your adopted dogs' });
    }
}