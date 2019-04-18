
function parseField(field){
    return field.split(/\[|\]/).filter(s => s);
}

function getField(req, field){
    let val = req.body;
    console.log('field', field);
    field.forEach(prop => {
        val = val[prop];
    });

    return val;
}

exports.required = function (field) {
    field = parseField(field);
    return (req, res, next) => {
        if(getField(req, field)){
            next();
        } else {
            res.status(500).json({error: `${field.join(' ')}is required`});
        }
    }
};

exports.lengthAbove = (field, len) => {
    field = parseField(field);
    return (req, res, next) => {
        if(getField(req, field, next).length > len){
            next();
        } else {
            res.status(500).json({error: `${field.join(' ')}is required ${len} characters`});
        }
    }
};
