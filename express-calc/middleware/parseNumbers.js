function parseNumbers(req, res, next) {
    const nums = req.query.nums;

    if (!nums) {
        return next({ status: 400, message: "Numbers are required."});
    }    

    const splitNums = nums.split(',')
    const numsArray = [];

    for (const num of splitNums) {
        let numVal = Number(num);

        if (Number.isNaN(numVal)) {
            return next({ status: 400, message: "Invalid number."});
        }

        numsArray.push(numVal);
    }

    req.numbers = numsArray;
    return next();
}

module.exports = parseNumbers;