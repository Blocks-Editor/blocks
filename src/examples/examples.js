const categories = [{
    id: 'templates',
    name: 'Templates',
    description: 'Real-world starter projects for NFTs and tokens.',
    className: 'text-primary',
    examples: [
        require('./templates/Dip721NFT.blocks.json'),
        require('./templates/Dip20Token.blocks.json'),
    ],
}, {
    id: 'concepts',
    name: 'Concepts',
    description: 'Reference implementations for learning the editor.',
    className: 'text-success',
    examples: [
        require('./concepts/SimpleNFT.blocks.json'),
        require('./concepts/SimpleCurrency.blocks.json'),
        require('./concepts/TextSharingAPI.blocks.json'),
        require('./concepts/GitHubQuicksort.blocks.json'),
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

const usageMap = new Map();
categories.forEach(category => {
    category.examples.forEach(example => {
        Object.values(example.nodes).forEach(node => {
            let usages = usageMap.get(node.name);
            if(!usages) {
                usageMap.set(node.name, usages = []);
            }
            let found = false;
            usages.forEach(usage => {
                if(usage.example === example) {
                    found = true;
                    usage.count++;
                }
            });
            if(!found) {
                usages.push({category, example, count: 1});
            }
        });
    });
});

export const getExampleCategories = () => categories;
export const getExampleProjects = () => examples;
export const getExampleUsages = (name) => [...usageMap.get(name) || []];
