const examples = [
    require('./files/Echo.blocks.json'),
    require('./files/Counter.blocks.json'),
    require('./files/Calculator.blocks.json'),
    require('./files/PhoneBook.blocks.json'),
];

module.exports = {
    getExampleProjects() {
        return examples;
    },
};