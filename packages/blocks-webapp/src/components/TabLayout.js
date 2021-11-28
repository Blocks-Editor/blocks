import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import EditorPage from './pages/editor/EditorPage';
// import {Layout, Model} from 'flexlayout-react';
// import 'flexlayout-react/style/dark.scss';

// const editorLayoutStorageKey = 'blocks.editorLayout';

// const defaultConfig = {
//     global: {},
//     borders: [],
//     layout: {
//         type: 'row',
//         weight: 100,
//         children: [{
//             type: 'tabset',
//             weight: 50,
//             children: [{
//                 type: 'tab',
//                 name: 'Editor',
//                 component: 'editor',
//                 config: {},
//             }],
//         }],
//     },
// };

// TODO: rewrite for a different layout library

export default function TabLayout() {
    // const model = Model.fromJson(defaultConfig);
    //
    // const factory = node => {
    //     const component = node.getComponent();
    //     const props = node.getConfig() || {};
    //     if(component === 'editor') {
    //         return <EditorPage {...props}/>;
    //     }
    // };
    //
    // return (
    //     <Layout model={model} factory={factory}/>
    // );

    return (
        <EditorPage/>
    );
};
