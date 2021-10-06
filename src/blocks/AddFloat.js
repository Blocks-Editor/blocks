const {binaryOperator} = require('../block-patterns/operators');

exports.default = binaryOperator('Float', '+', (a, b) => a + b);
