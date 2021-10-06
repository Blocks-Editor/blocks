const {unaryOperator} = require('../block-patterns/operators');

exports.default = unaryOperator('Bool', '!', (a) => !a);
