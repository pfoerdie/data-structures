const ArraySet = require('./ArraySet.js');

const tmp1 = new ArraySet(1, 2, 4, 2, 3, 3, 1, 45, 5, 4, 3, 1);
const tmp2 = ArraySet.from([1, 2, 4, 2, 3, 3, 1, 45, 5, 4, 3, 1]);
const tmp3 = ArraySet.of(1, 2, 4, 2, 3, 3, 1, 45, 5, 4, 3, 1);

console.log(tmp1, tmp2, tmp3);
debugger;