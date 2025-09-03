function modeHelper(arr) {
    const freq = new Map();

    arr.forEach(num =>{
        freq.set(num, (freq.get(num) || 0) + 1);
    })

    let maxCount = 0;
    let modeVal = null;

    for (const [num, count] of freq) {
        if (count > maxCount) {
            maxCount = count;
            modeVal = num;
        }
    }

    return modeVal;
}

module.exports = { modeHelper };