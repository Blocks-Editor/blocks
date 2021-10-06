const {binaryOperator} = require('../block-patterns/operators');

exports.default = binaryOperator('Bool', '||', (a, b) => a || b);
