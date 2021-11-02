const examples = [
    require('./files/Echo.blocks.json'),
    require('./files/Counter.blocks.json'),
];

module.exports = {
    getExampleProjects() {
        return examples;
    },
};