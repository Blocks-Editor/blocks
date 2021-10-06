const {binaryOperator} = require('../block-patterns/operators');

exports.default = binaryOperator('Int', '/', (a, b) => Math.floor(a / b));
