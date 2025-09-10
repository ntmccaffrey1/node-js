const { validate } = require('jsonschema');

function validateJSON(schema) {
    return function(req, res, next) {
        const validation = validate(req.body, schema);
        
        if (!validation.valid) {
            const errors = validation.errors.map(err =>
                err.stack.replace(/^instance\./, '')
            );
        
            return res.status(400).json({
                error: "Validation failed.",
                details: errors
            })
        }

        return next();
    }    
}

module.exports = validateJSON;