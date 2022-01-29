const categories = [{
    id: 'templates',
    name: 'Templates',
    description: 'Real-world starter projects for tokens and NFTs.',
    className: 'text-primary',
    examples: [
        require('./templates/Dip20Token.blocks.json'),
        require('./templates/Dip721NFT.blocks.json'),
    ],
}, {
    id: 'concepts',
    name: 'Concepts',
    description: 'Reference implementations for learning the editor.',
    className: 'text-success',
    examples: [
        require('./concepts/SimpleCurrency.blocks.json'),
        require('./concepts/TextSharingAPI.blocks.json'),
    ],
}, {
    id: 'dfinity',
    name: 'DFINITY',
    description: 'Official Motoko examples implemented in Blocks.',
    className: 'text-info',
    examples: [
        require('./dfinity/Echo.blocks.json'),
        require('./dfinity/Counter.blocks.json'),
        require('./dfinity/Calculator.blocks.json'),
        // require('./dfinity/WhoAmI.blocks.json'),
        require('./dfinity/PhoneBook.blocks.json'),
        require('./dfinity/ToDoList.blocks.json'),
    ],
}];

const examples = categories.flatMap(category => category.examples);

module.exports = {
    getExampleCategories() {
        return categories;
    },
    getExampleProjects() {
        return examples;
    },
};